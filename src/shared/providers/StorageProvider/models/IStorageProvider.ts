export default interface IStorageProvider {
  saveFile(filename: string): Promise<string>;
}
