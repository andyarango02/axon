'use strict';

const config = require('./shared/config');

// ── Infrastructure ──────────────────────────────────────────
const { getSupabaseClient }    = require('./infrastructure/persistence/supabase/SupabaseClient');
const QuotationPDFGenerator    = require('./infrastructure/pdf/QuotationPDFGenerator');
const InMemoryEventBus         = require('./infrastructure/events/InMemoryEventBus');
const { getOpenAIClient }      = require('./infrastructure/ai/openai/OpenAIClient');
const OpenAIService            = require('./infrastructure/ai/openai/OpenAIService');
const { getTwilioClient }      = require('./infrastructure/messaging/twilio/TwilioClient');
const TwilioWhatsAppService    = require('./infrastructure/messaging/twilio/TwilioWhatsAppService');

// ── Repositories ────────────────────────────────────────────
const CustomerRepository     = require('./infrastructure/persistence/supabase/CustomerRepository');
const ConversationRepository = require('./infrastructure/persistence/supabase/ConversationRepository');
const MessageRepository      = require('./infrastructure/persistence/supabase/MessageRepository');
const ProductRepository      = require('./infrastructure/persistence/supabase/ProductRepository');
const PricingRuleRepository  = require('./infrastructure/persistence/supabase/PricingRuleRepository');
const PriceListRepository    = require('./infrastructure/persistence/supabase/PriceListRepository');
const QuotationRepository    = require('./infrastructure/persistence/supabase/QuotationRepository');
// const OpportunityRepository       = require('./infrastructure/persistence/supabase/OpportunityRepository');
// const WorkflowDefinitionRepository = require('./infrastructure/persistence/supabase/WorkflowDefinitionRepository');
// const WorkflowExecutionRepository = require('./infrastructure/persistence/supabase/WorkflowExecutionRepository');
const TenantRepository            = require('./infrastructure/persistence/supabase/TenantRepository');
// const UserRepository              = require('./infrastructure/persistence/supabase/UserRepository');

// ── Domain services ─────────────────────────────────────────
const PriceCalculator = require('./domain/catalog/services/PriceCalculator');

// ── Use Cases — settings ─────────────────────────────────────
const GetBotConfig    = require('./application/settings/use-cases/GetBotConfig');
const UpdateBotConfig = require('./application/settings/use-cases/UpdateBotConfig');

// ── Use Cases — conversation ─────────────────────────────────
const FindOrCreateCustomer   = require('./application/customer/use-cases/FindOrCreateCustomer');
const HandleIncomingMessage  = require('./application/conversation/use-cases/HandleIncomingMessage');
const GetConversationHistory = require('./application/conversation/use-cases/GetConversationHistory');
const ListConversations      = require('./application/conversation/use-cases/ListConversations');
const SendHumanMessage       = require('./application/conversation/use-cases/SendHumanMessage');

// ── Use Cases — catalog ──────────────────────────────────────
const SearchProducts    = require('./application/catalog/use-cases/SearchProducts');
const CreateProduct     = require('./application/catalog/use-cases/CreateProduct');
const UpdateProduct     = require('./application/catalog/use-cases/UpdateProduct');
const DeleteProduct     = require('./application/catalog/use-cases/DeleteProduct');
const CreatePricingRule = require('./application/catalog/use-cases/CreatePricingRule');
const UpdatePricingRule = require('./application/catalog/use-cases/UpdatePricingRule');
const DeletePricingRule = require('./application/catalog/use-cases/DeletePricingRule');
const GetPricingRule    = require('./application/catalog/use-cases/GetPricingRule');
const ListPricingRules  = require('./application/catalog/use-cases/ListPricingRules');
const CreatePriceList   = require('./application/catalog/use-cases/CreatePriceList');
const ManagePriceList   = require('./application/catalog/use-cases/ManagePriceList');
const ListPriceLists    = require('./application/catalog/use-cases/ListPriceLists');
const GetPriceForProduct = require('./application/catalog/use-cases/GetPriceForProduct');

// ── Use Cases — quotation ────────────────────────────────────
const GenerateQuotationDraft = require('./application/quotation/use-cases/GenerateQuotationDraft');
const ListQuotations         = require('./application/quotation/use-cases/ListQuotations');
const GetQuotationById       = require('./application/quotation/use-cases/GetQuotationById');
const ApproveQuotation       = require('./application/quotation/use-cases/ApproveQuotation');
const RejectQuotation        = require('./application/quotation/use-cases/RejectQuotation');
const EditQuotation          = require('./application/quotation/use-cases/EditQuotation');
const SendQuotation          = require('./application/quotation/use-cases/SendQuotation');
const GetQuotationPDF        = require('./application/quotation/use-cases/GetQuotationPDF');

// ── Controllers ─────────────────────────────────────────────
const AuthController         = require('./interface/http/controllers/AuthController');
const WebhookController      = require('./interface/http/controllers/WebhookController');
const ConversationController = require('./interface/http/controllers/ConversationController');
const CatalogController      = require('./interface/http/controllers/CatalogController');
const QuotationController    = require('./interface/http/controllers/QuotationController');
const SettingsController     = require('./interface/http/controllers/SettingsController');

// ── Interface ───────────────────────────────────────────────
const { createApp }      = require('./interface/app');
const errorHandler              = require('./interface/http/middleware/errorHandler.middleware');
const validateTwilioSignature   = require('./interface/http/middleware/validateTwilioSignature');
const { createAuthMiddleware }  = require('./interface/http/middleware/authMiddleware');
const { createTenantMiddleware} = require('./interface/http/middleware/tenantMiddleware');
const webhookRoutes             = require('./interface/http/routes/webhook.routes');
const authRoutes         = require('./interface/http/routes/auth.routes');
const quotationRoutes    = require('./interface/http/routes/quotation.routes');
const pipelineRoutes     = require('./interface/http/routes/pipeline.routes');
const conversationRoutes = require('./interface/http/routes/conversation.routes');
const catalogRoutes      = require('./interface/http/routes/catalog.routes');
const workflowRoutes     = require('./interface/http/routes/workflow.routes');
const settingsRoutes     = require('./interface/http/routes/settings.routes');

// Stubs for domains not yet implemented
const notImplemented = (req, res) =>
  res.status(501).json({ error: 'Not implemented' });

const stubController = new Proxy({}, { get: () => notImplemented });
const passthrough    = (req, res, next) => next(); // kept only for routes not yet protected

async function bootstrap() {
  const supabase = getSupabaseClient();
  const eventBus = new InMemoryEventBus();

  // repositories
  const customerRepository     = new CustomerRepository(supabase);
  const conversationRepository = new ConversationRepository(supabase);
  const messageRepository      = new MessageRepository(supabase);
  const productRepository      = new ProductRepository(supabase);
  const pricingRuleRepository  = new PricingRuleRepository(supabase);
  const priceListRepository    = new PriceListRepository(supabase);
  const quotationRepository    = new QuotationRepository(supabase);
  const tenantRepository       = new TenantRepository(supabase);

  // domain services
  const priceCalculator    = new PriceCalculator();
  const pdfGenerator       = new QuotationPDFGenerator();

  // AI service — null when OPENAI_API_KEY is absent (storage-only mode)
  const aiService = config.openai.apiKey
    ? new OpenAIService(getOpenAIClient(), { model: config.openai.model })
    : null;

  if (!aiService) {
    console.warn('[axon] OPENAI_API_KEY not set — running in storage-only mode (no AI processing)');
  }

  // Messaging service — null when Twilio credentials are absent
  const messagingService = (config.twilio.accountSid && config.twilio.authToken)
    ? new TwilioWhatsAppService(
        getTwilioClient(),
        { whatsappFrom: config.twilio.whatsappFrom },
      )
    : null;

  if (!messagingService) {
    console.warn('[axon] Twilio credentials not set — outbound messaging disabled');
  }

  // Auth middleware (real — validates Supabase JWT)
  const authMiddleware   = createAuthMiddleware(supabase);
  const tenantMiddleware = createTenantMiddleware(supabase);
  const authController   = new AuthController(supabase);

  // use cases — conversation (partial: HandleIncomingMessage is wired after catalog + quotation)
  // eslint-disable-next-line no-unused-vars
  const findOrCreateCustomer   = new FindOrCreateCustomer({ customerRepository, eventBus });
  const getConversationHistory = new GetConversationHistory({ conversationRepository, messageRepository });
  const listConversations      = new ListConversations({ conversationRepository });
  const sendHumanMessage       = new SendHumanMessage({
    conversationRepository,
    customerRepository,
    messageRepository,
    messagingService,
  });

  // use cases — catalog
  const catalogUseCases = {
    searchProducts:    new SearchProducts({ productRepository }),
    createProduct:     new CreateProduct({ productRepository }),
    updateProduct:     new UpdateProduct({ productRepository, eventBus }),
    deleteProduct:     new DeleteProduct({ productRepository }),
    createPricingRule: new CreatePricingRule({ pricingRuleRepository }),
    updatePricingRule: new UpdatePricingRule({ pricingRuleRepository }),
    deletePricingRule: new DeletePricingRule({ pricingRuleRepository }),
    getPricingRule:    new GetPricingRule({ pricingRuleRepository }),
    listPricingRules:  new ListPricingRules({ pricingRuleRepository }),
    createPriceList:   new CreatePriceList({ priceListRepository }),
    managePriceList:   new ManagePriceList({ priceListRepository }),
    listPriceLists:    new ListPriceLists({ priceListRepository }),
    getPriceForProduct: new GetPriceForProduct({ productRepository, pricingRuleRepository, priceCalculator }),
  };

  // use cases — quotation
  const quotationUseCases = {
    generateQuotationDraft: new GenerateQuotationDraft({
      quotationRepository,
      productRepository,
      pricingRuleRepository,
      priceCalculator,
      eventBus,
    }),
    listQuotations:   new ListQuotations({ quotationRepository }),
    getQuotationById: new GetQuotationById({ quotationRepository }),
    approveQuotation: new ApproveQuotation({ quotationRepository, eventBus }),
    rejectQuotation:  new RejectQuotation({ quotationRepository, eventBus }),
    editQuotation:    new EditQuotation({ quotationRepository }),
    getQuotationPDF:  new GetQuotationPDF({ quotationRepository, customerRepository, pdfGenerator }),
    sendQuotation:    new SendQuotation({
      quotationRepository,
      customerRepository,
      messageRepository,
      messagingService,
      pdfGenerator,
    }),
  };

  // settings use cases + controller
  const settingsUseCases = {
    getBotConfig:    new GetBotConfig({ tenantRepository }),
    updateBotConfig: new UpdateBotConfig({ tenantRepository }),
  };
  const settingsController = new SettingsController(settingsUseCases);

  // HandleIncomingMessage — wired after catalog + quotation use cases are ready
  const handleIncomingMessage = new HandleIncomingMessage({
    conversationRepository,
    customerRepository,
    messageRepository,
    eventBus,
    aiService,
    searchProducts:        catalogUseCases.searchProducts,
    generateQuotationDraft: quotationUseCases.generateQuotationDraft,
    tenantRepository,
  });

  // controllers
  const webhookController      = new WebhookController({ handleIncomingMessage, messagingService, messageRepository });
  const conversationController = new ConversationController({ getConversationHistory, listConversations, sendHumanMessage });
  const catalogController      = new CatalogController(catalogUseCases);
  const quotationController    = new QuotationController(quotationUseCases);

  const app = createApp({
    webhookRoutes: webhookRoutes({
      webhookController,
      validateTwilioSignature,
    }),
    authRoutes: authRoutes({
      authController,
      authMiddleware,
      tenantMiddleware,
    }),
    quotationRoutes: quotationRoutes({
      quotationController,
      authMiddleware,
      tenantMiddleware,
    }),
    pipelineRoutes: pipelineRoutes({
      pipelineController: stubController,
      authMiddleware:     passthrough,
      tenantMiddleware:   passthrough,
    }),
    conversationRoutes: conversationRoutes({
      conversationController,
      authMiddleware,
      tenantMiddleware,
    }),
    catalogRoutes: catalogRoutes({
      catalogController,
      authMiddleware,
      tenantMiddleware,
    }),
    workflowRoutes: workflowRoutes({
      workflowController: stubController,
      authMiddleware:     passthrough,
      tenantMiddleware:   passthrough,
    }),
    settingsRoutes: settingsRoutes({
      settingsController,
      authMiddleware,
      tenantMiddleware,
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
