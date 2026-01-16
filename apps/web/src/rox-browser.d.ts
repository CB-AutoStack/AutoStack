declare module 'rox-browser' {
  export class Flag {
    constructor(defaultValue: boolean);
    isEnabled(): boolean;
  }

  export class RoxString {
    constructor(defaultValue: string, options: string[]);
    getValue(): string;
  }

  export interface FetcherResults {
    hasChanges: boolean;
    fetcherStatus: string;
  }

  export interface RoxSetupOptions {
    configurationFetchedHandler?: (fetcherResults: FetcherResults) => void;
    debugLevel?: string;
  }

  export function register(namespace: string, flags: any): void;
  export function setup(apiKey: string, options?: RoxSetupOptions): Promise<void>;

  const Rox: {
    Flag: typeof Flag;
    RoxString: typeof RoxString;
    register: typeof register;
    setup: typeof setup;
  };

  export default Rox;
}
