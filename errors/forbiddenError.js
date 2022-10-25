class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.status = 403;
  }

  statusCode() {
    return this.status;
  }
}
module.exports = ForbiddenError;
