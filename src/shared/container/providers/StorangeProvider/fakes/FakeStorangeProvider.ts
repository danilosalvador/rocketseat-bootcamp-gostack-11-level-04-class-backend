import IStorangeProvider from '@shared/container/providers/StorangeProvider/models/IStorangeProvider';

class FakeStorangeProvider implements IStorangeProvider {
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

export default FakeStorangeProvider;
