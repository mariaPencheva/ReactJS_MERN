const { Schema, model, Types } = require('mongoose');

const taskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    takenBy: {
        type: Types.ObjectId,
        ref: 'User',
        default: null
    }, 
    completed: {
        type: Boolean,
        default: false
    },
    completedBy: {
        type: Types.ObjectId,
        ref: 'User',
        default: null
    }
});

const Task = model('Task', taskSchema);

module.exports = { Task };