import IStorageProvider from '../models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  private files: string[] = [];

  public async saveFile(filename: string): Promise<string> {
    this.files.push(filename);

    return filename;
  }

  public async saveFiles(files: string[]): Promise<string[]> {
    files.forEach(file => {
      this.files.push(file);
    });

    return files;
  }

  public async deleteFiles(files: string[]): Promise<void> {
    files.forEach(file => {
      const fileIndex = this.files.findIndex(item => item === file);

      this.files.splice(fileIndex, 1);
    });
  }
}
