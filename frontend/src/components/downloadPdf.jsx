import React from 'react'
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import API_BASE from '../../lib/api_base';

function DownloadPdf({formatMoney,formatDate}) {

  const downloadPDF = async () => {

    try {
        const response = await fetch(
        `${API_BASE}/finance/report`,
        {
            method: 'GET',
            credentials: 'include',
        }
        );


        if (!response.ok) {

        throw new Error( 'Failed to fetch finance report.' );
 }

        const data = await response.json();
        const financeRecords = data.financeRecords || [];

        if (financeRecords.length === 0) {

        alert(
            'There is no financial data available for the report.'
        );

        return;
        }

        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setFont('times', 'bold');
        doc.text('Financial Report',14,20);

        doc.setFontSize(10);
        doc.setFont('times', 'normal');
        doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`,14, 28 );


        let firstMonth = true;

        // MONTH LOOP

        financeRecords.forEach( (finance, index) => {

            // NEW PAGE FOR EACH MONTH

            if (!firstMonth) {  doc.addPage();}

            firstMonth = false;

            // MONTH NAME

            const [ year, month ] = finance.monthKey
            .split('-')
            .map(Number);

            const monthName =
            new Date(year, month - 1, 1
            ).toLocaleDateString(
                'en-US',
                {
                month: 'long',
                year: 'numeric',
                }
            );
            doc.setFontSize(16);
            doc.setFont(   'times','bold' );
            doc.text( monthName,14,  42 );

            let currentY = 50;


            // TRANSACTIONS

            const transactions = finance.transactions || [];


            // EARNINGS

            const earnings =
            transactions.filter(
                transaction =>
                transaction.type === 'Earning'
            );


            doc.setFontSize(13);
            doc.setFont( 'times','bold');
            doc.text( 'Earnings', 14, currentY);

            currentY += 5;


            if (earnings.length > 0) {

            autoTable(doc, {

                startY: currentY,
                head: [['Date','Description','Category','Payment Method','Amount']],

                body: earnings.map(
                transaction => [
                    formatDate( transaction.date  ),
                    transaction.description || '-',
                    transaction.category || '-',
                    transaction.paymentMethod  || '-',
                    `Tk. ${formatMoney(  transaction.amount  )}`,
                ]
                ),

                theme: 'grid',
                styles: {fontSize: 9,},
                headStyles: {fontStyle: 'bold',},

                columnStyles: {
                0: {cellWidth: 25,},
                1: {cellWidth: 45, },
                2: {cellWidth: 35,},
                3: {cellWidth: 35,},
                4: {cellWidth: 30,halign: 'right',},
                }, });

            currentY = doc.lastAutoTable.finalY + 12;

            } else {

            doc.setFontSize(10);
            doc.setFont('times','normal');
            doc.text('No earnings recorded.',14, currentY + 7);
            currentY += 18;

            }

            // EXPENSES
            doc.setFontSize(13);
            doc.setFont('times', 'bold');
            doc.text( 'Expenses', 14,currentY );

            currentY += 5;

            const expenses =
            transactions.filter(
                transaction =>
                transaction.type === 'Expense'
            );

            if (expenses.length > 0) {

            autoTable(doc, {

                startY: currentY,

                head: [['Date','Description','Category','Payment Method','Amount']],

                body: expenses.map(
                transaction => [
                    formatDate(transaction.date ),
                    transaction.description || '-',
                    transaction.category || '-',
                    transaction.paymentMethod|| '-',
                    `Tk. ${formatMoney(transaction.amount)}`,
                ]
                ),

                theme: 'grid',
                styles: {fontSize: 9,},
                headStyles: {fontStyle: 'bold', },

                columnStyles: {
                0: {cellWidth: 25,},
                1: {cellWidth: 45,},
                2: {cellWidth: 35,},
                3: {cellWidth: 35,},
                4: {cellWidth: 30,halign: 'right',},
                },

            });

            currentY = doc.lastAutoTable.finalY + 12;
            } else {

            doc.setFontSize(10);
            doc.setFont('times','normal');
            doc.text('No expenses recorded.',14,currentY + 7);
            currentY += 18;
            }

            // SAVINGS
            doc.setFontSize(13);
            doc.setFont('times','bold');
            doc.text( 'Savings', 14,currentY);

            currentY += 5;

            const savings =
            transactions.filter(
                transaction =>
                transaction.type === 'Saving'
            );


            if (savings.length > 0) {

            autoTable(doc, {

                startY: currentY,

                head: [['Date','Description','Category','Payment Method','Amount']],

                body: savings.map(
                transaction => [
                    formatDate(transaction.date),
                    transaction.description|| '-',
                    transaction.category|| '-',
                    transaction.paymentMethod|| '-',
                    `Tk. ${formatMoney( transaction.amount)}`,

                ]
                ),

                theme: 'grid',
                styles: {fontSize: 9,},
                headStyles: {fontStyle: 'bold',},

                columnStyles: {

                0: {cellWidth: 25,},
                1: {cellWidth: 45,},
                2: {cellWidth: 35,},
                3: {cellWidth: 35,},
                4: {cellWidth: 30,halign: 'right'},

                },

            });

            currentY =doc.lastAutoTable.finalY + 15; 
        } else {
            doc.setFontSize(10);
            doc.setFont('times','normal' );
            doc.text('No savings recorded.',14, currentY + 7 );
            currentY += 25;
            }

            // MONTHLY TOTALS

            doc.setFontSize(13);
            doc.setFont('times', 'bold');
            doc.text( 'Monthly Summary', 14,currentY);

            currentY += 6;

            autoTable(doc, {

            startY: currentY,

            body: [
                ['Total Earnings', `Tk. ${formatMoney(finance.Income?.total)}`,],
                ['Total Expenses',`Tk. ${formatMoney(finance.Expense?.total)}`,],
                ['Total Savings',`Tk. ${formatMoney(finance.Savings?.total )}`,],
            ],

            theme: 'grid',
            styles: { fontSize: 10, },
            columnStyles: {
                0: {fontStyle: 'bold',cellWidth: 60,},
                1: {halign: 'right', cellWidth: 45, },
            },
            });
        }
        );
        doc.save('financial-report.pdf');


    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Failed to generate the PDF.');

    }

};
  return (
    <div className="details-action">

            <button className="download-pdf-btn" onClick={downloadPDF}>
              <i className="bi bi-download"></i>
              Download Details PDF
            </button>
     </div>
  )
}

export default DownloadPdf