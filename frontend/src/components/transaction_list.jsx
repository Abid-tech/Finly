import React from 'react'
import { useState } from 'react'
import API_BASE from "../../lib/api_base"

function Transactionlist({viewDate, financeData, setFinanceData, loading, formatMoney, formatDate}) {
    

  const today = new Date();  

  const [transactionModal, setTransactionModal] =useState(false);
  const [transactionForm, setTransactionForm] = useState({
    type: 'Expense',
    description: '',
    category: '',
    amount: '',
    date: '',
    paymentMethod: 'Cash',
    note: '',
  });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);


    
  const openTransactionModal = () => {

    setTransactionForm({
      type: 'Expense',
      description: '',
      category: '',
      amount: '',
      date: getDefaultTransactionDate(),
      paymentMethod: 'Cash',
      note: '',
    });

    setTransactionModal(true);
  };


const openEditTransactionModal = (transaction) => {

  setOpenMenuId(null);

  setEditingTransaction(transaction);

  setTransactionForm({

    type: transaction.type || 'Expense',
    description: transaction.description || '',
    category:transaction.category || '',
    amount:transaction.amount || '',

    date:
      transaction.date
        ? new Date(transaction.date)
            .toISOString()
            .split('T')[0]
        : '',

    paymentMethod: transaction.paymentMethod || 'Cash',
    note: transaction.note || '',

  });


  setTransactionModal(true);

};




  
  const getDefaultTransactionDate = () => {

    const year = viewDate.year;

    const month = String(
      viewDate.month + 1
    ).padStart(2, '0');


    const isCurrentMonth =
      year === today.getFullYear() &&
      viewDate.month === today.getMonth();


    if (isCurrentMonth) {

      const day = String(
        today.getDate()
      ).padStart(2, '0');

      return `${year}-${month}-${day}`;

    }


    return `${year}-${month}-01`;
  };



  const closeTransactionModal = () => {

    setEditingTransaction(null);
    setTransactionModal(false);

  };

  
    const handleTransactionChange = (e) => {
  
      const {
        name,
        value,
      } = e.target;
  
  
      setTransactionForm(prev => ({
        ...prev,
        [name]: value,
      }));
  
    };
  
    const handleTransactionSubmit = async (e) => {

  e.preventDefault();


  try {

    // ==========================================
    // EDIT TRANSACTION
    // ==========================================

    if (editingTransaction) {

      const response = await fetch(

        `${API_BASE}/finance/transaction/${editingTransaction._id}`,

        {

          method: 'PUT',

          headers: {

            'Content-Type':
              'application/json',

          },

          credentials: 'include',

          body: JSON.stringify({

            year:
              viewDate.year,

            month:
              viewDate.month + 1,

            ...transactionForm,

            amount:
              Number(transactionForm.amount),

          }),

        }

      );


      const data =
        await response.json();


      if (!response.ok) {

        alert(
          data.message ||
          'Failed to update transaction.'
        );

        return;

      }


      // ----------------------------------------
      // SAME MONTH
      // ----------------------------------------

      if (
        !data.movedToAnotherMonth
      ) {

        setFinanceData({

          ...data.finance,

          transactions:
            data.finance.transactions || [],

        });

      }


      // ----------------------------------------
      // MOVED TO ANOTHER MONTH
      // ----------------------------------------

      else {

        /*
          The transaction was moved out of
          the currently displayed month.

          Therefore reload the current month.
        */

        setFinanceData(
          prev => ({

            ...prev,

            transactions:
              prev.transactions.filter(
                transaction =>
                  transaction._id !==
                  editingTransaction._id
              ),

          })
        );

      }


      closeTransactionModal();

      setEditingTransaction(null);

      return;

    }


    // ==========================================
    // ADD TRANSACTION
    // ==========================================

    const response = await fetch(

      `${API_BASE}/finance/transaction`,

      {

        method: 'POST',

        headers: {

          'Content-Type':
            'application/json',

        },

        credentials: 'include',

        body: JSON.stringify({

          year:
            viewDate.year,

          month:
            viewDate.month + 1,

          ...transactionForm,

          amount:
            Number(transactionForm.amount),

        }),

      }

    );


    const data =
      await response.json();


    if (!response.ok) {

      alert(
        data.message ||
        'Failed to add transaction.'
      );

      return;

    }


    setFinanceData({

      ...data.finance,

      transactions:
        data.finance.transactions || [],

    });


    closeTransactionModal();


  } catch (error) {

    console.error(error);

    alert(
      'Something went wrong.'
    );

  }

};
  
  




  return (
    <>
         <div className="transactions-section" id="transactions-section">


            <div className="section-header">

              <div>

                <p className="section-label">
                  FINANCIAL ACTIVITY
                </p>

                <h2>
                  Transactions
                </h2>

                <p>
                  Keep track of your earnings,
                  expenses and savings.
                </p>

              </div>


              <button
                className="add-transaction-btn"
                onClick={openTransactionModal}
              >

                <i className="bi bi-plus"></i>

                Add Transaction

              </button>

            </div>




            <div className="transaction-table-wrapper">

              <table className="transaction-table">

                <thead>

                  <tr>

                    <th>Type</th>

                    <th>Description</th>

                    <th>Category</th>

                    <th>Amount</th>

                    <th>Date</th>

                    <th></th>

                  </tr>

                </thead>


                <tbody>

                  {loading ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="empty-transactions"
                      >
                        Loading...
                      </td>

                    </tr>

                  ) : financeData.transactions.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="empty-transactions"
                      >
                        No transactions for this month.
                      </td>

                    </tr>

                  ) : (

                    financeData.transactions
                      .map((transaction) => (

                        <tr
                          key={transaction._id}
                        >

                          <td>

                            <span
                              className={`transaction-type ${transaction.type.toLowerCase()}`}
                            >
                              {transaction.type}
                            </span>

                          </td>


                          <td>

                            <div className="transaction-description">

                              <span className="transaction-icon">

                                {transaction.type === 'Expense' && (
                                  <i className="bi bi-arrow-up-right"></i>
                                )}

                                {transaction.type === 'Saving' && (
                                  <i className="bi bi-piggy-bank"></i>
                                )}

                                {transaction.type === 'Earning' && (
                                  <i className="bi bi-arrow-down-left"></i>
                                )}

                              </span>


                              <span>
                                {transaction.description}
                              </span>

                            </div>

                          </td>


                          <td>

                            <span className="transaction-category">
                              {transaction.category}
                            </span>

                          </td>


                          <td>

                            <strong
                              className={`transaction-amount ${transaction.type.toLowerCase()}`}
                            >

                              {transaction.type === 'Expense'
                                ? '-'
                                : '+'}

                              ৳{formatMoney(
                                transaction.amount
                              )}

                            </strong>

                          </td>


                          <td>

                            <span className="transaction-date">

                              {formatDate(
                                transaction.date
                              )}

                            </span>

                          </td>


                         <td>

                            <div className="transaction-actions">

                              <button
                                type="button"
                                className="transaction-menu"
                                onClick={() =>
                                  setOpenMenuId(
                                    openMenuId === transaction._id
                                      ? null
                                      : transaction._id
                                  )
                                }
                              >

                                <i className="bi bi-three-dots-vertical"></i>

                              </button>


                              {openMenuId === transaction._id && (

                                <div className="transaction-dropdown">

                                  <button
                                    type="button"
                                    onClick={() => {
                                      openEditTransactionModal(transaction);
                                    }}
                                  >

                                    <i className="bi bi-pencil"></i>

                                    Edit

                                  </button>

                                </div>

                              )}

                            </div>

                          </td>

                        </tr>

                      ))

                  )}

                </tbody>

              </table>

            </div>

          </div>


          {transactionModal && (

        <div
          className="finance-modal-overlay"
          onClick={closeTransactionModal}
        >

          <div
            className="finance-modal transaction-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="finance-modal-header">

              <div>

                <p className="modal-label">
                  FINANCIAL ACTIVITY
                </p>

                  <h2>
                    {editingTransaction
                      ? 'Edit Transaction'
                      : 'Add Transaction'}
                  </h2>


              </div>


              <button
                className="modal-close"
                onClick={closeTransactionModal}
              >

                <i className="bi bi-x-lg"></i>

              </button>

            </div>


            <form
              onSubmit={handleTransactionSubmit}
            >


              {/* TYPE */}

              <div className="form-group">

                <label>
                  Transaction Type
                </label>

                <select
                  name="type"
                  value={transactionForm.type}
                  onChange={handleTransactionChange}
                >

                  <option value="Expense">
                    Expense
                  </option>

                  <option value="Earning">
                    Earning
                  </option>

                  <option value="Saving">
                    Saving
                  </option>

                </select>

              </div>



              {/* DESCRIPTION */}

              <div className="form-group">

                <label>
                  Description
                </label>

                <input
                  type="text"
                  name="description"
                  value={
                    transactionForm.description
                  }
                  onChange={
                    handleTransactionChange
                  }
                  placeholder="e.g. Grocery shopping"
                  required
                />

              </div>



              {/* CATEGORY */}

              <div className="form-group">

                <label>
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={
                    transactionForm.category
                  }
                  onChange={
                    handleTransactionChange
                  }
                  placeholder="e.g. Food"
                  required
                />

              </div>



              <div className="modal-form-row">


                {/* AMOUNT */}

                <div className="form-group">

                  <label>
                    Amount
                  </label>

                  <div className="amount-input">

                    <span>৳</span>

                    <input
                      type="number"
                      name="amount"
                      min="1"
                      value={
                        transactionForm.amount
                      }
                      onChange={
                        handleTransactionChange
                      }
                      placeholder="1000"
                      required
                    />

                  </div>

                </div>



                {/* DATE */}

                <div className="form-group">

                  <label>
                    Date
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={
                      transactionForm.date
                    }
                    onChange={
                      handleTransactionChange
                    }
                    required
                  />

                </div>

              </div>



              {/* PAYMENT METHOD */}

              <div className="form-group">

                <label>
                  Payment Method
                </label>

                <select
                  name="paymentMethod"
                  value={
                    transactionForm.paymentMethod
                  }
                  onChange={
                    handleTransactionChange
                  }
                >

                  <option value="Cash">
                    Cash
                  </option>

                  <option value="Card">
                    Card
                  </option>

                  <option value="Mobile Banking">
                    Mobile Banking
                  </option>

                  <option value="Bank Transfer">
                    Bank Transfer
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>



              {/* NOTE */}

              <div className="form-group">

                <label>
                  Note
                  <span>
                    {' '} (Optional)
                  </span>
                </label>

                <textarea
                  name="note"
                  value={
                    transactionForm.note
                  }
                  onChange={
                    handleTransactionChange
                  }
                  placeholder="Add a note..."
                  rows="3"
                />

              </div>



              <div className="modal-actions">

                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={
                    closeTransactionModal
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="modal-submit-btn"
                >
                  {editingTransaction
                    ? 'Update Transaction'
                    : 'Add Transaction'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}
    </>
  )
}

export default Transactionlist