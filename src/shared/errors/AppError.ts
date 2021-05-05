export default class AppError {
  public readonly httpCode: number;

  public readonly message: string;

  constructor(message: string, httpCode = 400) {
    this.httpCode = httpCode;
    this.message = message;
  }
}
