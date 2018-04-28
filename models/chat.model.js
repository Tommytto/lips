const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        lowercase: true,
        trim: true,
        required: true,
    },
    messages: [
        {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Message',
            lowercase: true,
            trim: true,
        }
    ],
    members: [
        {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
            lowercase: true,
            trim: true,
            required: true,
        }
    ],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chat', ChatSchema);