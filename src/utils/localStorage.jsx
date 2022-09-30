export const LocalStorage = {
  storeValue: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  getStoreValue: (key) => JSON.parse(localStorage.getItem(key)),
  removeStoreItem: (key) => localStorage.removeItem(key),
};
