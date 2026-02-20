import { validateText, validatePages, validateDate, validateTag, validateNoDuplicateWords } from './validators.js';

const form = document.getElementById('book-form');

function showError(input, message) {
  const errorEl = input.nextElementSibling;
  errorEl.textContent = message;
}

function clearError(input) {
  const errorEl = input.nextElementSibling;
  errorEl.textContent = '';
}

form.addEventListener('submit', function(e) {
  e.preventDefault();

  let valid = true;

  const title = form.title.value.trim();
  const author = form.author.value.trim();
  const pages = form.pages.value.trim();
  const tag = form.tag.value.trim();
  const dateAdded = form.dateAdded.value.trim();

  if (!validateText(title)) {
    showError(form.title, 'Title cannot have leading/trailing spaces.');
    valid = false;
  } else {
    clearError(form.title);
  }

  if (!validateText(author) || !validateNoDuplicateWords(author)) {
    showError(form.author, 'Author invalid or has repeated words.');
    valid = false;
  } else {
    clearError(form.author);
  }

  if (!validatePages(pages)) {
    showError(form.pages, 'Pages must be a valid number (max 2 decimals).');
    valid = false;
  } else {
    clearError(form.pages);
  }

  if (!validateTag(tag)) {
    showError(form.tag, 'Tag must be letters, spaces, or hyphens.');
    valid = false;
  } else {
    clearError(form.tag);
  }

  if (!validateDate(dateAdded)) {
    showError(form.dateAdded, 'Date must be YYYY-MM-DD.');
    valid = false;
  } else {
    clearError(form.dateAdded);
  }

  if (valid) {
    alert('All fields are valid! (Next step: save record)');
    form.reset();
  }
});

const tableBody = document.querySelector('#records-table tbody');

async function loadSeed() {
  try {
    const response = await fetch('seed.json');
    const data = await response.json();
    renderRecords(data);
  } catch (err) {
    console.error('Failed to load seed data', err);
  }
}

function renderRecords(records) {
  tableBody.innerHTML = '';
  records.forEach(record => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${record.title}</td>
      <td>${record.author}</td>
      <td>${record.pages}</td>
      <td>${record.tag}</td>
      <td>${record.dateAdded}</td>
      <td>
        <button class="edit-btn" data-id="${record.id}">Edit</button>
        <button class="delete-btn" data-id="${record.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

loadSeed();

const headers = document.querySelectorAll('#records-table th[data-sort]');

headers.forEach(th => {
  th.addEventListener('click', () => {
    const key = th.dataset.sort;
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    const ascending = !th.classList.contains('asc');
    
    rows.sort((a, b) => {
      const aText = a.querySelector(`td:nth-child(${getColumnIndex(key)+1})`).textContent.trim();
      const bText = b.querySelector(`td:nth-child(${getColumnIndex(key)+1})`).textContent.trim();

      if (key === 'pages') {
        return ascending ? aText - bText : bText - aText;
      } else if (key === 'dateAdded') {
        return ascending ? new Date(aText) - new Date(bText) : new Date(bText) - new Date(aText);
      } else {
        return ascending ? aText.localeCompare(bText) : bText.localeCompare(aText);
      }
    });

    tableBody.innerHTML = '';
    rows.forEach(r => tableBody.appendChild(r));

    headers.forEach(h => h.classList.remove('asc', 'desc'));
    th.classList.add(ascending ? 'asc' : 'desc');
  });
});

function getColumnIndex(key) {
  switch(key) {
    case 'title': return 0;
    case 'author': return 1;
    case 'pages': return 2;
    case 'tag': return 3;
    case 'dateAdded': return 4;
    default: return 0;
  }
}

const searchInput = document.getElementById('search-input');
const searchError = document.getElementById('search-error');

searchInput.addEventListener('input', () => {
  const pattern = searchInput.value.trim();

  let re = null;
  try {
    if (pattern) {
      re = new RegExp(pattern, 'i');
    }
    searchError.textContent = '';
  } catch (err) {
    searchError.textContent = 'Invalid regex pattern';
    return;
  }

  const rows = Array.from(tableBody.querySelectorAll('tr'));
  rows.forEach(row => {
    let rowMatch = false;
    row.querySelectorAll('td').forEach(td => {
      const text = td.textContent;
      if (re && text.match(re)) {
        td.innerHTML = text.replace(re, m => `<mark>${m}</mark>`);
        rowMatch = true;
      } else {
        td.innerHTML = td.textContent; 
      }
    });

    row.style.display = rowMatch || !pattern ? '' : 'none';
  });
});
