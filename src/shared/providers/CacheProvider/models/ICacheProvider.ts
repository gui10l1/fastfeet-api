export default interface ICacheProvider {
  save(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  get<T>(key: string): Promise<T | undefined>;
}
