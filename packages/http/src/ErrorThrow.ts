export interface IErrorThrow {
  message: string
  name: string
  code: string | number
  type: string
  result?: any
  info?: any
}

export class ErrorThrow {
  public message: string
  public name: string
  public code: string | number
  public type: string
  public result?: any
  public info?: any

  constructor(opts: IErrorThrow) {
    this.message = opts.message
    this.name = opts.name
    this.code = opts.code
    this.type = opts.type
    this.result = opts.result
    this.info = opts.info
  }
}
