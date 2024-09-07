const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        password: { type: String, required: true },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = model('user', userSchema);
