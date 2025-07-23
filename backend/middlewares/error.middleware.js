const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let error = { ...err };
    error.message = err.message;

    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        const message = err.errors.map(error => error.message).join(', ');
        error = { message, statusCode: 400 };
    }

    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
    }

    // Sequelize foreign key constraint error
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        const message = 'Resource not found';
        error = { message, statusCode: 404 };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

export default errorHandler;