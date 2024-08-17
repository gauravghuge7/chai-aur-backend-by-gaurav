
class ApiResponse {

    constructor(statusCode, message, data, anything) {

        this.success = statusCode < 400
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.anything = anything
    }
}

export {ApiResponse};