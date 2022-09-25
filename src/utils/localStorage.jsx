export const LocalStorage = {
  // store a value with the given key
  storeValue: (key, value) => localStorage.setItem(key, JSON.stringify(value)),

  // get the store item with the given key
  getStoreValue: (key) => JSON.parse(localStorage.getItem(key)),

  // delete the item with the given key
  removeStoreItem: (key) => localStorage.removeItem(key),
};
