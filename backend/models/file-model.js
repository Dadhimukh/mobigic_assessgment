const mongoose = require('mongoose');

const fileSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },

        title: { type: String, required: true },
        code: { type: String, required: true },
        img: [{ type: String, required: true }],
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = mongoose.model('file', fileSchema);
