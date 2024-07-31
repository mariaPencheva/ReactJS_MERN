const { Schema, model, Types } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        // unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },    
    password: {
        type: String,
        required: true
    },
    createdTasks: [{
        type: Types.ObjectId,
        ref: 'Task'
    }],
    completedTasks: [{
        type: Types.ObjectId,
        ref: 'Task'
    }],
    takenTasks: [{
        type: Types.ObjectId,
        ref: 'Task'
    }]
 });
 
 const User = model('User', userSchema);

 module.exports = { User };