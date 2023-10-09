import { type Controller, type HttpRequest, type HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const logController = (): any => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          id: 1,
          name: 'any_name',
          email: 'any_email@domain.com',
          password: '12345',
          createdAt: new Date(Date.now())
        }
      }
      return await new Promise(resolve => { resolve(httpResponse) })
    }
  }

  const controllerStub = new ControllerStub()
  return {
    create: () => new LogControllerDecorator(controllerStub),
    controllerStub
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { create, controllerStub } = logController()
    const logControllerTest = create()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@domain.com',
        password: '12345',
        passwordConfirmation: '12345'
      }
    }
    await logControllerTest.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
