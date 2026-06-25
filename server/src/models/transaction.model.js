import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      index: true,
      required: function () {
        return this.transactionType === 'deposit' || this.transactionType === 'withdraw';
      }
    },
    senderAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      index: true,
      required: function () {
        return this.transactionType === 'transfer';
      }
    },
    receiverAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      index: true,
      required: function () {
        return this.transactionType === 'transfer';
      }
    },
    transactionType: {
      type: String,
      enum: ['deposit', 'withdraw', 'transfer'],
      required: true
    },
    amount: {
      type: Number,
      required: [true, 'Please provide transaction amount'],
      min: [0.01, 'Transaction amount must be positive']
    },
    balanceBefore: {
      type: Number,
      required: true
    },
    balanceAfter: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description is too long']
    },
    reference: {
      type: String,
      trim: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    status: {
      type: String,
      enum: ['completed', 'failed', 'pending'],
      default: 'pending',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

transactionSchema.index({ createdAt: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
