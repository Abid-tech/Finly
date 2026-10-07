## Finance Management System

A full-stack **personal finance management application** built with **React, Node.js, Express.js, and MongoDB**. The application allows users to manage their monthly finances, track earnings, expenses, and savings, set financial goals, manage transactions, visualize financial trends, and generate PDF reports.

---

##  Features

### Authentication & Authorization

* User registration and login
* Secure authentication using **JSON Web Tokens (JWT)**
* JWT stored in **HTTP-only cookies**
* Protected backend routes using authentication middleware
* Persistent login session
* Secure logout functionality
* User-specific financial data
* Unauthorized users cannot access protected financial resources

---

### Financial Dashboard

* Personalized financial dashboard
* Monthly financial overview
* Displays:

  * Earnings
  * Expenses
  * Savings
* Shows total amount for each category
* Displays monthly financial targets
* Visual progress bars for targets
* Automatically updates financial information when transactions are modified

---

### Monthly Finance Management

* View financial information by month
* Navigate between previous months
* Prevents navigating beyond the current month
* Automatically loads the selected month's financial data
* Separate financial records maintained for each month

---

###  Financial Goals

Users can set and update monthly targets for:

* Earnings
* Expenses / Budget
* Savings

The dashboard displays the progress toward each target using visual progress bars.

---

### Transaction Management

Users can add and manage financial transactions.

Each transaction contains:

* Transaction type

  * Expense
  * Saving
  * Earning
* Description
* Category
* Amount
* Date
* Payment method
* Additional notes

Supported payment methods include:

* Cash
* Card
* Mobile Banking
* Bank Transfer
* Other

#### Transaction Editing

* Edit existing transactions
* Change transaction type
* Update transaction amount
* Change transaction date
* Change category and description
* Change payment method
* Add or update notes
* Transactions can be moved between different months
* Financial totals are automatically recalculated after modifications

---

### Financial Charts & Trends

* Monthly financial trend visualization
* Interactive line chart for:

  * Earnings
  * Expenses
  * Savings
* Displays financial data across multiple months
* Automatic chart refresh after adding or editing transactions
* Monthly comparison with the previous available month
* Trend indicators:

  * ↑ Increasing
  * ↓ Decreasing
  * → No change
* Percentage change from the previous month

---

### PDF Financial Reports

* Generate downloadable PDF financial reports
* Includes financial information from multiple months
* Displays:

  * Monthly earnings
  * Monthly expenses
  * Monthly savings
  * Transaction information
* Uses `jsPDF` and `jspdf-autotable` for PDF generation

---

### Responsive UI

* Clean and modern dashboard design
* Responsive layout
* Desktop and mobile friendly
* Bootstrap grid system
* Responsive financial cards
* Responsive transaction table
* Mobile-friendly modals and controls

---

## Technologies Used

### Frontend

* **React.js**
* **JavaScript**
* **HTML5**
* **CSS3**
* **Bootstrap**
* **Bootstrap Icons**
* **Recharts**

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**

### Authentication

* **JSON Web Token (JWT)**
* **HTTP-only Cookies**
* **bcryptjs**

### PDF Generation

* **jsPDF**
* **jspdf-autotable**

---


## Main Project Structure

```text
project/
│
├── client/
│   └── src/
│       ├── components/
│       │   ├── navbar/
│       │   ├── monthSelector/
│       │   ├── transaction_list/
│       │   ├── downloadPdf/
│       │   ├── FinanceCharts/
│       │   └── BackToTopButton/
│       │
│       ├── pages/
│       │   ├── home/
│       │   ├── login/
│       │   ├── registration/
│       │   └── dashboard/
│       │
│       ├── providers/
│       │   └── authContext.provider.jsx
│       │
│       └── ...
│
├── server/
│   ├── controller/
│   │   ├── authController.js
│   │   └── financeController.js
│   │
│   ├── model/
│   │   ├── user.js
│   │   └── financeManagement.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   └── finance.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   └── ...
│
└── README.md
```

## Key Highlights

* Full-stack MERN application
* JWT authentication with HTTP-only cookies
* Protected API routes
* User-specific financial data
* Monthly finance management
* Transaction CRUD functionality
* Financial target tracking
* Interactive financial charts
* Monthly trend analysis
* Automatic chart updates
* PDF report generation
* Responsive UI
* MongoDB database integration
* RESTful API architecture

---

##  Future Improvements

Some possible future improvements include:

* Expense category analytics
* Pie charts for expense distribution
* Yearly financial summaries
* Custom date-range reports
* Budget notifications
* Recurring transactions
* Export to Excel/CSV
* Dark mode
* Email notifications
* Advanced financial analytics

---

## Author

**Md. Abid Ali**

GitHub: https://github.com/Abid-tech
