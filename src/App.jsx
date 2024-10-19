import { useState } from "react";
import styles from './components/Calculator.module.css'
import Calculator from "./components/Calculator";

function App() {

  return (
    <div className={styles.mainContainer}>
      <Calculator />
    </div>
  )
}

export default App;
