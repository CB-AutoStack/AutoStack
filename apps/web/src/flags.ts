/**
 * CloudBees Feature Management (Rox) Integration
 */

import Rox from 'rox-browser';

// Define feature flags
export const Flags = {
  // Search algorithm variant
  searchAlgorithm: new Rox.Variant('price-low-to-high', ['price-low-to-high', 'newest-first', 'recommended']),

  // Advanced filtering
  enableAdvancedFilters: new Rox.Flag(false),

  // Dealer ratings display
  showDealerRatings: new Rox.Flag(true),

  // Pricing display variant
  pricingDisplay: new Rox.Variant('total-price', ['total-price', 'monthly-payment', 'both']),

  // Instant trade-in feature
  enableInstantTradeIn: new Rox.Flag(false),

  // Financing calculator
  showFinancingCalculator: new Rox.Flag(true),

  // 360-degree photos
  enable360Photos: new Rox.Flag(false),

  // Vehicle recommendations variant
  vehicleRecommendations: new Rox.Variant('price-based', ['price-based', 'feature-based', 'ai-powered']),
};

// Register flags with Rox
Rox.register('autostack', Flags);

/**
 * Initialize feature flags
 * Reads FM_KEY from environment or uses local mode
 */
export async function initializeFeatureFlags(): Promise<void> {
  // In production, this would come from environment variable
  const FM_KEY = import.meta.env.VITE_FM_KEY || 'local-mode';

  if (FM_KEY === 'local-mode') {
    console.log('Running in local mode - using default flag values');
    return Promise.resolve();
  }

  try {
    await Rox.setup(FM_KEY);
    console.log('CloudBees Feature Management initialized');
  } catch (error) {
    console.error('Failed to initialize feature flags:', error);
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
