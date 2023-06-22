/**
 * Class to represent a calculator
 */
export class Calculator {
    #displayScreen;
    #backspaceButton;
    #equalButton;
    #decimalButton;
    #resetButton;
    #numberButtons;
    #operatorButtons;

    /**
     * Create a calculator object
     *
     * @param {Node} displayScreen Screen on which to display the characters
     * @param {Node} decimalButton Button to add a decimal separator character
     * @param {Node} equalButton Button to compute the result
     * @param {Node} backspaceButton Button to remove the last character
     * @param {Node} resetButton Button to reset the display screen
     * @param {NodeList} numberButtons Buttons to add a specific number
     * @param {NodeList} operatorButtons Buttons to add a specific operator
     */
    constructor(
        displayScreen,
        decimalButton,
        equalButton,
        backspaceButton,
        resetButton,
        numberButtons,
        operatorButtons
    ) {
        this.#displayScreen = displayScreen;
        this.#decimalButton = decimalButton;
        this.#equalButton = equalButton;
        this.#backspaceButton = backspaceButton;
        this.#resetButton = resetButton;
        this.#numberButtons = numberButtons;
        this.#operatorButtons = operatorButtons;
    }

    /**
     * Setup the mouse events to use the calculator
     */
    setupMouseEvents() {
        this.#numberButtons.forEach((element) => {
            element.addEventListener("click", (event) => this.addNumberCharacter(event.currentTarget.textContent));
        });

        this.#operatorButtons.forEach((element) => {
            element.addEventListener("click", (event) => this.addOperatorCharacter(event.currentTarget.textContent));
        });

        this.#decimalButton.addEventListener("click", (event) =>
            this.addDecimalCharacter(event.currentTarget.textContent)
        );

        this.#backspaceButton.addEventListener("click", (event) => this.removeLastCharacter());
        this.#resetButton.addEventListener("click", (event) => this.reset());
    }

    /**
     * Add a number on the screen
     *
     * @param {string} numberChar Number to add on the screen
     */
    addNumberCharacter(numberChar) {
        this.#displayScreen.textContent += numberChar;
    }

    /**
     * Add an operator on the screen with space characters around
     *
     * @param {string} operatorChar Operator to add on the screen
     */
    addOperatorCharacter(operatorChar) {
        this.#displayScreen.textContent += " " + operatorChar + " ";
    }

    /**
     * Add the decimal separator character on the screen
     *
     * @param {string} decimalChar Decimal separator character to add on the screen
     */
    addDecimalCharacter(decimalChar) {
        this.#displayScreen.textContent += decimalChar;
    }

    /**
     * Remove the last character on the screen
     */
    removeLastCharacter() {
        let expression = this.#displayScreen.textContent;

        if (expression.length === 0) return;

        if (
            expression[expression.length - 2] === "/" ||
            expression[expression.length - 2] === "*" ||
            expression[expression.length - 2] === "-" ||
            expression[expression.length - 2] === "+"
        ) {
            expression = expression.substring(0, expression.length - 3);
        } else {
            expression = expression.substring(0, expression.length - 1);
        }

        this.#displayScreen.textContent = expression;
    }

    /**
     * Reset the calculator
     */
    reset() {
        this.#displayScreen.textContent = "";
    }
}
