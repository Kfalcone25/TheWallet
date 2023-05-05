const { Schema, model } = require('mongoose');

const walletSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    initialBudget: { type: Number, default: 0},
    trackers: [{type: Schema.Types.ObjectId, ref: "Tracker"}]
  },
  {
    timestamps: true
  }
);

module.exports = model('Wallet', walletSchema);