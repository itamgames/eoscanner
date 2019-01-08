import localforage from 'localforage';

export class StorageService {
    static get(key: string): any {
        return localforage.getItem(key);
    }

    static set(key: string, value: any): any {
        return localforage.setItem(key, value);
    }

    static remove(key: string): any {
        return localforage.removeItem(key);
    }

    static clear(): any {
        return localforage.clear();
    }
}
