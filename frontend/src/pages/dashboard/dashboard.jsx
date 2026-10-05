import React, {useContext,useEffect,useState} from 'react';
import './dashboard.css';
import Navbar from '../../components/navbar';
import { AuthContext } from '../../providers/authContext.provider';
import MonthSelector from '../../components/monthSelector';
import API_BASE from '../../../lib/api_base'
import Transactionlist from '../../components/transaction_list';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


function Dashboard() {

  const { user } = useContext(AuthContext);



  const today = new Date();

  const [viewDate, setViewDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });



  const [financeData, setFinanceData] = useState({
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


  const [loading, setLoading] = useState(false);


  // --------------------------------------------------
  // MODALS
  // --------------------------------------------------

  const [goalModal, setGoalModal] = useState(null);

  const [goalAmount, setGoalAmount] = useState('');



  const downloadPDF = async () => {

  try {

    // ==========================================
    // FETCH ALL FINANCE RECORDS
    // ==========================================

    const response = await fetch(
      `${API_BASE}/finance/report`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );


    if (!response.ok) {

      throw new Error(
        'Failed to fetch finance report.'
      );

    }


    const data = await response.json();

    const financeRecords =
      data.financeRecords || [];


    if (financeRecords.length === 0) {

      alert(
        'There is no financial data available for the report.'
      );

      return;

    }


    // ==========================================
    // CREATE PDF
    // ==========================================

    const doc = new jsPDF();


    // ==========================================
    // REPORT TITLE
    // ==========================================

    doc.setFontSize(20);

    doc.setFont('helvetica', 'bold');

    doc.text(
      'Financial Report',
      14,
      20
    );


    doc.setFontSize(10);

    doc.setFont('helvetica', 'normal');

    doc.text(
      `Generated on: ${new Date().toLocaleDateString('en-GB')}`,
      14,
      28
    );


    let firstMonth = true;


    // ==========================================
    // MONTH LOOP
    // ==========================================

    financeRecords.forEach(
      (finance, index) => {

        // --------------------------------------
        // NEW PAGE FOR EACH MONTH
        // --------------------------------------

        if (!firstMonth) {

          doc.addPage();

        }

        firstMonth = false;


        // --------------------------------------
        // MONTH NAME
        // --------------------------------------

        const [
          year,
          month
        ] = finance.monthKey
          .split('-')
          .map(Number);


        const monthName =
          new Date(
            year,
            month - 1,
            1
          ).toLocaleDateString(
            'en-US',
            {
              month: 'long',
              year: 'numeric',
            }
          );


        doc.setFontSize(16);

        doc.setFont(
          'helvetica',
          'bold'
        );


        doc.text(
          monthName,
          14,
          42
        );


        let currentY = 50;


        // ======================================
        // TRANSACTIONS
        // ======================================

        const transactions =
          finance.transactions || [];


        // --------------------------------------
        // EARNINGS
        // --------------------------------------

        const earnings =
          transactions.filter(
            transaction =>
              transaction.type === 'Earning'
          );


        doc.setFontSize(13);

        doc.setFont(
          'helvetica',
          'bold'
        );


        doc.text(
          'Earnings',
          14,
          currentY
        );


        currentY += 5;


        if (earnings.length > 0) {

          autoTable(doc, {

            startY: currentY,

            head: [[
              'Date',
              'Description',
              'Category',
              'Payment Method',
              'Amount'
            ]],

            body: earnings.map(
              transaction => [

                formatDate(
                  transaction.date
                ),

                transaction.description
                  || '-',

                transaction.category
                  || '-',

                transaction.paymentMethod
                  || '-',

                `Tk. ${formatMoney(
                  transaction.amount
                )}`,

              ]
            ),

            theme: 'grid',

            styles: {
              fontSize: 9,
            },

            headStyles: {
              fontStyle: 'bold',
            },

            columnStyles: {

              0: {
                cellWidth: 25,
              },

              1: {
                cellWidth: 45,
              },

              2: {
                cellWidth: 35,
              },

              3: {
                cellWidth: 35,
              },

              4: {
                cellWidth: 30,
                halign: 'right',
              },

            },

          });


          currentY =
            doc.lastAutoTable.finalY + 12;

        } else {

          doc.setFontSize(10);

          doc.setFont(
            'helvetica',
            'normal'
          );

          doc.text(
            'No earnings recorded.',
            14,
            currentY + 7
          );

          currentY += 18;

        }


        // ======================================
        // EXPENSES
        // ======================================

        doc.setFontSize(13);

        doc.setFont(
          'helvetica',
          'bold'
        );


        doc.text(
          'Expenses',
          14,
          currentY
        );


        currentY += 5;


        const expenses =
          transactions.filter(
            transaction =>
              transaction.type === 'Expense'
          );


        if (expenses.length > 0) {

          autoTable(doc, {

            startY: currentY,

            head: [[
              'Date',
              'Description',
              'Category',
              'Payment Method',
              'Amount'
            ]],

            body: expenses.map(
              transaction => [

                formatDate(
                  transaction.date
                ),

                transaction.description
                  || '-',

                transaction.category
                  || '-',

                transaction.paymentMethod
                  || '-',

                `Tk. ${formatMoney(
                  transaction.amount
                )}`,

              ]
            ),

            theme: 'grid',

            styles: {
              fontSize: 9,
            },

            headStyles: {
              fontStyle: 'bold',
            },

            columnStyles: {

              0: {
                cellWidth: 25,
              },

              1: {
                cellWidth: 45,
              },

              2: {
                cellWidth: 35,
              },

              3: {
                cellWidth: 35,
              },

              4: {
                cellWidth: 30,
                halign: 'right',
              },

            },

          });


          currentY =
            doc.lastAutoTable.finalY + 12;

        } else {

          doc.setFontSize(10);

          doc.setFont(
            'helvetica',
            'normal'
          );

          doc.text(
            'No expenses recorded.',
            14,
            currentY + 7
          );

          currentY += 18;

        }

        // ======================================
        // SAVINGS
        // ======================================

        doc.setFontSize(13);

        doc.setFont(
          'helvetica',
          'bold'
        );

        doc.text(
          'Savings',
          14,
          currentY
        );

        currentY += 5;

        const savings =
          transactions.filter(
            transaction =>
              transaction.type === 'Saving'
          );


        if (savings.length > 0) {

          autoTable(doc, {

            startY: currentY,

            head: [[
              'Date',
              'Description',
              'Category',
              'Payment Method',
              'Amount'
            ]],

            body: savings.map(
              transaction => [

                formatDate(
                  transaction.date
                ),

                transaction.description
                  || '-',

                transaction.category
                  || '-',

                transaction.paymentMethod
                  || '-',

                `Tk. ${formatMoney(
                  transaction.amount
                )}`,

              ]
            ),

            theme: 'grid',

            styles: {
              fontSize: 9,
            },

            headStyles: {
              fontStyle: 'bold',
            },

            columnStyles: {

              0: {
                cellWidth: 25,
              },

              1: {
                cellWidth: 45,
              },

              2: {
                cellWidth: 35,
              },

              3: {
                cellWidth: 35,
              },

              4: {
                cellWidth: 30,
                halign: 'right',
              },

            },

          });


          currentY =
            doc.lastAutoTable.finalY + 15;

        } else {

          doc.setFontSize(10);

          doc.setFont(
            'helvetica',
            'normal'
          );

          doc.text(
            'No savings recorded.',
            14,
            currentY + 7
          );

          currentY += 25;

        }


        // ======================================
        // MONTHLY TOTALS
        // ======================================

        doc.setFontSize(13);

        doc.setFont(
          'helvetica',
          'bold'
        );


        doc.text(
          'Monthly Summary',
          14,
          currentY
        );


        currentY += 6;


        autoTable(doc, {

          startY: currentY,

          body: [

            [
              'Total Earnings',
              `Tk. ${formatMoney(
                finance.Income?.total
              )}`,
            ],

            [
              'Total Expenses',
              `Tk. ${formatMoney(
                finance.Expense?.total
              )}`,
            ],

            [
              'Total Savings',
              `Tk. ${formatMoney(
                finance.Savings?.total
              )}`,
            ],

          ],

          theme: 'grid',

          styles: {
            fontSize: 10,
          },

          columnStyles: {

            0: {
              fontStyle: 'bold',
              cellWidth: 60,
            },

            1: {
              halign: 'right',
              cellWidth: 45,
            },

          },

        });

      }
    );


    // ==========================================
    // SAVE PDF
    // ==========================================

    doc.save(
      'financial-report.pdf'
    );


  } catch (error) {

    console.error(
      'PDF generation error:',
      error
    );


    alert(
      'Failed to generate the PDF.'
    );

  }

};





  const fetchFinanceData = async () => {

    try {

      setLoading(true);

      const month = viewDate.month + 1;

      const response = await fetch(
        `${API_BASE}/finance?year=${viewDate.year}&month=${month}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );


      if (!response.ok) {
        throw new Error(
          'Failed to fetch finance data.'
        );
      }


      const data = await response.json();


      setFinanceData({
        Income: data.Income || {
          total: 0,
          target: 0,
        },

        Expense: data.Expense || {
          total: 0,
          target: 0,
        },

        Savings: data.Savings || {
          total: 0,
          target: 0,
        },

        transactions: data.transactions || [],
      });


    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };


  // Fetch whenever month changes
  useEffect(() => {

    fetchFinanceData();

  }, [viewDate]);


  const openGoalModal = (type) => {

    setGoalModal(type);

    setGoalAmount(
      financeData[type]?.target || ''
    );
  };


  const closeGoalModal = () => {

    setGoalModal(null);

    setGoalAmount('');

  };


  const handleGoalSubmit = async (e) => {

    e.preventDefault();


    if (!goalAmount || Number(goalAmount) < 0) {
      return;
    }


    try {

      const response = await fetch(
        `${API_BASE}/finance/goal`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
          },

          credentials: 'include',

          body: JSON.stringify({
            year: viewDate.year,
            month: viewDate.month + 1,
            type: goalModal,
            target: Number(goalAmount),
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        alert(
          data.message || 'Failed to update target.'
        );

        return;
      }


      setFinanceData({
        ...data.finance,

        transactions:
          data.finance.transactions || [],
      });


      closeGoalModal();


    } catch (error) {

      console.error(error);

      alert('Something went wrong.');

    }

  };




  const getProgress = (total, target) => {

    if (!target || target <= 0) {
      return 0;
    }

    return Math.min(
      Math.round((total / target) * 100),
      100
    );
  };


  const incomeProgress = getProgress(
    financeData.Income.total,
    financeData.Income.target
  );


  const expenseProgress = getProgress(
    financeData.Expense.total,
    financeData.Expense.target
  );


  const savingsProgress = getProgress(
    financeData.Savings.total,
    financeData.Savings.target
  );



  const formatMoney = (amount) => {

    return Number(amount || 0)
      .toLocaleString();

  };


  const formatDate = (date) => {

    return new Date(date)
      .toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }
      );

  };


  return (
    <>
      <Navbar />


      <section className="dashboard">

        <div className="container">



          <div className="dashboard-header">

            <div>

              <p className="dashboard-label">
                FINANCIAL OVERVIEW
              </p>

              <h1>
                Good morning, {user?.fullName}
              </h1>

              <p className="dashboard-subtitle">
                Here's your financial overview.
              </p>

            </div>


            <MonthSelector
              viewDate={viewDate}
              setViewDate={setViewDate}
            />

          </div>



          <div className="row summary-row">


     

            <div className="col-lg-4 col-md-6">

              <div className="summary-card earnings-card">

                <div className="summary-card-top">

                  <div className="summary-icon earnings-icon">

                    <i className="bi bi-arrow-down"></i>

                  </div>


                  <button
                    className="card-action"
                    onClick={() =>
                      openGoalModal('Income')
                    }
                  >

                    <i className="bi bi-plus"></i>

                  </button>

                </div>


                <h3>Earnings</h3>

                <h2>
                  ৳{formatMoney(
                    financeData.Income.total
                  )}
                </h2>

                <p>
                  Total income this month
                </p>


                <div className="target-info">

                  <span>Target</span>

                  <span>
                    ৳{formatMoney(
                      financeData.Income.target
                    )}
                  </span>

                </div>


                <div className="progress-track">

                  <div
                    className="progress-fill earnings-progress"
                    style={{
                      width: `${incomeProgress}%`,
                    }}
                  />

                </div>


                <div className="progress-bottom">

                  <span>Achieved</span>

                  <strong>
                    {incomeProgress}%
                  </strong>

                </div>

              </div>

            </div>




            <div className="col-lg-4 col-md-6">

              <div className="summary-card expenses-card">

                <div className="summary-card-top">

                  <div className="summary-icon expenses-icon">

                    <i className="bi bi-arrow-up"></i>

                  </div>


                  <button
                    className="card-action"
                    onClick={() =>
                      openGoalModal('Expense')
                    }
                  >

                    <i className="bi bi-plus"></i>

                  </button>

                </div>


                <h3>Expenses</h3>

                <h2>
                  ৳{formatMoney(
                    financeData.Expense.total
                  )}
                </h2>

                <p>
                  Total spent this month
                </p>


                <div className="target-info">

                  <span>Budget</span>

                  <span>
                    ৳{formatMoney(
                      financeData.Expense.target
                    )}
                  </span>

                </div>


                <div className="progress-track">

                  <div
                    className="progress-fill expenses-progress"
                    style={{
                      width: `${expenseProgress}%`,
                    }}
                  />

                </div>


                <div className="progress-bottom">

                  <span>Used</span>

                  <strong>
                    {expenseProgress}%
                  </strong>

                </div>

              </div>

            </div>




            <div className="col-lg-4 col-md-12">

              <div className="summary-card savings-card">

                <div className="summary-card-top">

                  <div className="summary-icon savings-icon">

                    <i className="bi bi-piggy-bank"></i>

                  </div>


                  <button
                    className="card-action"
                    onClick={() =>
                      openGoalModal('Savings')
                    }
                  >

                    <i className="bi bi-plus"></i>

                  </button>

                </div>


                <h3>Savings</h3>

                <h2>
                  ৳{formatMoney(
                    financeData.Savings.total
                  )}
                </h2>

                <p>
                  Saved this month
                </p>


                <div className="target-info">

                  <span>Target</span>

                  <span>
                    ৳{formatMoney(
                      financeData.Savings.target
                    )}
                  </span>

                </div>


                <div className="progress-track">

                  <div
                    className="progress-fill savings-progress"
                    style={{
                      width: `${savingsProgress}%`,
                    }}
                  />

                </div>


                <div className="progress-bottom">

                  <span>Achieved</span>

                  <strong>
                    {savingsProgress}%
                  </strong>

                </div>

              </div>

            </div>

          </div>



          {/* ================= PDF ================= */}

          <div className="details-action">

            <button className="download-pdf-btn" onClick={downloadPDF}>

              <i className="bi bi-download"></i>

              Download Details PDF

            </button>

          </div>



        <Transactionlist viewDate= {viewDate} financeData={financeData} setFinanceData= {setFinanceData} loading={loading} formatMoney={formatMoney} formatDate={formatDate} />


        </div>

      </section>



      {/* ==================================================
          GOAL MODAL
      ================================================== */}

      {goalModal && (

        <div
          className="finance-modal-overlay"
          onClick={closeGoalModal}
        >

          <div
            className="finance-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="finance-modal-header">

              <div>

                <p className="modal-label">
                  FINANCIAL TARGET
                </p>

                <h2>
                  Set {goalModal} Goal
                </h2>

              </div>


              <button
                className="modal-close"
                onClick={closeGoalModal}
              >

                <i className="bi bi-x-lg"></i>

              </button>

            </div>


            <form
              onSubmit={handleGoalSubmit}
            >

              <div className="form-group">

                <label>
                  {goalModal === 'Expense'
                    ? 'Monthly Budget'
                    : 'Monthly Target'}
                </label>


                <div className="amount-input">

                  <span>৳</span>

                  <input
                    type="number"
                    min="0"
                    value={goalAmount}
                    onChange={(e) =>
                      setGoalAmount(e.target.value)
                    }
                    placeholder="50000"
                    required
                  />

                </div>

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={closeGoalModal}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="modal-submit-btn"
                >
                  Save Target
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      

    </>
  );
}


export default Dashboard;