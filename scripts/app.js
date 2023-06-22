import { Calculator } from "./Calculator.js";

// Retrieve calculator elements
const displayScreen = document.querySelector("#displayScreen");

const decimalButton = document.querySelector("#decimalButton");
const equalButton = document.querySelector("#equalButton");
const backspaceButton = document.querySelector("#backspaceButton");
const resetButton = document.querySelector("#resetButton");

const numberButtons = document.querySelectorAll(".numberButtons");
const operatorButtons = document.querySelectorAll(".operatorButtons");

// Calculator setup
const calculator = new Calculator(
    displayScreen,
    decimalButton,
    equalButton,
    backspaceButton,
    resetButton,
    numberButtons,
    operatorButtons
);
