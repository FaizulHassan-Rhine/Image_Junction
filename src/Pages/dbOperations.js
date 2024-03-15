import { openDB } from 'idb';

export async function initDB() {
  const db = await openDB('imageDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'id' });
      }
    },
  });
  return db;
}

export async function storeImage(db, image) {
  const tx = db.transaction('images', 'readwrite');
  await tx.store.put(image);
  await tx.done;
}

export async function getAllImages(db) {
  return await db.getAll('images');
}

// Add this function to your dbOperations.js

export async function removeImage(db, id) {
    const tx = db.transaction('images', 'readwrite');
    await tx.store.delete(id);
    await tx.done;
}

// Add this function to dbOperations.js

export async function clearAllImages(db) {
    const tx = db.transaction('images', 'readwrite');
    await tx.store.clear();
    await tx.done;
}


