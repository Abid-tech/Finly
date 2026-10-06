import React, { useEffect, useState } from 'react';

import {LineChart,Line,XAxis,YAxis, CartesianGrid, Tooltip,Legend,ResponsiveContainer} from 'recharts';

import API_BASE from '../../lib/api_base';


function FinanceChart({ refreshKey }) {

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchChartData = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        `${API_BASE}/finance/report`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );


      if (!response.ok) {
        throw new Error(
          'Failed to fetch chart data.'
        );
      }


      const data = await response.json();

      const records = data.financeRecords || [];


      const formattedData = records
        .sort((a, b) =>
          a.monthKey.localeCompare(
            b.monthKey
          )
        )
        .map(record => {

          const [year, month] =
            record.monthKey.split('-');

          const date = new Date(
            Number(year),
            Number(month) - 1
          );


          return {

            month: date.toLocaleDateString(
              'en-US',
              {
                month: 'short',
                year: 'numeric',
              }
            ),

            Earnings:
              Number(
                record.Income?.total || 0
              ),

            Expenses:
              Number(
                record.Expense?.total || 0
              ),

            Savings:
              Number(
                record.Savings?.total || 0
              ),
          };

        });

      setChartData(formattedData);


    } catch (error) {

      console.error(
        'Chart data error:',
        error
      );

    } finally {
      setLoading(false);
    }

  };


  useEffect(() => {
    fetchChartData();
  }, [refreshKey]);



  const getTrend = (current, previous) => {

    if (
      previous === undefined ||
      previous === null
    ) {
      return {
        direction: '→',
        text: 'No previous data',
        className: 'neutral',
      };
    }

    if (current === previous) {

      return {
        direction: '→',
        text: 'No change',
        className: 'neutral',
      };
    }

    if (previous === 0) {

      return {
        direction: current > 0 ? '↑' : '→',
        text: current > 0
          ? 'Increasing'
          : 'No change',
        percentage: null,
        className:
          current > 0
            ? 'increasing'
            : 'neutral',
      };
    }


    const percentage =
      ((current - previous) /
        previous) *
      100;


    if (current > previous) {

      return {
        direction: '↑',
        text: 'Increasing',
        percentage:
          Math.abs(percentage).toFixed(1),
        className: 'increasing',
      };
    }


    return {
      direction: '↓',
      text: 'Decreasing',
      percentage:
        Math.abs(percentage).toFixed(1),
      className: 'decreasing',
    };
  };


  const latest = chartData.length > 0
      ? chartData[chartData.length - 1]
      : null;

  const previous = chartData.length > 1
      ? chartData[chartData.length - 2]
      : null;


  const earningsTrend = latest
    ? getTrend(
        latest.Earnings,
        previous?.Earnings
      )
    : null;


  const expensesTrend = latest
    ? getTrend(
        latest.Expenses,
        previous?.Expenses
      )
    : null;


  const savingsTrend = latest
    ? getTrend(
        latest.Savings,
        previous?.Savings
      )
    : null;



  if (loading) {

    return (
      <div className="finance-chart-card">

        <div className="finance-chart-header">

          <div>
            <p className="chart-label"> FINANCIAL TREND </p>
            <h2> Monthly Overview </h2>
          </div>

        </div>


        <div className="chart-empty">
          Loading chart...
        </div>

      </div>
    );

  }



  if (chartData.length === 0) {

    return (
      <div className="finance-chart-card" id='chart-section'>

        <div className="finance-chart-header">

          <div>
            <p className="chart-label">FINANCIAL TREND</p>
            <h2>Monthly Overview</h2>
          </div>

        </div>

        <div className="chart-empty">
          No financial data available yet.
        </div>

      </div>
    );

  }


  return (

    <div className="finance-chart-card" id='chart-section'>


      {/* HEADER */}

      <div className="finance-chart-header">

        <div>

          <p className="chart-label"> FINANCIAL TREND  </p>

          <h2>Monthly Overview</h2>

          <p>
            Track your earnings, expenses
            and savings over time.
          </p>

        </div>

      </div>


      {/* TREND SUMMARY */}

      <div className="finance-trend-summary">


        {/* EARNINGS */}

        <div className="trend-item">

          <div className="trend-item-top">

            <span className="trend-name">
              Earnings
            </span>

            <span
              className={`trend-indicator ${earningsTrend.className}`}
            >
              {earningsTrend.direction}
              {' '}
              {earningsTrend.text}
            </span>

          </div>


          <strong>
            ৳{Number(
              latest.Earnings
            ).toLocaleString()}
          </strong>


          {earningsTrend.percentage !== null &&
            earningsTrend.percentage !== undefined && (

              <span className="trend-percentage">

                {earningsTrend.direction === '↑'
                  ? '+'
                  : '-'}
                {earningsTrend.percentage}%
                {' '}from previous month

              </span>

            )}

        </div>


        {/* EXPENSES */}

        <div className="trend-item">

          <div className="trend-item-top">

            <span className="trend-name">
              Expenses
            </span>

            <span
              className={`trend-indicator ${expensesTrend.className}`}
            >
              {expensesTrend.direction}
              {' '}
              {expensesTrend.text}
            </span>

          </div>


          <strong>
            ৳{Number(
              latest.Expenses
            ).toLocaleString()}
          </strong>


          {expensesTrend.percentage !== null &&
            expensesTrend.percentage !== undefined && (

              <span className="trend-percentage">

                {expensesTrend.direction === '↑'
                  ? '+'
                  : '-'}
                {expensesTrend.percentage}%
                {' '}from previous month

              </span>

            )}

        </div>


        {/* SAVINGS */}

        <div className="trend-item">

          <div className="trend-item-top">

            <span className="trend-name">
              Savings
            </span>

            <span
              className={`trend-indicator ${savingsTrend.className}`}
            >
              {savingsTrend.direction}
              {' '}
              {savingsTrend.text}
            </span>

          </div>


          <strong>
            ৳{Number(
              latest.Savings
            ).toLocaleString()}
          </strong>


          {savingsTrend.percentage !== null &&
            savingsTrend.percentage !== undefined && (

              <span className="trend-percentage">

                {savingsTrend.direction === '↑'
                  ? '+'
                  : '-'}
                {savingsTrend.percentage}%
                {' '}from previous month

              </span>

            )}

        </div>


      </div>


      {/* CHART */}

      <div className="finance-chart">

        <ResponsiveContainer
          width="100%"
          height={400}
        >

          <LineChart
            data={chartData}
            margin={{ top: 20, right: 20,left: 10, bottom: 10,}}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />


            <XAxis
              dataKey="month"
              tick={{
                fontSize: 12,
              }}
            />


            <YAxis
              tick={{
                fontSize: 12,
              }}
              tickFormatter={value =>
                `৳${Number(
                  value
                ).toLocaleString()}`
              }
            />


            <Tooltip
              formatter={value =>
                `৳${Number(
                  value
                ).toLocaleString()}`
              }
            />


            <Legend />


            <Line
              type="monotone"
              dataKey="Earnings"
              stroke="#198754"
              strokeWidth={3}
              dot={{
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />


            <Line
              type="monotone"
              dataKey="Expenses"
              stroke="#dc3545"
              strokeWidth={3}
              dot={{
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />


            <Line
              type="monotone"
              dataKey="Savings"
              stroke="#0d6efd"
              strokeWidth={3}
              dot={{
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}


export default FinanceChart;