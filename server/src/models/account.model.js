import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    accountType: {
      type: String,
      enum: ['savings', 'checking', 'credit'],
      required: true
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Balance cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    },
    status: {
      type: String,
      enum: ['active', 'frozen', 'closed'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

const Account = mongoose.model('Account', accountSchema);
export default Account;
