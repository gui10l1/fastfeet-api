import ICacheProvider from '../models/ICacheProvider';

interface ICachedValues {
  [key: string]: string;
}

export default class FakeCacheProvider implements ICacheProvider {
  private cachedValues: ICachedValues = {};

  public async save(key: string, value: string): Promise<void> {
    this.cachedValues[key] = value;
  }

  public async delete(key: string): Promise<void> {
    delete this.cachedValues[key];
  }

  public async get<T>(key: string): Promise<T | undefined> {
    const cacheResults = this.cachedValues[key];

    if (!cacheResults) {
      return undefined;
    }

    const parsedResults = JSON.parse(cacheResults) as T;

    return parsedResults;
  }
}
