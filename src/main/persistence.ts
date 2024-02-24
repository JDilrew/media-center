import Store from 'electron-store';

export interface SchemaType {
  sourceLocation: string;
  outputLocation: string;
  rate: number;
}

const schemaTypeDefaults: SchemaType = {
  sourceLocation: '',
  outputLocation: '',
  rate: 1,
};

class Persistence {
  private store: Store<SchemaType>;

  constructor(
    store: Store<SchemaType> = new Store<SchemaType>({
      defaults: schemaTypeDefaults,
    }),
  ) {
    this.store = store;
  }

  public getSourceLocation() {
    return this.store.get('sourceLocation', '');
  }

  public getOutputLocation() {
    return this.store.get('outputLocation', '');
  }

  public getRate() {
    return this.store.get('rate', 0);
  }

  public setSourceLocation(value: string) {
    this.store.set('sourceLocation', value);
  }

  public setOutputLocation(value: string) {
    this.store.set('outputLocation', value);
  }

  public setRate(value: number) {
    this.store.set('rate', value);
  }
}

export default new Persistence();
