class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }

  statusCode() {
    return this.status;
  }
}

module.exports = UnauthorizedError;
