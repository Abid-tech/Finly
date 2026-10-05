const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Expense', 'Saving', 'Earning'],
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    date: {
      type: Date,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: [
        'Cash',
        'Card',
        'Mobile Banking',
        'Bank Transfer',
        'Other',
      ],
      default: 'Cash',
    },

    note: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    _id: true,
  }
);

const financeManagementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Example: "2026-10"
    monthKey: {
      type: String,
      required: true,
    },

    Income: {
      total: {
        type: Number,
        default: 0,
      },

      target: {
        type: Number,
        default: 0,
      },
    },

    Expense: {
      total: {
        type: Number,
        default: 0,
      },

      target: {
        type: Number,
        default: 0,
      },
    },

    Savings: {
      total: {
        type: Number,
        default: 0,
      },

      target: {
        type: Number,
        default: 0,
      },
    },

    transactions: {
      type: [transactionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// One finance document per user per month
financeManagementSchema.index(
  {
    userId: 1,
    monthKey: 1,
  },
  {
    unique: true,
  }
);

const FinanceManagement = mongoose.model(
  'FinanceManagement',
  financeManagementSchema
);

module.exports = FinanceManagement;