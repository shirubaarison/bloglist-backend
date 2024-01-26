const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'testing',
        author: 'shirubaarison',
        url: 'idk',
        likes: 0
    },
    {
        title: 'testing2',
        author: 'shirubaarison',
        url: 'idk2',
        likes: 0
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = initialBlogs.map(b => new Blog(b))
    const promiseArray = blogObjects.map(b => b.save())

    await Promise.all(promiseArray)
})

test('returns blogs as json', async () => {
    const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(initialBlogs.length)
})

test('id is the unique identifier property', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)

    response.body.forEach(blog => {
        expect(blog.id).toBeDefined
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})