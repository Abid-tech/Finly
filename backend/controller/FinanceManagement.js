const FinanceManagement = require('../model/FinanceManagement');



const getUserId = (req) => {
  return req.user?.id || req.user?._id || req.user?.userId;
};


const getMonthKey = (year, month) => {
  return `${year}-${String(month).padStart(2, '0')}`;
};




const HandleGetFinanceManagement = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const today = new Date();

    const year = Number(req.query.year) || today.getFullYear();
    const month = Number(req.query.month) || today.getMonth() + 1;

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;


    if (
      year > currentYear ||
      (year === currentYear && month > currentMonth)
    ) {
      return res.status(400).json({
        message: 'Future months are not allowed.',
      });
    }

    const monthKey = getMonthKey(year, month);

    let finance = await FinanceManagement.findOne({
      userId,
      monthKey,
    });


    if (!finance) {
      finance = {
        userId,
        monthKey,

        Income: {
          total: 0,
          target: 0,
        },

        Expense: {
          total: 0,
          target: 0,
        },

        Savings: {
          total: 0,
          target: 0,
        },

        transactions: [],
      };
    }

    return res.status(200).json(finance);

  } catch (error) {
    console.error('Get Finance Management Error:', error);

    return res.status(500).json({
      message: 'Failed to fetch finance data.',
    });
  }
};


// --------------------------------------------------
// SET GOAL / TARGET
// PUT /finance-management/goal
// --------------------------------------------------

const HandleUpdateFinanceManagement = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const {
      year,
      month,
      type,
      target,
    } = req.body;

    if (!year || !month || !type || target === undefined) {
      return res.status(400).json({
        message: 'Year, month, type and target are required.',
      });
    }

    if (!['Income', 'Expense', 'Savings'].includes(type)) {
      return res.status(400).json({
        message: 'Invalid finance type.',
      });
    }

    if (Number(target) < 0) {
      return res.status(400).json({
        message: 'Target cannot be negative.',
      });
    }

    const today = new Date();

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    if (
      Number(year) > currentYear ||
      (
        Number(year) === currentYear &&
        Number(month) > currentMonth
      )
    ) {
      return res.status(400).json({
        message: 'Future months are not allowed.',
      });
    }

    const monthKey = getMonthKey(
      Number(year),
      Number(month)
    );

    const finance = await FinanceManagement.findOneAndUpdate(
      {
        userId,
        monthKey,
      },
      {
        $set: {
          [`${type}.target`]: Number(target),
        },

        $setOnInsert: {
          userId,
          monthKey,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      message: `${type} target updated successfully.`,
      finance,
    });

  } catch (error) {
    console.error('Update Finance Management Error:', error);

    return res.status(500).json({
      message: 'Failed to update target.',
    });
  }
};


const HandleAddTransaction = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const {
      year,
      month,
      type,
      description,
      category,
      amount,
      date,
      paymentMethod,
      note,
    } = req.body;

    if (
      !year ||
      !month ||
      !type ||
      !description ||
      !category ||
      amount === undefined ||
      !date
    ) {
      return res.status(400).json({
        message: 'Please provide all required transaction fields.',
      });
    }

    if (!['Expense', 'Saving', 'Earning'].includes(type)) {
      return res.status(400).json({
        message: 'Invalid transaction type.',
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message: 'Amount must be greater than zero.',
      });
    }

    const transactionDate = new Date(date);

    if (Number.isNaN(transactionDate.getTime())) {
      return res.status(400).json({
        message: 'Invalid transaction date.',
      });
    }

    // Make sure transaction belongs to selected month
    const transactionYear = transactionDate.getFullYear();
    const transactionMonth = transactionDate.getMonth() + 1;

    if (
      transactionYear !== Number(year) ||
      transactionMonth !== Number(month)
    ) {
      return res.status(400).json({
        message: 'Transaction date must belong to the selected month.',
      });
    }

    const today = new Date();

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    // Don't allow future months
    if (
      Number(year) > currentYear ||
      (
        Number(year) === currentYear &&
        Number(month) > currentMonth
      )
    ) {
      return res.status(400).json({
        message: 'Future months are not allowed.',
      });
    }

    const monthKey = getMonthKey(
      Number(year),
      Number(month)
    );

    const transaction = {
      type,
      description,
      category,
      amount: Number(amount),
      date: transactionDate,
      paymentMethod: paymentMethod || 'Cash',
      note: note || '',
    };

    let finance = await FinanceManagement.findOne({
      userId,
      monthKey,
    });

    if (!finance) {
      finance = new FinanceManagement({
        userId,
        monthKey,
        Income: {
          total: 0,
          target: 0,
        },
        Expense: {
          total: 0,
          target: 0,
        },
        Savings: {
          total: 0,
          target: 0,
        },
        transactions: [],
      });
    }

    finance.transactions.push(transaction);

    // Update corresponding total
    if (type === 'Earning') {
      finance.Income.total += Number(amount);
    }

    if (type === 'Expense') {
      finance.Expense.total += Number(amount);
    }

    if (type === 'Saving') {
      finance.Savings.total += Number(amount);
    }

    await finance.save();

    return res.status(201).json({
      message: 'Transaction added successfully.',
      finance,
    });

  } catch (error) {
    console.error('Add Transaction Error:', error);

    return res.status(500).json({
      message: 'Failed to add transaction.',
    });
  }
};


const HandleGetFinanceReport = async (req, res) => {

  try {

    const userId = getUserId(req);

    if (!userId) {

      return res.status(401).json({
        message: 'Unauthorized.',
      });

    }


    const financeRecords = await FinanceManagement
      .find({ userId })
      .sort({ monthKey: 1 });


    return res.status(200).json({
      financeRecords,
    });


  } catch (error) {

    console.error(
      'Get finance report error:',
      error
    );


    return res.status(500).json({
      message: 'Failed to generate finance report.',
    });

  }

};



const HandleUpdateTransaction = async (req, res) => {

  try {

    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;


    if (!userId) {

      return res.status(401).json({
        message: 'Unauthorized.',
      });

    }


    const { transactionId } = req.params;

    const {
      year,
      month,
      type,
      description,
      category,
      amount,
      date,
      paymentMethod,
      note,
    } = req.body;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !transactionId ||
      !type ||
      !description ||
      !category ||
      !amount ||
      !date
    ) {

      return res.status(400).json({
        message: 'All required fields must be provided.',
      });

    }


    if (
      !['Expense', 'Earning', 'Saving'].includes(type)
    ) {

      return res.status(400).json({
        message: 'Invalid transaction type.',
      });

    }


    const newAmount = Number(amount);


    if (
      Number.isNaN(newAmount) ||
      newAmount <= 0
    ) {

      return res.status(400).json({
        message: 'Amount must be greater than 0.',
      });

    }


    // ==========================================
    // FIND THE OLD TRANSACTION
    // ==========================================

    const oldFinance =
      await FinanceManagement.findOne({
        userId,
        monthKey:
          `${year}-${String(month).padStart(2, '0')}`,
        'transactions._id': transactionId,
      });


    if (!oldFinance) {

      return res.status(404).json({
        message: 'Transaction not found.',
      });

    }


    const oldTransaction =
      oldFinance.transactions.id(transactionId);


    if (!oldTransaction) {

      return res.status(404).json({
        message: 'Transaction not found.',
      });

    }


    // ==========================================
    // DETERMINE OLD VALUES
    // ==========================================

    const oldType =
      oldTransaction.type;

    const oldAmount =
      Number(oldTransaction.amount);


    // ==========================================
    // DETERMINE NEW MONTH
    // ==========================================

    const newDate =
      new Date(date);


    if (Number.isNaN(newDate.getTime())) {

      return res.status(400).json({
        message: 'Invalid transaction date.',
      });

    }


    const newMonthKey =
      `${newDate.getFullYear()}-${String(
        newDate.getMonth() + 1
      ).padStart(2, '0')}`;


    const oldMonthKey =
      oldFinance.monthKey;


    // ==========================================
    // CASE 1:
    // SAME MONTH
    // ==========================================

    if (oldMonthKey === newMonthKey) {

      oldTransaction.type = type;

      oldTransaction.description =
        description;

      oldTransaction.category =
        category;

      oldTransaction.amount =
        newAmount;

      oldTransaction.date =
        newDate;

      oldTransaction.paymentMethod =
        paymentMethod || 'Cash';

      oldTransaction.note =
        note || '';


      // ----------------------------------------
      // UPDATE TOTALS
      // ----------------------------------------

      oldFinance.Income.total =
        Number(oldFinance.Income.total || 0);

      oldFinance.Expense.total =
        Number(oldFinance.Expense.total || 0);

      oldFinance.Savings.total =
        Number(oldFinance.Savings.total || 0);


      // Remove old amount

      if (oldType === 'Earning') {

        oldFinance.Income.total -= oldAmount;

      }

      if (oldType === 'Expense') {

        oldFinance.Expense.total -= oldAmount;

      }

      if (oldType === 'Saving') {

        oldFinance.Savings.total -= oldAmount;

      }


      // Add new amount

      if (type === 'Earning') {

        oldFinance.Income.total += newAmount;

      }

      if (type === 'Expense') {

        oldFinance.Expense.total += newAmount;

      }

      if (type === 'Saving') {

        oldFinance.Savings.total += newAmount;

      }


      await oldFinance.save();


      return res.status(200).json({

        message:
          'Transaction updated successfully.',

        finance: oldFinance,

      });

    }


    // ==========================================
    // CASE 2:
    // TRANSACTION MOVED TO ANOTHER MONTH
    // ==========================================


    // ------------------------------------------
    // REMOVE FROM OLD MONTH
    // ------------------------------------------

    if (oldType === 'Earning') {

      oldFinance.Income.total -= oldAmount;

    }

    if (oldType === 'Expense') {

      oldFinance.Expense.total -= oldAmount;

    }

    if (oldType === 'Saving') {

      oldFinance.Savings.total -= oldAmount;

    }


    oldFinance.transactions =
      oldFinance.transactions.filter(
        transaction =>
          transaction._id.toString() !==
          transactionId
      );


    await oldFinance.save();


    // ------------------------------------------
    // FIND / CREATE NEW MONTH
    // ------------------------------------------

    let newFinance =
      await FinanceManagement.findOne({
        userId,
        monthKey: newMonthKey,
      });


    if (!newFinance) {

      newFinance =
        new FinanceManagement({

          userId,

          monthKey: newMonthKey,

          Income: {
            total: 0,
            target: 0,
          },

          Expense: {
            total: 0,
            target: 0,
          },

          Savings: {
            total: 0,
            target: 0,
          },

          transactions: [],

        });

    }


    // ------------------------------------------
    // ADD TRANSACTION TO NEW MONTH
    // ------------------------------------------

    newFinance.transactions.push({

      _id: transactionId,

      type,

      description,

      category,

      amount: newAmount,

      date: newDate,

      paymentMethod:
        paymentMethod || 'Cash',

      note: note || '',

    });


    // ------------------------------------------
    // UPDATE NEW MONTH TOTAL
    // ------------------------------------------

    if (type === 'Earning') {

      newFinance.Income.total =
        Number(newFinance.Income.total || 0)
        + newAmount;

    }

    if (type === 'Expense') {

      newFinance.Expense.total =
        Number(newFinance.Expense.total || 0)
        + newAmount;

    }

    if (type === 'Saving') {

      newFinance.Savings.total =
        Number(newFinance.Savings.total || 0)
        + newAmount;

    }


    await newFinance.save();


    // ==========================================
    // RETURN THE NEW MONTH
    // ==========================================

    return res.status(200).json({

      message:
        'Transaction updated successfully.',

      finance: newFinance,

      movedToAnotherMonth: true,

    });


  } catch (error) {

    console.error(
      'Update transaction error:',
      error
    );


    return res.status(500).json({

      message:
        'Failed to update transaction.',

    });

  }

};



module.exports = {
  HandleGetFinanceManagement,
  HandleUpdateFinanceManagement,
  HandleAddTransaction,
  HandleGetFinanceReport,
  HandleUpdateTransaction
};