// CloudBees Feature Management (Rox) integration
import Rox, { type FetcherResults, type RoxSetupOptions } from 'rox-browser';

// Define feature flags with default values
export class FeatureFlags {
  // Search algorithm variant - controls vehicle sorting on browse page
  public searchAlgorithm = new Rox.RoxString('price-low-to-high', [
    'price-low-to-high',
    'newest-first',
    'recommended',
  ]);

  // Dealer ratings display - shows/hides dealer ratings on vehicle cards
  public showDealerRatings = new Rox.Flag(true);

  // Instant trade-in feature - changes trade-in valuation page messaging
  public enableInstantTradeIn = new Rox.Flag(false);

  // Advanced filtering options on search page
  public enableAdvancedFilters = new Rox.Flag(false);

  // Pricing display variant - how prices are shown
  public pricingDisplay = new Rox.RoxString('total-price', [
    'total-price',
    'monthly-payment',
    'both',
  ]);

  // Financing calculator on vehicle detail page
  public showFinancingCalculator = new Rox.Flag(false);

  // 360-degree photo viewer
  public enable360Photos = new Rox.Flag(true);

  // Vehicle recommendations algorithm
  public vehicleRecommendations = new Rox.RoxString('price-based', [
    'price-based',
    'feature-based',
    'ai-powered',
  ]);
}

// Create feature flags instance
export const flags = new FeatureFlags();

// Configuration for CloudBees FM
interface RoxConfig {
  apiKey?: string;
  devModeSecret?: string;
}

// Initialize Rox with the feature flags
export async function initializeFeatureFlags(config: RoxConfig = {}): Promise<void> {
  // Register the feature flags container
  Rox.register('autostack', flags);

  // Setup Rox with configuration
  const roxConfig: RoxSetupOptions = {
    // Note: debugLevel removed for security - prevents API key from being logged to console
    configurationFetchedHandler: (fetcherResults: FetcherResults) => {
      console.log('[FeatureFlags] Configuration fetched:', {
        hasChanges: fetcherResults.hasChanges,
        source: fetcherResults.fetcherStatus,
      });
      // Update snapshot when configuration changes (reactive pattern)
      setFlagsSnapshot('fetched');
    },
  };

  try {
    // Try to fetch FM key from runtime config file (deployed via Helm)
    // Falls back to build-time env var for local development
    let apiKey = config.apiKey || import.meta.env.VITE_ROX_API_KEY || '';

    // In production (deployed via Helm), fetch from runtime config
    // Use base URL to handle path-based deployments correctly
    if (!apiKey) {
      try {
        // Ensure proper path construction with BASE_URL (may or may not have trailing slash)
        const baseUrl = import.meta.env.BASE_URL.endsWith('/')
          ? import.meta.env.BASE_URL
          : `${import.meta.env.BASE_URL}/`;
        const configPath = `${baseUrl}config/fm.json`;
        console.log('[FeatureFlags] Fetching FM config from:', configPath);
        const response = await fetch(configPath);
        if (response.ok) {
          const fmConfig = await response.json();
          apiKey = fmConfig.envKey || '';
          if (apiKey) {
            console.log('[FeatureFlags] Loaded FM key from runtime config');
          }
        }
      } catch (fetchError) {
        console.log('[FeatureFlags] No runtime config found, using defaults');
      }
    }

    if (apiKey) {
      await Rox.setup(apiKey, roxConfig);
      console.log('[FeatureFlags] CloudBees FM initialized successfully');
    } else {
      console.warn(
        '[FeatureFlags] No API key provided, using default flag values. ' +
        'Set VITE_ROX_API_KEY environment variable to connect to CloudBees FM.'
      );
      // In dev mode without API key, we can still use the default values
      await Rox.setup('', roxConfig);
    }

    // Initialize snapshot after setup
    setFlagsSnapshot('initialized');
  } catch (error) {
    console.error('[FeatureFlags] Failed to initialize CloudBees FM:', error);
    // Continue with default values if setup fails
    // Initialize snapshot even if setup fails
    setFlagsSnapshot('error');
  }
}

// Helper functions to check flag values
export function getSearchAlgorithm(): string {
  return flags.searchAlgorithm.getValue();
}

export function isDealerRatingsEnabled(): boolean {
  return flags.showDealerRatings.isEnabled();
}

export function isInstantTradeInEnabled(): boolean {
  return flags.enableInstantTradeIn.isEnabled();
}

export function isAdvancedFiltersEnabled(): boolean {
  return flags.enableAdvancedFilters.isEnabled();
}

export function getPricingDisplay(): string {
  return flags.pricingDisplay.getValue();
}

export function isFinancingCalculatorEnabled(): boolean {
  return flags.showFinancingCalculator.isEnabled();
}

export function is360PhotosEnabled(): boolean {
  return flags.enable360Photos.isEnabled();
}

export function getVehicleRecommendations(): string {
  return flags.vehicleRecommendations.getValue();
}

// Reactive feature flags pattern (inspired by AccountStack)
// Snapshot of current flag values
let _snapshot: Record<string, boolean | string> = {};

// Listeners for flag changes
const listeners = new Set<(reason: string, snapshot: Record<string, boolean | string>) => void>();

// Build snapshot by evaluating all flags once
function buildSnapshot(): Record<string, boolean | string> {
  return {
    searchAlgorithm: flags.searchAlgorithm.getValue(),
    showDealerRatings: flags.showDealerRatings.isEnabled(),
    enableInstantTradeIn: flags.enableInstantTradeIn.isEnabled(),
    enableAdvancedFilters: flags.enableAdvancedFilters.isEnabled(),
    pricingDisplay: flags.pricingDisplay.getValue(),
    showFinancingCalculator: flags.showFinancingCalculator.isEnabled(),
    enable360Photos: flags.enable360Photos.isEnabled(),
    vehicleRecommendations: flags.vehicleRecommendations.getValue(),
  };
}

// Get current snapshot
export function getFlagsSnapshot(): Record<string, boolean | string> {
  return _snapshot;
}

// Update snapshot and notify listeners
export function setFlagsSnapshot(reason: string): void {
  _snapshot = buildSnapshot();
  console.log('[FeatureFlags] Snapshot updated:', reason, _snapshot);
  listeners.forEach((listener) => {
    try {
      listener(reason, _snapshot);
    } catch (error) {
      console.error('[FeatureFlags] Listener error:', error);
    }
  });
}

// Subscribe to flag changes
export function subscribeFlags(
  callback: (reason: string, snapshot: Record<string, boolean | string>) => void
): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

// Hook for React components to use feature flags
export function useFeatureFlags() {
  return {
    searchAlgorithm: getSearchAlgorithm(),
    showDealerRatings: isDealerRatingsEnabled(),
    enableInstantTradeIn: isInstantTradeInEnabled(),
    enableAdvancedFilters: isAdvancedFiltersEnabled(),
    pricingDisplay: getPricingDisplay(),
    showFinancingCalculator: isFinancingCalculatorEnabled(),
    enable360Photos: is360PhotosEnabled(),
    vehicleRecommendations: getVehicleRecommendations(),
  };
}
