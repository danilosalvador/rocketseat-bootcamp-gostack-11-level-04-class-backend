import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

class FakeStorageProvider implements IStorageProvider {
  private storange: string[] = [];

  public async saveFile(file: string): Promise<string> {
    this.storange.push(file);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const fileIndex = this.storange.findIndex(item => item === file);

    this.storange.splice(fileIndex, 1);
  }
}

export default FakeStorageProvider;
