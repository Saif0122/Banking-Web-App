import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        'REGISTER',
        'LOGIN',
        'ACCOUNT_CREATED',
        'DEPOSIT',
        'WITHDRAW',
        'TRANSFER',
        'USER_BLOCKED',
        'USER_UNBLOCKED',
        'ACCOUNT_FROZEN',
        'ACCOUNT_CLOSED',
        'PASSWORD_CHANGED'
      ]
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ipAddress: {
      type: String,
      default: ''
    },
    userAgent: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
