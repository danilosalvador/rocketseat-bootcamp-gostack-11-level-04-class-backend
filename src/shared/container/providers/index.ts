import { container } from 'tsyringe';

import IStorangeProvider from './StorangeProvider/models/IStorangeProvider';
import DiskStorangeProvider from './StorangeProvider/implementations/DiskStorangeProvider';

container.registerSingleton<IStorangeProvider>(
  'StorangeProvider',
  DiskStorangeProvider,
);
