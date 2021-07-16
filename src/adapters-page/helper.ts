export interface Method {
  path: string
  fn: (...args: any) => any
}

export function findMethods(input: any, path = ''): Method[] {
  const topLevelFunctions = Object.keys(input)
    .filter((key: string) => typeof input[key] === 'function')
    .map((key) => ({
      path: path ? `${path}.${key}` : key,
      fn: input[key]
    }))

  const nextLevelFunctions = Object.keys(input)
    .filter((key: string) => input[key] && typeof input[key] === 'object')
    .flatMap((key) => findMethods(input[key], path ? `${path}.${key}` : key))

  return [...topLevelFunctions, ...nextLevelFunctions]
}
