class VbenError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EtfmAdminError'
  }
}

function loggerError(message: string) {
  throw new VbenError(`${message}`)
}

function loggerWarning(message?: string): void {
  // eslint-disable-next-line no-console
  console.warn(`[EtfmAdmin] ${message}`)
}

export { loggerError, loggerWarning }
