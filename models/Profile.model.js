const { Schema, model } = require('mongoose');

const profileSchema = new Schema(
  {
    name: { type: String },
    imageUrl: { type: String, default: ''},
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true
  }
);

module.exports = model('Profile', userSchema);