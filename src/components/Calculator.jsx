import { useState } from "react";
import styles from "./Calculator.module.css";
import { InputNumberFormat } from "@react-input/number-format";
import { useForm } from "react-hook-form";

import iconCalc from '../assets/icon-calculator.svg';
import illustration from '../assets/illustration-empty.svg';

function Calculator() {
  const [result, setResult] = useState();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const options = {
    style: "currency",
    currency: "USD",
  };

  const watchMortgageType = watch("mortgageType");

  function removeCommas(inputNumberStr) {
    return inputNumberStr.split(",").join("");
  }

  const onSubmit = (data) => {
    let mortgageAmount = parseFloat(removeCommas(data.mortgageAmount));
    let interestRate = parseFloat(data.interestRate);

    let numMonths = 12 * data.mortgageTerm;
    if (data.mortgageType === "interestOnly") {
      interestOnly(numMonths, mortgageAmount, interestRate);
    } else {
      repaymentLoan(numMonths, mortgageAmount, interestRate);
    }
  };

  function interestOnly(numberOfMonths, mortgageAmount, interestRate) {
    let tempResult = mortgageAmount * ((interestRate * 0.01) / numberOfMonths); //interest only loan
    let total = (tempResult * numberOfMonths).toFixed(2);
    setResult({
      totalPayments: new Intl.NumberFormat("en-US", options).format(total),
      monthlyRepayments: new Intl.NumberFormat("en-US", options).format(tempResult)
    });
  }

  function repaymentLoan(numberOfMonths, mortgageAmount, interestRate) {
    const interestRateDecimal = interestRate / 100;
    let periodicInterest = interestRateDecimal / 12;
    let partA = (1 + periodicInterest) ** numberOfMonths - 1;
    let partB = periodicInterest * (1 + periodicInterest) ** numberOfMonths;
    let stepOne = partA / partB;
    let stepTwo = mortgageAmount / stepOne;
    setResult({
      totalPayments: new Intl.NumberFormat("en-US", options).format(stepTwo * numberOfMonths),
      monthlyRepayments: new Intl.NumberFormat("en-US", options).format(stepTwo)
    });
  }

  return (
    <div className={styles.outerContainer}>
      <div className={styles.calculatorContainer}>
        <div className={styles.calculatorFormSection}>

          
          

          <form className={styles.calcForm} onSubmit={handleSubmit(onSubmit)}>

            <div className={styles.calculatorTopArea}><span className={styles.heading}>Mortgage Calculator</span>
            <span className={styles.clearButton} onClick={() => { reset(); setResult(null) }}>
            Clear all
          </span></div>
            <label>
              <p className={styles.formLabels}>Mortgage Amount</p>
              <div className={styles.inputContainer}>
                <span className={errors.mortgageAmount ? styles.errorLabelLeft : styles.leftSideLabel}
                >$</span>
                <InputNumberFormat
                  {...register("mortgageAmount", {
                    required: "This field is required",
                  })}
                  format={"decimal"}
                  maximumFractionDigits={2}
                  maximumIntegerDigits={8}
                  className={errors.mortgageAmount ? styles.errorMessageInputRight:styles.rightSideInput}
                />
                
                </div>
              {errors.mortgageAmount ?
                <p className={styles.errorMessage}>
                  {errors.mortgageAmount.message}
                </p>
                : <p></p>
              }
            </label>

            <div className={styles.mortgageTermAndInterestRate}>
            <label>
             
                <p className={styles.formLabels}>Mortgage Term</p>
                
            <div className={styles.inputContainer}>
              
                <InputNumberFormat
                  {...register("mortgageTerm", {
                    required: "This field is required",
                  })}
                  format={"decimal"}
                  maximumIntegerDigits={2}
                  maximumFractionDigits={1}
                  className={errors.mortgageTerm ? styles.errorMessageInputLeft : styles.leftSideInput}
                />
                <span className={errors.mortgageTerm ? styles.errorLabelRight : styles.rightSideLabel}>years</span></div>
              {errors.mortgageTerm ?
                <p className={styles.errorMessage}>
                  {errors.mortgageTerm.message}
                  </p>
                  : <p></p>
              }
              </label>
            
            <label>
              <p className={styles.formLabels}>Interest Rate</p>
              
                <div className={styles.inputContainer}>
                <InputNumberFormat
                  {...register("interestRate", {
                    required: "This field is required",
                  })}
                  format={"decimal"}
                  maximumIntegerDigits={2}
                    maximumFractionDigits={2}
                    minimumFractionDigits={2}
                  className={errors.interestRate ? styles.errorMessageInputLeft : styles.leftSideInput}
                />
                <span className={errors.interestRate ? styles.errorLabelRight : styles.rightSideLabel}>%</span>
              </div>
              
              {errors.interestRate ?
                <p className={styles.errorMessage}>
                  {errors.interestRate.message}
                  </p>
                  :
                  <p></p>              
              }
            </label>
            </div>
            
            <div className={styles.mortgageTypes}>
              <label> <p className={styles.formLabels}>Mortgage Type</p>
                <label className={styles.radioContainer} htmlFor="repayment">
              <input
                {...register("mortgageType", {
                  required: "This field is required",
                })}
                type="radio"
                value="repayment"
                id="repayment"
                  />
                  <span className={styles.checkmark}></span>
                  Repayment
                </label>
              
                <label className={styles.radioContainer} htmlFor="interestOnly">
              <input
                {...register("mortgageType", {
                  required: "This field is required",
                })}
                type="radio"
                value="interestOnly"
                  id="interestOnly"
                  style={{fontWeight: watchMortgageType && ''}}
                  />
                  <span className={styles.checkmark}></span>
                  Interest Only
                </label>
              {errors.mortgageType ?
                <p className={styles.errorMessage}>
                  {errors.mortgageType.message}
                </p>
                :
                <p></p>
                }
                </label>
            </div>
            <span className={styles.submitButtonContainer}>
              
              <button className={styles.submitButton} type="submit"><img className={styles.calculatorButtonIcon} src={iconCalc} alt="icon of a calculator" /><span className={styles.calcButtonText}>Calculate Repayments</span></button> 
            </span>
            
          </form>
        </div>
        <div className={styles.calculatorResultSection}>
          
          {!result ?
            (<div className={styles.resultSectionInner}>
              <img className={styles.calcIllustration} src={illustration} alt="illustration of a calculator" />
              <div className={styles.resultsText}>
                <h2>Results shown here</h2>
                <p>Complete the form and click "calculate repayments" to see what your monthly repayments would be.</p>
              </div>
            </div>
            )
            :(
            <div className={styles.resultSectionInner}>
              <h1>Your Results</h1>
              <p className={styles.resultsTextCompleted}>Your results are shown below based on the information you provided.
                To adjust the results, edit the form and click "calculate repayments" again.</p>
                <div className={styles.resultBox}>
                  
                    <h3>Your monthly repayments</h3>
                    <span className={styles.monthlyRepaymentText}>{result.monthlyRepayments}</span>
                    <hr />
                    <h3>Total you'll repay over the term</h3>
                  <h2>{result.totalPayments}</h2>
                  
                  
                </div>
                
          
            </div>)
          }
          
        </div>
        
      </div>
    </div>
  );
}
export default Calculator;
