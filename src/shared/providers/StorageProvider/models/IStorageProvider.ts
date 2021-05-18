export default interface IStorageProvider {
  saveFile(filename: string): Promise<string>;
  saveFiles(filename: string[]): Promise<string[]>;
  deleteFiles(filename: string[]): Promise<void>;
}
