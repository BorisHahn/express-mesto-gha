class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
  }

  statusCode() {
    return this.status;
  }
}
module.exports = NotFoundError;
