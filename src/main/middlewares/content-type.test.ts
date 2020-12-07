import request from 'supertest'
import app from '../config/app'

describe(' Content-Type Middleware', () => {
    test('Should default Content-Type as JSON', async () => {
        app.get('/test_content_type', (req, res) => {
            res.send({})
        })
        await request(app)
        .get('/test_content_type')
        .expect('Content-Type', /json/)
    })

    test('Should return xml Content-Type when forced', async () => {
        app.get('/test_content_type_xml', (req, res) => {
            res.type('xml')
            res.send('')
        })
        await request(app)
        .get('/test_content_type_xml')
        .expect('Content-Type', /xml/)
    })
})
