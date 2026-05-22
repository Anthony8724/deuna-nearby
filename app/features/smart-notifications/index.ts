export type {
  UserLocation,
  UserLocationError,
  UserLocationErrorCode,
  SmartNotification,
  SmartNotificationContent,
  NotificationContentSource,
  Recomendacion,
  RecomendacionScoreBreakdown,
  ComercioCandidato,
  ComercioCategoria,
  PromocionActiva,
  PromocionTipo,
} from "./types";

export { QUITO_LOCATION_PRESETS, DEFAULT_SIMULATED_LOCATION } from "./data/quitoLocationPresets";
export type { QuitoLocationPreset } from "./data/quitoLocationPresets";
export { MERCHANTS_CATALOG } from "./data/merchantsCatalog";
export { SCORE_WEIGHTS } from "./services/scoring";

export { useUserLocation } from "./hooks/useUserLocation";
export { useSmartNotifications } from "./hooks/useSmartNotifications";
export type {
  UseSmartNotificationsOptions,
  UseSmartNotificationsReturn,
  GenerateNotificationOptions,
  UltimaNotificacion,
  SmartNotificationsError,
} from "./hooks/useSmartNotifications";

export {
  recommendationService,
  getSmartRecommendations,
  calculateDistance,
} from "./services/recommendationService";
export type { GetSmartRecommendationsOptions } from "./services/recommendationService";
export {
  notificationGenerator,
  createAIClient,
  generateSmartNotification,
  generateWithAI,
  generateFallbackNotification,
  generatePromptForAI,
  generateNotifications,
  normalizeNotificationContent,
  NotificationGeneratorError,
  MAX_BODY_LENGTH,
} from "./services/notificationGenerator";
export type {
  GenerateSmartNotificationOptions,
  GenerateSmartNotificationResult,
  NotificationGeneratorErrorCode,
} from "./services/notificationGenerator";

export { DeUnaNearbyExperience } from "./components/integrated/DeUnaNearbyExperience";
export { DeUnaHomeScreen } from "./components/integrated/DeUnaHomeScreen";
export type { DeUnaHomeScreenProps } from "./components/integrated/DeUnaHomeScreen";
export {
  SmartRecommendationsSection,
} from "./components/SmartRecommendationsSection";
export type { SmartRecommendationsSectionProps } from "./components/SmartRecommendationsSection";
export { CercaDeTiMerchantCard } from "./components/CercaDeTiMerchantCard";
export type { CercaDeTiMerchantCardProps } from "./components/CercaDeTiMerchantCard";
export {
  CERCA_DE_TI_BASELINE_MERCHANTS,
} from "./data/cercaDeTiBaselineMerchants";
export type { CercaDeTiBaselineMerchant } from "./data/cercaDeTiBaselineMerchants";
export {
  beneficioCercaDeTiLine,
  recomendacionToCercaDeTiCard,
} from "./lib/cercaDeTiCard";
export type { CercaDeTiCardModel } from "./lib/cercaDeTiCard";
export { PremiumPhoneMockup } from "./components/integrated/PremiumPhoneMockup";
export {
  SmartPushNotification,
  smartPushPropsFromRecomendacion,
} from "./components/SmartPushNotification";
export type { SmartPushNotificationProps } from "./components/SmartPushNotification";
export { ComoLlegarButton } from "./components/ComoLlegarButton";
export type { ComoLlegarButtonProps } from "./components/ComoLlegarButton";
export { PromoHeroCard } from "./components/PromoHeroCard";
export type { PromoHeroCardProps } from "./components/PromoHeroCard";
export { ContextualRecommendationPanel } from "./components/ContextualRecommendationPanel";
export type { ContextualRecommendationPanelProps } from "./components/ContextualRecommendationPanel";
export {
  SmartBenefitBottomSheet,
  smartBenefitSheetPropsFromRecomendacion,
} from "./components/SmartBenefitBottomSheet";
export type { SmartBenefitBottomSheetProps } from "./components/SmartBenefitBottomSheet";
export { SmartNotificationSimulator } from "./components/SmartNotificationSimulator";
export type { SmartNotificationSimulatorProps } from "./components/SmartNotificationSimulator";
export { AIInsightPanel } from "./components/AIInsightPanel";
export { DEMO_USER, DEMO_SCORE_THRESHOLD } from "./config/demo";
export {
  formatBeneficioFromRecomendacion,
  formatTiempoRestantePromo,
} from "./lib/beneficios";
export { buildRazonIA } from "./lib/contextualCopy";
export type { AIInsightPanelProps } from "./components/AIInsightPanel";
export { buildAIInsightSnapshot } from "./lib/aiInsights";
export type {
  AIInsightSnapshot,
  AIInsightBadge,
  WhyBullet,
} from "./lib/aiInsights";
export { NearbyMomentsFeed } from "./components/NearbyMomentsFeed";
export type { NearbyMomentsFeedProps } from "./components/NearbyMomentsFeed";
export { NearbyMomentsSection } from "./components/NearbyMomentsSection";
export type { NearbyMomentsSectionProps } from "./components/NearbyMomentsSection";
export {
  pushAlertLine,
  pushConversationalMessage,
  pushBeneficioDeUnaPhrase,
  categoriaInteresLabel,
  formatDistanciaCompacta,
  pushBeneficioLine,
  pushBodyLine,
  momentContextLine,
  contextualReasonShort,
  contextualReasonSheet,
  WHY_BULLET_LABELS,
} from "./lib/nearbyCopy";
export { buildMomentContextCopy } from "./lib/momentCopy";
export {
  buildGoogleMapsDirectionsUrl,
  openGoogleMapsNavigation,
} from "./lib/googleMapsNavigation";
export type {
  GoogleMapsTravelMode,
  OpenGoogleMapsNavigationOptions,
  OpenGoogleMapsNavigationResult,
} from "./lib/googleMapsNavigation";
export { NearbyMomentCard } from "./components/NearbyMomentCard";
export type { NearbyMomentCardProps } from "./components/NearbyMomentCard";
export {
  NearbyMomentCardFull,
  nearbyMomentCardPropsFromRecomendacion,
} from "./components/NearbyMomentCardFull";
export type { NearbyMomentCardFullProps } from "./components/NearbyMomentCardFull";
export { RecommendationDetailSheet } from "./components/RecommendationDetailSheet";
export type { RecommendationDetailSheetProps } from "./components/RecommendationDetailSheet";
export {
  resolveCardRecomendacion,
  syntheticRecomendacionFromCard,
} from "./lib/resolveCardRecomendacion";
export {
  PushNotificationPreview,
  pushPreviewPropsFromUltimaNotificacion,
} from "./components/PushNotificationPreview";
export type { PushNotificationPreviewProps } from "./components/PushNotificationPreview";
