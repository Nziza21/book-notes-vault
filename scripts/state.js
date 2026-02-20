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
