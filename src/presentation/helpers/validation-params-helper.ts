export const validationParamRequest = (params: any): string | undefined => {
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  return requiredFields.find(field => !params[field])
}
