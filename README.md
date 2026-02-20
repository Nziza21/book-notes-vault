# Book & Notes Vault

## Chosen Theme
Book & Notes Vault (Catalog of books and notes with tags and regex search)

## Purpose
This project is a responsive and accessible web application that allows students to store and manage books and notes.  
Users can add records, search using regular expressions, and view statistics such as total books and total pages.  
Data is saved in localStorage and can be imported/exported as JSON.

## Author
- Name: Nziza Samuel
- GitHub: https://github.com/Nziza21
- Email: n.samuel@alustudent.com

## Data Model

Each record will follow this structure:

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

