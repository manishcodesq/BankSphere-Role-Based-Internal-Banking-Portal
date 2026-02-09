import mongoose, { Schema } from 'mongoose';

const transactionSchema = new Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true
  },
  type: {
    type: String,
    enum: ["CREDIT", "DEBIT"],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String
  }
},{
  timestamps: true
});

export const Transaction = mongoose.model('Transaction', transactionSchema);