class BaseError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class HttpError extends BaseError {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

class UnauthorizedError extends HttpError {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}

class ForbiddenError extends HttpError {
    constructor(message = 'Forbidden') {
        super(403, message);
    }
}

function errorHandler(err, req, res, next) {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = {
    errorHandler,
    UnauthorizedError,
    ForbiddenError
};