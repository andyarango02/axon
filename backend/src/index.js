'use strict';

const config = require('./shared/config');

// ── Infrastructure ──────────────────────────────────────────
const { getSupabaseClient } = require('./infrastructure/persistence/supabase/SupabaseClient');
const InMemoryEventBus      = require('./infrastructure/events/InMemoryEventBus');

// ── Repositories ────────────────────────────────────────────
const CustomerRepository     = require('./infrastructure/persistence/supabase/CustomerRepository');
const ConversationRepository = require('./infrastructure/persistence/supabase/ConversationRepository');
const MessageRepository      = require('./infrastructure/persistence/supabase/MessageRepository');
// const QuotationRepository         = require('./infrastructure/persistence/supabase/QuotationRepository');
// const OpportunityRepository       = require('./infrastructure/persistence/supabase/OpportunityRepository');
// const ProductRepository           = require('./infrastructure/persistence/supabase/ProductRepository');
// const PricingRuleRepository       = require('./infrastructure/persistence/supabase/PricingRuleRepository');
// const WorkflowDefinitionRepository = require('./infrastructure/persistence/supabase/WorkflowDefinitionRepository');
// const WorkflowExecutionRepository = require('./infrastructure/persistence/supabase/WorkflowExecutionRepository');
// const TenantRepository            = require('./infrastructure/persistence/supabase/TenantRepository');
// const UserRepository              = require('./infrastructure/persistence/supabase/UserRepository');

// ── Use Cases ───────────────────────────────────────────────
const FindOrCreateCustomer   = require('./application/customer/use-cases/FindOrCreateCustomer');
const HandleIncomingMessage  = require('./application/conversation/use-cases/HandleIncomingMessage');
const GetConversationHistory = require('./application/conversation/use-cases/GetConversationHistory');
// const GenerateQuotationDraft = require('./application/quotation/use-cases/GenerateQuotationDraft');

// ── Controllers ─────────────────────────────────────────────
const WebhookController      = require('./interface/http/controllers/WebhookController');
const ConversationController = require('./interface/http/controllers/ConversationController');

// ── Interface ───────────────────────────────────────────────
const { createApp }      = require('./interface/app');
const errorHandler       = require('./interface/http/middleware/errorHandler.middleware');
const webhookRoutes      = require('./interface/http/routes/webhook.routes');
const authRoutes         = require('./interface/http/routes/auth.routes');
const quotationRoutes    = require('./interface/http/routes/quotation.routes');
const pipelineRoutes     = require('./interface/http/routes/pipeline.routes');
const conversationRoutes = require('./interface/http/routes/conversation.routes');
const catalogRoutes      = require('./interface/http/routes/catalog.routes');
const workflowRoutes     = require('./interface/http/routes/workflow.routes');

// Stubs for domains not yet implemented
const notImplemented = (req, res) =>
  res.status(501).json({ error: 'Not implemented' });

const stubController = new Proxy({}, { get: () => notImplemented });
const passthrough    = (req, res, next) => next();

async function bootstrap() {
  const supabase = getSupabaseClient();
  const eventBus = new InMemoryEventBus();

  // repositories
  const customerRepository     = new CustomerRepository(supabase);
  const conversationRepository = new ConversationRepository(supabase);
  const messageRepository      = new MessageRepository(supabase);

  // use cases
  // eslint-disable-next-line no-unused-vars
  const findOrCreateCustomer   = new FindOrCreateCustomer({ customerRepository, eventBus });
  const handleIncomingMessage  = new HandleIncomingMessage({ conversationRepository, customerRepository, messageRepository, eventBus });
  const getConversationHistory = new GetConversationHistory({ conversationRepository, messageRepository });

  // controllers
  const webhookController      = new WebhookController({ handleIncomingMessage });
  const conversationController = new ConversationController({ getConversationHistory });

  const app = createApp({
    webhookRoutes: webhookRoutes({
      webhookController,
      validateTwilioSignature: passthrough,
    }),
    authRoutes: authRoutes({
      authController: stubController,
    }),
    quotationRoutes: quotationRoutes({
      quotationController: stubController,
      authMiddleware:      passthrough,
      tenantMiddleware:    passthrough,
    }),
    pipelineRoutes: pipelineRoutes({
      pipelineController: stubController,
      authMiddleware:     passthrough,
      tenantMiddleware:   passthrough,
    }),
    conversationRoutes: conversationRoutes({
      conversationController,
      authMiddleware:  passthrough,
      tenantMiddleware: passthrough,
    }),
    catalogRoutes: catalogRoutes({
      catalogController: stubController,
      authMiddleware:    passthrough,
      tenantMiddleware:  passthrough,
    }),
    workflowRoutes: workflowRoutes({
      workflowController: stubController,
      authMiddleware:     passthrough,
      tenantMiddleware:   passthrough,
    }),
    errorHandler,
  });

  app.listen(config.port, () => {
    console.log(`[axon] backend running on port ${config.port} (${config.nodeEnv})`);
  });
}

bootstrap().catch((err) => {
  console.error('[axon] fatal startup error', err);
  process.exit(1);
});
