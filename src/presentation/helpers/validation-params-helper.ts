export const validationParamRequest = (params: any, requiredFields: string[]): string | undefined => {
  return requiredFields.find(field => !params[field])
}
