const express = require('express');

const router = express.Router();

const AuthMiddleware = require('../middleware/authMiddleware');

const {
  HandleGetFinanceManagement,
  HandleUpdateFinanceManagement,
  HandleAddTransaction,
  HandleGetFinanceReport,
  HandleUpdateTransaction
} = require('../controller/FinanceManagement');


router.get(
  '/',
  AuthMiddleware,
  HandleGetFinanceManagement
);


router.put(
  '/goal',
  AuthMiddleware,
  HandleUpdateFinanceManagement
);


router.post(
  '/transaction',
  AuthMiddleware,
  HandleAddTransaction
);

router.get(
  '/report',
  AuthMiddleware,
  HandleGetFinanceReport
);

router.put(
  '/transaction/:transactionId',
  AuthMiddleware,
  HandleUpdateTransaction
);


module.exports = router;