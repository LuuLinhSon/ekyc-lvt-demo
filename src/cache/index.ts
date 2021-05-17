import localForage from 'localforage';
import { FnType } from '../constants/types';

type ILocalForage = {
  config: FnType;
  setItem: FnType;
  getItem: FnType;
};
type IDatabase = ILocalForage | any;

localForage.config({
  driver: localForage.INDEXEDDB, // Force WebSQL; same as using setDriver()
  name: 'backoffice',
  version: 1.0,
  size: 4980736, // Size of database, in bytes. WebSQL-only for now.
  storeName: 'keyvaluepairs', // Should be alphanumeric, with underscores.
  description: 'This Database is for storing the entries responses in the indexedDB',
});

const databases: IDatabase = localForage.createInstance({
  name: 'bo',
  storeName: 'bo',
});

export default databases;
