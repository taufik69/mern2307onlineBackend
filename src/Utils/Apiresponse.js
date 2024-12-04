class ApiResponse {
  constructor(error = false, message = null, status = 200, data = null) {
    this.error = error;
    this.message = message;
    this.status = status;
    this.data = data;
  }
}

module.exports = { ApiResponse };
