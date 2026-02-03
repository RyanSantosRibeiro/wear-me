
const DB_NAME = 'WearMeCache';
const STORE_NAME = 'generations';

export async function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (typeof indexedDB === 'undefined') {
            return reject('IndexedDB not supported');
        }
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'productUrl' });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function saveToCache(productUrl: string, resultUrl: string): Promise<void> {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            store.put({ productUrl, resultUrl, timestamp: Date.now() });
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    } catch (e) {
        console.warn('Failed to save to IndexedDB cache', e);
    }
}

export async function getFromCache(productUrl: string): Promise<string | null> {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(productUrl);
            request.onsuccess = () => resolve(request.result?.resultUrl || null);
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.warn('Failed to read from IndexedDB cache', e);
        return null;
    }
}
