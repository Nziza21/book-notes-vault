import { validateText, validatePages, validateDate, validateTag, validateNoDuplicateWords } from './validators.js';
import { loadRecords, saveRecords } from './storage.js';

let editingId = null;

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('book-form');
  const tableBody = document.querySelector('#records-table tbody');
  const searchInput = document.getElementById('search-input');
  const searchError = document.getElementById('search-error');
  const totalBooksEl = document.getElementById('total-books');
  const totalPagesEl = document.getElementById('total-pages');
  const topTagEl = document.getElementById('top-tag');
  const trendCanvas = document.getElementById('trend-chart');
  const pageCapInput = document.getElementById('page-cap');
  const capStatusEl = document.getElementById('cap-status');

  const trendCtx = trendCanvas ? trendCanvas.getContext('2d') : null;

  const defaultCapInput = document.getElementById('default-cap');
  const themeSelect = document.getElementById('theme-select');
  const resetBtn = document.getElementById('reset-records');
  const resetMsg = document.getElementById('reset-msg');

  let books = loadRecords();

  // ---------- LOAD SEED ----------
  async function loadSeedIfEmpty() {
    if (books.length === 0) {
      try {
        const res = await fetch('../seed.json');
        if (!res.ok) throw new Error();
        books = await res.json();
        saveRecords(books);
      } catch {
        books = [];
      }
    }
    renderRecords(books);
  }

  // ---------- ERRORS ----------
  function showError(input, message) {
    input.nextElementSibling.textContent = message;
  }

  function clearError(input) {
    input.nextElementSibling.textContent = '';
  }

  // ---------- FORM ----------
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;
      const title = form.title.value.trim();
      const author = form.author.value.trim();
      const pages = form.pages.value.trim();
      const tag = form.tag.value.trim();
      const dateAdded = form.dateAdded.value.trim();

      if (!validateText(title)) { showError(form.title,'Invalid title'); valid=false; } else clearError(form.title);
      if (!validateText(author) || !validateNoDuplicateWords(author)) { showError(form.author,'Invalid author'); valid=false; } else clearError(form.author);
      if (!validatePages(pages)) { showError(form.pages,'Invalid pages'); valid=false; } else clearError(form.pages);
      if (!validateTag(tag)) { showError(form.tag,'Invalid tag'); valid=false; } else clearError(form.tag);
      if (!validateDate(dateAdded)) { showError(form.dateAdded,'Invalid date'); valid=false; } else clearError(form.dateAdded);

      if (!valid) return;

      if (editingId) {
        const book = books.find(b => b.id === editingId);
        Object.assign(book, { title, author, pages:Number(pages), tag, dateAdded });
        editingId = null;
      } else {
        books.push({
          id: 'book_' + Date.now(),
          title,
          author,
          pages: Number(pages),
          tag,
          dateAdded
        });
      }

      saveRecords(books);
      renderRecords(books);
      form.reset();
    });
  }

  // ---------- RENDER ----------
  function renderRecords(records) {
    if (!tableBody) return;
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

    computeStats(records);
    updateCapStatus(records);
  }

  function computeStats(records) {
    totalBooksEl.textContent = records.length;
    totalPagesEl.textContent = records.reduce((s,r)=>s+Number(r.pages),0);

    const tagCounts = {};
    records.forEach(r => tagCounts[r.tag]=(tagCounts[r.tag]||0)+1);
    topTagEl.textContent = Object.keys(tagCounts).sort((a,b)=>tagCounts[b]-tagCounts[a])[0] || '-';

    if (!trendCtx) return;

    const trendData = Array(7).fill(0);
    const today = new Date();

    records.forEach(r=>{
      const diff = Math.floor((today-new Date(r.dateAdded))/(86400000));
      if(diff>=0 && diff<7) trendData[6-diff]++;
    });

    trendCtx.clearRect(0,0,trendCanvas.width,trendCanvas.height);
    const barWidth = trendCanvas.width/7-5;

    trendData.forEach((val,i)=>{
      trendCtx.fillStyle='#4caf50';
      trendCtx.fillRect(i*(barWidth+5), trendCanvas.height-val*20, barWidth, val*20);
    });
  }

  function updateCapStatus(records){
    if (!pageCapInput) return;
    const total = records.reduce((s,r)=>s+Number(r.pages),0);
    const cap = Number(pageCapInput.value)||0;
    const remaining = cap-total;
    capStatusEl.textContent = remaining>=0 ? `Remaining: ${remaining}` : `Over limit by ${-remaining}`;
  }

  if (pageCapInput) {
    pageCapInput.addEventListener('input',()=>updateCapStatus(books));
  }

  // ---------- SEARCH ----------
  if (searchInput) {
    searchInput.addEventListener('input',()=>{
      const pattern = searchInput.value.trim();
      let re;
      try {
        re = pattern ? new RegExp(pattern,'i') : null;
        searchError.textContent='';
      } catch {
        searchError.textContent='Invalid regex';
        return;
      }

      [...tableBody.querySelectorAll('tr')].forEach(row=>{
        const text = row.textContent;
        row.style.display = (!re || re.test(text)) ? '' : 'none';
      });
    });
  }

  // ---------- EDIT / DELETE ----------
  if (tableBody) {
    tableBody.addEventListener('click',(e)=>{
      const id = e.target.dataset.id;
      if(!id) return;

      if(e.target.classList.contains('delete-btn')){
        books = books.filter(b=>b.id!==id);
        saveRecords(books);
        renderRecords(books);
      }

      if(e.target.classList.contains('edit-btn')){
        const book = books.find(b=>b.id===id);
        form.title.value = book.title;
        form.author.value = book.author;
        form.pages.value = book.pages;
        form.tag.value = book.tag;
        form.dateAdded.value = book.dateAdded;
        editingId=id;
      }
    });
  }

  // ---------- SETTINGS ----------
  if (defaultCapInput && themeSelect && resetBtn && resetMsg) {

    defaultCapInput.addEventListener('input',()=>{
      pageCapInput.value = defaultCapInput.value;
      updateCapStatus(books);
    });

    function applyTheme(theme){
      document.body.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    themeSelect.value = savedTheme;
    applyTheme(savedTheme);

    themeSelect.addEventListener('change',()=>applyTheme(themeSelect.value));

    resetBtn.addEventListener('click',()=>{
      books=[];
      saveRecords(books);
      renderRecords(books);
      resetMsg.textContent='All records reset.';
    });
  }

  loadSeedIfEmpty();

});