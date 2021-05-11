import IStorageProvider from '../models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  private files: string[] = [];

  public async saveFile(filename: string): Promise<string> {
    this.files.push(filename);

    return filename;
  }
}
