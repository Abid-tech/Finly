const express = require('express');

const router = express.Router();

const AuthMiddleware = require('../middleware/authMiddleware');

const {
  HandleGetFinanceManagement,
  HandleUpdateFinanceManagement,
  HandleAddTransaction,
  HandleGetFinanceReport
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


module.exports = router;