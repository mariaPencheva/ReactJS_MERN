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
        required: false
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
    completedBy: {
        type: Types.ObjectId,
        ref: 'User',
        default: null
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const Task = model('Task', taskSchema);

module.exports = { Task };