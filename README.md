Here’s the complete, ready-to-paste README for your Book & Notes Vault project:

# Book & Notes Vault

## Chosen Theme
**Book & Notes Vault** – a responsive catalog for books and notes with tags, regex-powered search, and statistics tracking.

## Purpose
This project is a **responsive and accessible web application** that allows students to store and manage books and notes.  

Users can:

- Add, edit, and delete records  
- Search records using **regular expressions**  
- View dashboard statistics: total books, total pages, top tag, and last-7-days trend  
- Set a **page cap** to monitor maximum pages allowed  
- Import/export data as JSON with **structure validation**  

All changes are **persisted in localStorage**, ensuring data remains between sessions.

## Author

Name: Nziza Samuel
GitHub: https://github.com/Nziza21

Email: n.samuel@alustudent.com


## Data Model

Each record follows this structure:

```json
{
  "id": "book_0001",
  "title": "Clean Code",
  "author": "Robert Martin",
  "pages": 464,
  "tag": "Software Engineering",
  "dateAdded": "2025-09-29",
  "createdAt": "2025-09-29T12:30:00Z",
  "updatedAt": "2025-09-29T12:30:00Z"
}
Field Descriptions
Field	Description
id	Unique record identifier
title	Name of the book or note
author	Author’s full name
pages	Number of pages
tag	Category/tag for easy filtering
dateAdded	Date the record was added
createdAt	Timestamp of record creation
updatedAt	Timestamp of last edit
Features
Pages / Sections

About: Purpose & author contact

Dashboard: Stats overview with total books, total pages, top tag, last-7-days trend chart

Records Table: Full listing of books, sortable by title, author, pages, tag, and date

Add/Edit Form: Add new records or edit existing ones

Settings: Default page cap, theme toggle (light/dark), reset all records

Regex Validation Rules

Title/Author: No leading/trailing spaces, no duplicate words

/^\S(?:.*\S)?$/  # no leading/trailing spaces
/\b(\w+)\s+\1\b/ # catches duplicate words

Pages: Positive number with optional 2 decimals

/^(0|[1-9]\d*)(\.\d{1,2})?$/

Date (YYYY-MM-DD):

/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

Tag (letters, spaces, hyphens):

/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/
Table, Sorting, and Regex Search

Click headers to sort by text, numeric, or date columns (ascending/descending)

Live regex search highlights matches using <mark>

Safe compilation with try/catch prevents invalid regex from breaking the app

Stats Dashboard

Total books, total pages, top tag

Last 7 days trend chart

Page cap monitoring with ARIA live updates:

Polite when under the limit

Assertive when over the limit

Persistence and Settings

LocalStorage: All data persists across sessions

JSON Import/Export: Validates structure before loading

Settings: Default page cap, theme selection, reset all records

Accessibility (A11y)

Skip-to-content link

Proper labels and focus styles

Status messages using role="status" or aria-live

Fully keyboard navigable

Semantic landmarks: header, nav, main, section, footer

Sample Seed Records
[
  {
    "id":"book_1",
    "title":"Clean Code",
    "author":"Robert Martin",
    "pages":464,
    "tag":"Software Engineering",
    "dateAdded":"2025-09-20",
    "createdAt":"2025-09-20T12:00:00Z",
    "updatedAt":"2025-09-20T12:00:00Z"
  },
  {
    "id":"book_2",
    "title":"Atomic Habits",
    "author":"James Clear",
    "pages":320,
    "tag":"Self-Help",
    "dateAdded":"2025-09-21",
    "createdAt":"2025-09-21T12:00:00Z",
    "updatedAt":"2025-09-21T12:00:00Z"
  },
  {
    "id":"book_3",
    "title":"The Pragmatic Programmer",
    "author":"Andrew Hunt",
    "pages":352,
    "tag":"Software Engineering",
    "dateAdded":"2025-09-22",
    "createdAt":"2025-09-22T12:00:00Z",
    "updatedAt":"2025-09-22T12:00:00Z"
  }
]
Running the App
# Clone the repository
git clone https://github.com/Nziza21/book-notes-vault.git
cd book-notes-vault

# Open in your browser
open index.html      # Mac
start index.html     # Windows
xdg-open index.html  # Linux

Use Add/Edit form to create records

Table headers sort records; regex search filters live

Export/Import JSON via Records section

Adjust settings in Settings section

Keyboard Map
Action	Key
Skip to main content	Tab → Enter on "Skip to content"
Navigate inputs/buttons	Tab / Shift + Tab
Submit form	Enter (on submit button)
Sort table	Tab to header → Enter
Delete record	Tab → Enter on delete button
Edit record	Tab → Enter on edit button
Accessibility Notes

Color contrast meets WCAG AA

ARIA live regions announce page cap status and form errors

Fully operable with keyboard only

Semantic landmarks: header, nav, main, section, footer


---

This is **everything in one place**. Copy it, paste it in `README.md`, and it will render perfectly on GitHub:

- Headers are blue  
- Code blocks are highlighted  
- Tables, lists, and JSON look nice  
- Entire document is together, no fragments  