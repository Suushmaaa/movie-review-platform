const { body, validationResult } = require('express-validator');

// Helper function to handle validation results
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// User registration validation
const validateRegistration = [
    body('username')
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    handleValidationErrors
];

// User login validation
const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    handleValidationErrors
];

// Movie creation validation
const validateMovie = [
    body('title')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title is required and must be less than 200 characters'),
    
    body('genre')
        .isArray({ min: 1 })
        .withMessage('At least one genre is required'),
    
    body('genre.*')
        .isIn([
            'Action', 'Adventure', 'Animation', 'Biography', 'Comedy',
            'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy',
            'History', 'Horror', 'Music', 'Mystery', 'Romance',
            'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
        ])
        .withMessage('Invalid genre provided'),
    
    body('releaseYear')
        .isInt({ min: 1888, max: new Date().getFullYear() + 2 })
        .withMessage('Release year must be a valid year'),
    
    body('director')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Director name is required and must be less than 100 characters'),
    
    body('synopsis')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Synopsis must be between 10 and 2000 characters'),
    
    body('posterUrl')
        .optional()
        .isURL()
        .withMessage('Poster URL must be a valid URL'),
    
    body('trailerUrl')
        .optional()
        .isURL()
        .withMessage('Trailer URL must be a valid URL'),
    
    body('runtime')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Runtime must be a positive number'),
    
    handleValidationErrors
];

// Review creation validation
const validateReview = [
    body('rating')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    
    body('reviewText')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Review text must be between 10 and 2000 characters'),
    
    body('title')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Review title must be less than 100 characters'),
    
    body('spoilers')
        .optional()
        .isBoolean()
        .withMessage('Spoilers field must be true or false'),
    
    handleValidationErrors
];

// User profile update validation
const validateProfileUpdate = [
    body('username')
        .optional()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio must be less than 500 characters'),
    
    body('profilePicture')
        .optional()
        .isURL()
        .withMessage('Profile picture must be a valid URL'),
    
    body('favoriteGenres')
        .optional()
        .isArray()
        .withMessage('Favorite genres must be an array'),
    
    body('favoriteGenres.*')
        .optional()
        .isIn([
            'Action', 'Adventure', 'Animation', 'Biography', 'Comedy',
            'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy',
            'History', 'Horror', 'Music', 'Mystery', 'Romance',
            'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
        ])
        .withMessage('Invalid genre provided'),
    
    handleValidationErrors
];

// Watchlist validation
const validateWatchlist = [
    body('movieId')
        .isMongoId()
        .withMessage('Valid movie ID is required'),
    
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be low, medium, or high'),
    
    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Notes must be less than 500 characters'),
    
    body('category')
        .optional()
        .isIn(['want-to-watch', 'watching', 'watched', 'dropped'])
        .withMessage('Invalid category provided'),
    
    handleValidationErrors
];

// Password change validation
const validatePasswordChange = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Password confirmation does not match new password');
            }
            return true;
        }),
    
    handleValidationErrors
];

// MongoDB ObjectId validation
const validateObjectId = (paramName) => {
    return (req, res, next) => {
        const id = req.params[paramName];
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: `Invalid ${paramName} format`
            });
        }
        next();
    };
};

module.exports = {
    validateRegistration,
    validateLogin,
    validateMovie,
    validateReview,
    validateProfileUpdate,
    validateWatchlist,
    validatePasswordChange,
    validateObjectId,
    handleValidationErrors
};