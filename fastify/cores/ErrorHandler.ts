export default class ErrorHandler extends Error {
  statusCode: number;
  details: string;

  constructor(message: string) {
    super(message);
    this.statusCode = 500;
    this.details = message;
  }
}
