class ConflctError extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
  }

  statusCode() {
    return this.status;
  }
}
module.exports = ConflctError;
