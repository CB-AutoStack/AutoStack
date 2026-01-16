/**
 * CloudBees Feature Management (Rox) Integration
 * Falls back to default values if FM is not configured
 */

// Simple flag objects that work without rox-browser
class SimpleFlag {
  constructor(private defaultValue: boolean) {}
  isEnabled(): boolean {
    return this.defaultValue;
  }
}

class SimpleVariant {
  constructor(private defaultValue: string) {}
  getValue(): string {
    return this.defaultValue;
  }
}

// Define feature flags with fallback implementations
export const Flags = {
  searchAlgorithm: new SimpleVariant('price-low-to-high'),
  enableAdvancedFilters: new SimpleFlag(false),
  showDealerRatings: new SimpleFlag(true),
  pricingDisplay: new SimpleVariant('total-price'),
  enableInstantTradeIn: new SimpleFlag(false),
  showFinancingCalculator: new SimpleFlag(true),
  enable360Photos: new SimpleFlag(false),
  vehicleRecommendations: new SimpleVariant('price-based'),
};

/**
 * Initialize feature flags
 * Reads FM_KEY from environment or uses local mode
 */
export async function initializeFeatureFlags(): Promise<void> {
  const FM_KEY = import.meta.env.VITE_FM_KEY || 'local-mode';

  if (FM_KEY === 'local-mode') {
    console.log('Running in local mode - using default flag values');
    return Promise.resolve();
  }

  // Try to use rox-browser if available and FM_KEY is provided
  try {
    const Rox = await import('rox-browser');
    await Rox.default.setup(FM_KEY);
    console.log('CloudBees Feature Management initialized');
  } catch (error) {
    console.warn('CloudBees Feature Management not available, using default values');
    // Continue with default values
  }
}

/**
 * Get current flag values (useful for debugging)
 */
export function getFlagValues() {
  return {
    searchAlgorithm: Flags.searchAlgorithm.getValue(),
    enableAdvancedFilters: Flags.enableAdvancedFilters.isEnabled(),
    showDealerRatings: Flags.showDealerRatings.isEnabled(),
    pricingDisplay: Flags.pricingDisplay.getValue(),
    enableInstantTradeIn: Flags.enableInstantTradeIn.isEnabled(),
    showFinancingCalculator: Flags.showFinancingCalculator.isEnabled(),
    enable360Photos: Flags.enable360Photos.isEnabled(),
    vehicleRecommendations: Flags.vehicleRecommendations.getValue(),
  };
}
