const errorMiddleware = (err, req, res, next) => {
    console.error("❌ ERROR REAL:", err);

    const statusCode = err.statusCode || 500;
    const message = err.isOperational
        ? err.message
        : "Error interno del servidor";

    return res.status(statusCode).json({
        success: false,
        error: {
            message,
            code: err.code || "INTERNAL_ERROR"
        }
    });
}

module.exports = errorMiddleware;