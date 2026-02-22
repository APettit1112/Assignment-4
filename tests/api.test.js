const request = require('supertest');
const app = require('../server');

describe('Books API', () => {
  let createdId;

  test('GET /api/books returns all books with 200', async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });

  test('GET /api/books/:id returns book when valid id', async () => {
    const res = await request(app).get('/api/books/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('title');
  });

  test('GET /api/books/:id returns 404 for invalid id', async () => {
    const res = await request(app).get('/api/books/9999');
    expect(res.statusCode).toBe(404);
  });

  test('POST /api/books creates a new book and returns 201', async () => {
    const payload = { title: 'Test Book', author: 'Tester', genre: 'Test', copiesAvailable: 1 };
    const res = await request(app).post('/api/books').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(payload.title);
    createdId = res.body.id;
  });

  test('PUT /api/books/:id updates an existing book and returns 200', async () => {
    const res = await request(app).put(`/api/books/${createdId}`).send({ copiesAvailable: 99 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('copiesAvailable', 99);
  });

  test('PUT /api/books/:id returns 404 for non-existent id', async () => {
    const res = await request(app).put('/api/books/99999').send({ copiesAvailable: 5 });
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /api/books/:id removes a book and returns 204', async () => {
    const res = await request(app).delete(`/api/books/${createdId}`);
    expect(res.statusCode).toBe(204);
    const check = await request(app).get(`/api/books/${createdId}`);
    expect(check.statusCode).toBe(404);
  });

  test('DELETE /api/books/:id returns 404 for non-existent id', async () => {
    const res = await request(app).delete('/api/books/99999');
    expect(res.statusCode).toBe(404);
  });
});
