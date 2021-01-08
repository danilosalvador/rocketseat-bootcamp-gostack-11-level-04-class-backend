import fs from 'fs';
import path from 'path';

import uploadConfig from '@config/upload';
import IStorangeProvider from '@shared/container/providers/StorangeProvider/models/IStorangeProvider';

class DiskStorangeProvider implements IStorangeProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);

    // Verifica se existe o arquivo
    try {
      await fs.promises.stat(filePath);
    } catch {
      // Se não existir, irá gerar uma exception
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

export default DiskStorangeProvider;
