declare module 'rox-browser' {
  export class Flag {
    constructor(defaultValue: boolean);
    isEnabled(): boolean;
  }

  export class Variant {
    constructor(defaultValue: string, options: string[]);
    getValue(): string;
  }

  export function register(namespace: string, flags: any): void;
  export function setup(apiKey: string): Promise<void>;

  const Rox: {
    Flag: typeof Flag;
    Variant: typeof Variant;
    register: typeof register;
    setup: typeof setup;
  };

  export default Rox;
}
