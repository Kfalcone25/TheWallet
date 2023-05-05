const { Schema, model } = require('mongoose');

const trackerSchema = new Schema(
  {
    description: { type: String },
    value: { type: Number },
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    expense: {
      type: String,
      // enum: ['Fixed Expense', 'Variable Expense', 'Saving Expense'],
      // default: 'Fixed Expense',
    },
  },
  {
    timestamps: true
  }
);

module.exports = model('Tracker', trackerSchema);