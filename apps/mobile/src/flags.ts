/**
 * CloudBees Feature Management (Rox) Integration
 */

import Rox from 'rox-browser';

// Define feature flags
export const Flags = {
  // Search and display flags
  showMonthlyPaymentFirst: new Rox.Flag(false),
  enableAdvancedFilters: new Rox.Flag(false),
  showAIRecommendations: new Rox.Flag(false),

  // Image and media flags
  enableHighResImages: new Rox.Flag(true),
  enable360View: new Rox.Flag(false),

  // Trade-in and financing
  showInstantTradeIn: new Rox.Flag(false),
  showFinancingCalculator: new Rox.Flag(true),

  // Search algorithm variant
  searchAlgorithm: new Rox.Variant('price-focused', ['price-focused', 'feature-focused', 'ai-recommended']),
};

// Register flags with Rox
Rox.register('autostack', Flags);

/**
 * Initialize feature flags
 * Reads FM_KEY from environment or uses local mode
 */
export async function initializeFeatureFlags(): Promise<void> {
  // In production, this would come from environment variable or config
  const FM_KEY = process.env.FM_KEY || 'local-mode';

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
    showMonthlyPaymentFirst: Flags.showMonthlyPaymentFirst.isEnabled(),
    enableAdvancedFilters: Flags.enableAdvancedFilters.isEnabled(),
    showAIRecommendations: Flags.showAIRecommendations.isEnabled(),
    enableHighResImages: Flags.enableHighResImages.isEnabled(),
    enable360View: Flags.enable360View.isEnabled(),
    showInstantTradeIn: Flags.showInstantTradeIn.isEnabled(),
    showFinancingCalculator: Flags.showFinancingCalculator.isEnabled(),
    searchAlgorithm: Flags.searchAlgorithm.getValue(),
  };
}
