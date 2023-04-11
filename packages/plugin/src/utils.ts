export function assert(value: unknown, message: string) {
  if (!value) throw new Error(message)
}

export function __defaultExport(obj: any) {
  if (obj.default) {
    return typeof obj.default === 'function' ? obj.default() : obj.default
  }
  return obj
}
