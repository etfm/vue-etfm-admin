class EtfmaError extends Error {
  constructor(message: string, name?: string) {
    super(message);
    this.name = name ? `[EtfmAdminError][${name}]` : `[EtfmAdminError]`;
  }
}

function loggerError(message: string, bizName?: string) {
  throw new EtfmaError(`${message}`, bizName);
}

function loggerWarning(message?: string, bizName?: string): void {
  console.warn(bizName ? `[EtfmAdminWarn][${bizName}] ${message}` : `[EtfmAdminWarn] ${message}`);
}

function loggerDebug(message?: string, bizName?: string): void {
  console.debug(
    bizName ? `[EtfmAdminDebug][${bizName}] ${message}` : `[EtfmAdminDebug] ${message}`,
  );
}

export { loggerError, loggerWarning, loggerDebug };

interface Options {
  pre?: string;
  bizName: string;
}

export class Logger {
  private pre: string;
  private bizName: string;
  constructor(opts: Options) {
    this.bizName = opts.bizName;
    this.pre = opts.pre ?? 'EtfmAdmin';
  }

  debug(...args) {
    console.debug(`[${this.pre}]`, `[${this.bizName}]`, ...args);
  }

  warn(...args) {
    console.warn(`[${this.pre}]`, `[${this.bizName}]`, ...args);
  }

  error(...args) {
    console.error(`[${this.pre}]`, `[${this.bizName}]`, ...args);
  }

  log(...args) {
    console.log(`[${this.pre}]`, `[${this.bizName}]`, ...args);
  }

  info(...args) {
    console.info(`[${this.pre}]`, `[${this.bizName}]`, ...args);
  }
}
