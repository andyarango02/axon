'use strict';

const config = require('./shared/config');

// ── Infrastructure ──────────────────────────────────────────
// const { getSupabaseClient }  = require('./infrastructure/persistence/supabase/SupabaseClient');
// const { getTwilioClient }    = require('./infrastructure/messaging/twilio/TwilioClient');
// const { getOpenAIClient }    = require('./infrastructure/ai/openai/OpenAIClient');
// const InMemoryEventBus       = require('./infrastructure/events/InMemoryEventBus');
// const JwtService             = require('./infrastructure/auth/JwtService');

// ── Repositories ────────────────────────────────────────────
// const ConversationRepository      = require('./infrastructure/persistence/supabase/ConversationRepository');
// const QuotationRepository         = require('./infrastructure/persistence/supabase/QuotationRepository');
// const OpportunityRepository       = require('./infrastructure/persistence/supabase/OpportunityRepository');
// const CustomerRepository          = require('./infrastructure/persistence/supabase/CustomerRepository');
// const ProductRepository           = require('./infrastructure/persistence/supabase/ProductRepository');
// const PricingRuleRepository       = require('./infrastructure/persistence/supabase/PricingRuleRepository');
// const WorkflowDefinitionRepository = require('./infrastructure/persistence/supabase/WorkflowDefinitionRepository');
// const WorkflowExecutionRepository = require('./infrastructure/persistence/supabase/WorkflowExecutionRepository');
// const TenantRepository            = require('./infrastructure/persistence/supabase/TenantRepository');
// const UserRepository              = require('./infrastructure/persistence/supabase/UserRepository');

// ── AI & Messaging ──────────────────────────────────────────
// const OpenAIService          = require('./infrastructure/ai/openai/OpenAIService');
// const TwilioWhatsAppService  = require('./infrastructure/messaging/twilio/TwilioWhatsAppService');

// ── Use Cases ───────────────────────────────────────────────
// const HandleIncomingMessage  = require('./application/conversation/use-cases/HandleIncomingMessage');
// const GenerateQuotationDraft = require('./application/quotation/use-cases/GenerateQuotationDraft');

// ── Interface ───────────────────────────────────────────────
const { createApp }        = require('./interface/app');
const errorHandler         = require('./interface/http/middleware/errorHandler.middleware');
const webhookRoutes        = require('./interface/http/routes/webhook.routes');
const authRoutes           = require('./interface/http/routes/auth.routes');
const quotationRoutes      = require('./interface/http/routes/quotation.routes');
const pipelineRoutes       = require('./interface/http/routes/pipeline.routes');
const conversationRoutes   = require('./interface/http/routes/conversation.routes');
const catalogRoutes        = require('./interface/http/routes/catalog.routes');
const workflowRoutes       = require('./interface/http/routes/workflow.routes');

// Placeholder handler — all stub endpoints return 501 until use-cases are wired
const notImplemented = (req, res) =>
  res.status(501).json({ error: 'Not implemented' });

// Proxy that turns any controller method access into a notImplemented handler
const stubController = new Proxy(
  {},
  { get: () => notImplemented }
);

// Passthrough middleware stubs until auth/tenant services are wired
const passthrough = (req, res, next) => next();

async function bootstrap() {
  const app = createApp({
    webhookRoutes: webhookRoutes({
      webhookController:        stubController,
      validateTwilioSignature:  passthrough,
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
      conversationController: stubController,
      authMiddleware:         passthrough,
      tenantMiddleware:       passthrough,
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
