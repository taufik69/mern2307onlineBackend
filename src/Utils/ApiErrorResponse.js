class apiError {
  constructor(error = true, message, status = 404, data = null) {
    this.error = true;
    this.message = message;
    this.status = status;
    this.data = null;
  }
}

module.exports = { apiError };
