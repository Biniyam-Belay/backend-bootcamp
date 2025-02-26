import joi from 'joi';

//Validation schema for user creation
const userSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    name: joi.string().min(3).required(),
    role: joi.string().valid('user', 'admin').required()
});

// Validation schema for updating user
const updateUserSchema = joi.object({
    email: joi.string().email().required(),
    role: joi.string().valid('user', 'admin').optional()
});

//Middleware to validate user creation input
export const validateCreateUser = (req, res, next) => {
    const { error } = userSchema.validate(req, body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

// Middleware to validate user update input
export const validateUpdateUser = (req, res, next) => {
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
};