import request from 'supertest'
import app from '../config/app'

describe('Signup Routes', () => {
    test('Should return an account on success', async () => {
        await request(app).post('/api/signup').send({
            name: 'Ulisses',
            email: 'ulisses@riachuelo.com.br',
            password: '1234',
            passwordConfirmation: '1234'
        }).expect(200)
    })
})
