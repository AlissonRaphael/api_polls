import { type LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http/http-helper'
import { type Controller, type HttpRequest, type HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const httpRequest: HttpRequest = {
  body: {
    name: 'any_name',
    email: 'any_email@domain.com',
    password: '12345',
    passwordConfirmation: '12345'
  }
}

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

const makeController = (): any => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise(resolve => { resolve(httpResponse) })
    }
  }

  return new ControllerStub()
}

const makeLogErrorRepository = (): any => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {}
  }
  return new LogErrorRepositoryStub()
}

const makeLogController = (): any => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  return {
    create: () => new LogControllerDecorator(controllerStub, logErrorRepositoryStub),
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { create, controllerStub } = makeLogController()
    const logControllerTest = create()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await logControllerTest.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const logControllerTest = makeLogController().create()
    const response = await logControllerTest.handle(httpRequest)
    expect(response).toEqual(httpResponse)
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { create, controllerStub, logErrorRepositoryStub } = makeLogController()

    const fakeError = new Error('')
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockReturnValue(new Promise(resolve => { resolve(error) }))

    const logControllerTest = create()
    await logControllerTest.handle(httpRequest)

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
