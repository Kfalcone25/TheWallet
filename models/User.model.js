const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Username is required.'],
      unique: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.']
    },
    imageUrl: {
      type: String,
      default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpoc2ggk58dMOxPE3QASBseVgg5AUkoPaQjA&usqp=CAU'
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);