import React from "react";
import "./home.css";
import Login from "../../components/login/login";
import Register from "../../components/register/register";
import { useState } from "react";
import Navbar from "../../components/navbar"

function Home() {

  const [isLogin, setIsLogin] = useState(true);   
  return (
    <>
      <section className="home_page">

        {/* Navbar part start */}
        
        <Navbar/>

        {/* Hero part start */}
        <div className="hero_background">
          <div className="container">

            <div className="row">
              <div className="col-lg-12 hero-section">

                <div className="row align-items-center">

                  {/* Hero left section */}
                  <div className="col-lg-6 hero-left">

                    <div className="hero-content">

                      <p className="small-title">
                        PERSONAL FINANCE
                      </p>

                      <h1>
                        Take control of
                        <br />
                        your finances.
                      </h1>

                      <p className="hero-description">
                        Track your income, expenses and savings in one
                        simple place.
                      </p>

                      <p className="hero-note">
                        Free to use · No credit card required
                      </p>

                    </div>


                    {/* SAVING CARD */}
                    <div className="saving-card">

                      <div className="saving-card-top">
                        <span>This month</span>
                        <span>›</span>
                      </div>

                      <h4>৳17,500 saved</h4>

                      <div className="saving-progress">
                        <div></div>
                      </div>

                    </div>

                    <div className="saving-card saving-card-2">

                      <div className="saving-card-top">
                        <span>This month</span>
                        <span>›</span>
                      </div>

                      <h4>৳30,874 spent</h4>

                      <div className="saving-progress">
                        <div></div>
                      </div>

                    </div>



                  </div>


                  {/* Login/register component */}
                  <div className="col-lg-6 hero-right">

                    {isLogin ? <Login setIsLogin={setIsLogin} /> : <Register setIsLogin={setIsLogin}/>}

                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>


        {/* How it works part start */}
        <section className="how-it-works" id="howWorks">

          <div className="container">

            <div className="section-heading">

              <p className="section-label">
                HOW IT WORKS
              </p>

              <h2>
                Three steps to financial clarity.
              </h2>

            </div>


            <div className="row steps-row">

              {/* Step 1 */}
              <div className="col-lg-4 col-md-4">

                <div className="step-card">

                  <span className="step-number">
                    01
                  </span>

                  <div className="step-icon income-icon">
                    <i className="bi bi-wallet"></i>
                  </div>

                  <h3>
                    Add Your Income
                  </h3>

                  <p>
                    Record your earnings and organize
                    them by month.
                  </p>

                </div>

              </div>


              {/* Step 2 */}
              <div className="col-lg-4 col-md-4">

                <div className="step-card">

                  <span className="step-number">
                    02
                  </span>

                  <div className="step-icon expense-icon">
                    <i className="bi bi-receipt"></i>
                  </div>

                  <h3>
                    Track Your Expenses
                  </h3>

                  <p>
                    Keep a clear record of where
                    your money goes.
                  </p>

                </div>

              </div>


              {/* Step 3 */}
              <div className="col-lg-4 col-md-4">

                <div className="step-card">

                  <span className="step-number">
                    03
                  </span>

                  <div className="step-icon saving-icon">
                    <i className="bi bi-bullseye"></i>
                  </div>

                  <h3>
                    Build Your Savings
                  </h3>

                  <p>
                    Create goals and track progress
                    toward each goal.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* Feature part start */}
        <section className="features-section" id="features">

          <div className="container">

            <div className="section-heading">

              <p className="section-label">
                FEATURES
              </p>

              <h2>
                Everything you need
              </h2>

            </div>


            <div className="row">

              {/* Feature 1 */}
              <div className="col-lg-6 col-md-6">

                <div className="feature-card">

                  <div className="feature-icon green">
                    <i className="bi bi-calendar3"></i>
                  </div>

                  <div>
                    <h3>
                      Monthly Financial Tracking
                    </h3>

                    <p>
                      See every month's income, spending
                      and savings.
                    </p>
                  </div>

                </div>

              </div>


              {/* Feature 2 */}
              <div className="col-lg-6 col-md-6">

                <div className="feature-card">

                  <div className="feature-icon blue">
                    <i className="bi bi-card-list"></i>
                  </div>

                  <div>
                    <h3>
                      Expense Management
                    </h3>

                    <p>
                      Log, search and filter every transaction
                      with full detail.
                    </p>
                  </div>

                </div>

              </div>


              {/* Feature 3 */}
              <div className="col-lg-6 col-md-6">

                <div className="feature-card">

                  <div className="feature-icon purple">
                    <i className="bi bi-bullseye"></i>
                  </div>

                  <div>
                    <h3>
                      Savings Goals
                    </h3>

                    <p>
                      Set targets and watch your progress
                      toward each milestone.
                    </p>
                  </div>

                </div>

              </div>


              {/* Feature 4 */}
              <div className="col-lg-6 col-md-6">

                <div className="feature-card">

                  <div className="feature-icon orange">
                    <i className="bi bi-bar-chart"></i>
                  </div>

                  <div>
                    <h3>
                      Financial Overview
                    </h3>

                    <p>
                      Understand your balance without
                      cluttered, confusing charts.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* Footer part start */}
        <footer className="footer">

          <div className="container">

            <div className="row">

              <div className="col-lg-12">

                <div className="footer-txt">

                    <h3 >
                      Finly <span>© 2026 Finly. All rights reserved.</span>
                    </h3>


                </div>

              </div>
            </div>
          </div>
        </footer>

      </section>
    </>
  );
}

export default Home;