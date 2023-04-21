class VbenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EtfmAdminError';
  }
}

function loggerError(message: string) {
  throw new VbenError(`${message}`);
}

function loggerWarning(message?: string): void {
  console.warn(`[EtfmAdmin] ${message}`);
}

export { loggerError, loggerWarning };
