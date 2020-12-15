import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
}

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
            const httpResponse: HttpResponse = {
                statusCode: 200,
                body: {
                    name: 'Ulisses'
                }
            }
            return await new Promise((resolve) => resolve(httpResponse))
        }
      }
      return new ControllerStub()
}

const makeSut = (): SutTypes => {
    const controllerStub = makeController()
    const sut = new LogControllerDecorator(controllerStub)
    return {
        sut,
        controllerStub
    }
}

describe('LogController Decorator', () => {
    test('Ensure that decorator calls hadle correctly', async () => {
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const httpRequest = {
            body: {
                email: 'email@mail.com',
                name: 'Test',
                password: '1234',
                passwordConfirmation: '1234'
            }
        }
        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })

    test('Ensure that decorator return the same result of the controller', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: 'email@mail.com',
                name: 'Test',
                password: '1234',
                passwordConfirmation: '1234'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual({
            statusCode: 200,
            body: {
                name: 'Ulisses'
            }
        })
    })
})
