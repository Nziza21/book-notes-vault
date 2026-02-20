const STORAGE_KEY = 'books-vault';

export function loadRecords() {
  const data = localStorage.getItem(STORAGE_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to parse localStorage data', err);
    return [];
  }
}

export function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}


