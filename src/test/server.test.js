const request = require('supertest');
const express = require('express');
const app = express();
const Category = require('../models/Category')

describe('GET /', () => {
    it('responds with "Hello World!"', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello World!');
    });
});

