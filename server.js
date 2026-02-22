// =====================
// IMPORT EXPRESS
// =====================
const express = require('express');

// Create application instance
const app = express();

// Middleware to parse JSON requests
app.use(express.json());


// =====================
// BOOK DATA
// =====================
let books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        copiesAvailable: 5
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        copiesAvailable: 3
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian Fiction",
        copiesAvailable: 7
    }
];


// =====================
// GET ENDPOINTS
// =====================

// GET /api/books - Retrieve all books
app.get('/api/books', (req, res) => {
    res.json(books);
});

// GET /api/books/:id - Retrieve book by ID
app.get('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            error: 'Book not found'
        });
    }

    res.json(book);
});


// =====================
// POST ENDPOINT
// =====================

// POST /api/books - Add new book
app.post('/api/books', (req, res) => {
    const { title, author, genre, copiesAvailable } = req.body;

    if (!title || !author) {
        return res.status(400).json({
            error: 'Title and author are required'
        });
    }

    const nextId = books.length + 1;

    const newBook = {
        id: nextId,
        title,
        author,
        genre: genre || '',
        copiesAvailable:
            typeof copiesAvailable === 'number'
                ? copiesAvailable
                : 0
    };

    books.push(newBook);

    res.status(201).json(newBook);
});


// =====================
// PUT ENDPOINT
// =====================

// PUT /api/books/:id - Update book
app.put('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            error: 'Book not found'
        });
    }

    const { title, author, genre, copiesAvailable } = req.body;

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (genre !== undefined) book.genre = genre;
    if (copiesAvailable !== undefined)
        book.copiesAvailable = copiesAvailable;

    res.json(book);
});


// =====================
// DELETE ENDPOINT
// =====================

// DELETE /api/books/:id - Delete book
app.delete('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: 'Book not found'
        });
    }

    books.splice(index, 1);

    res.sendStatus(204);
});


// =====================
// START SERVER
// =====================
const PORT = 3000;

// Only start server when running directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export app for testing
module.exports = app;