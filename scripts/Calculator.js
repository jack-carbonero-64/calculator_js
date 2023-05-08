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
        this.#equalButton.addEventListener("click", (event) => this.computeResult());
    }

    /**
     * Setup the keyboard events to use the calculator
     */
    setupKeyboardEvents() {
        document.addEventListener("keydown", (event) => {
            const name = event.key.toUpperCase();

            if (name === "BACKSPACE") {
                this.removeLastCharacter();
                this.addTemporaryClass(this.#backspaceButton, "buttonHover", 100);
            } else if (name === "R" || name === "C") {
                this.reset();
                this.addTemporaryClass(this.#resetButton, "buttonHover", 100);
            } else if (name === "=" || name === "ENTER") {
                this.computeResult();
                this.addTemporaryClass(this.#equalButton, "buttonHover", 100);
            } else if (name === ".") {
                this.addDecimalCharacter(this.#decimalButton.textContent);
                this.addTemporaryClass(this.#decimalButton, "buttonHover", 100);
            } else {
                let i;
                let isFound = false;

                i = 0;

                while (!isFound && i < this.#numberButtons.length) {
                    if (name === this.#numberButtons[i].textContent) {
                        this.addNumberCharacter(name);
                        this.addTemporaryClass(this.#numberButtons[i], "buttonHover", 100);
                        isFound = true;
                    }

                    i++;
                }

                i = 0;

                while (!isFound && i < this.#operatorButtons.length) {
                    if (name === this.#operatorButtons[i].textContent) {
                        this.addOperatorCharacter(name);
                        this.addTemporaryClass(this.#operatorButtons[i], "buttonHover", 100);
                        isFound = true;
                    }

                    i++;
                }
            }
        });
    }

    /**
     * Add a number on the screen
     *
     * @param {string} numberChar Number to add on the screen
     */
    addNumberCharacter(numberChar) {
        if (this.#displayScreen.classList.contains("waitingScreen")) return;

        this.#displayScreen.textContent += numberChar;
    }

    /**
     * Add an operator on the screen with space characters around
     *
     * @param {string} operatorChar Operator to add on the screen
     */
    addOperatorCharacter(operatorChar) {
        if (this.#displayScreen.classList.contains("waitingScreen")) return;

        this.#displayScreen.textContent += " " + operatorChar + " ";
    }

    /**
     * Add the decimal separator character on the screen
     *
     * @param {string} decimalChar Decimal separator character to add on the screen
     */
    addDecimalCharacter(decimalChar) {
        if (this.#displayScreen.classList.contains("waitingScreen")) return;

        this.#displayScreen.textContent += decimalChar;
    }

    /**
     * Remove the last character on the screen
     */
    removeLastCharacter() {
        if (this.#displayScreen.classList.contains("waitingScreen")) return;

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
        if (this.#displayScreen.classList.contains("waitingScreen")) return;

        this.#displayScreen.textContent = "";
    }

    /**
     * Compute the result of the expression displayed on the screen
     */
    computeResult() {
        if (this.#displayScreen.classList.contains("waitingScreen")) return;

        const expression = this.#displayScreen.textContent;

        if (expression.length === 0) return;

        // Check the validity of the expression
        const regex = /^(\d+(\.\d*)?)( [/*+-] (\d+(\.\d*)?))*$/gm;

        if (!regex.test(expression)) {
            this.printAndWait("Invalid mathematical expression", 4000);
            return;
        }

        // Split the expression and convert the number characters
        const expressionSplitted = expression.split(" ");

        for (let i = 0; i < expressionSplitted.length; i += 2) expressionSplitted[i] = Number(expressionSplitted[i]);

        // Compute the multiplication and division sub-expressions
        for (let i = 1; i < expressionSplitted.length; i += 2) {
            if (expressionSplitted[i] === "*") {
                expressionSplitted[i - 1] = this.multiplyOperator(expressionSplitted[i - 1], expressionSplitted[i + 1]);
                expressionSplitted.splice(i, 2);
                i -= 2;
            } else if (expressionSplitted[i] === "/") {
                const result = this.divideOperator(expressionSplitted[i - 1], expressionSplitted[i + 1]);

                if (result === undefined) return;

                expressionSplitted[i - 1] = result;
                expressionSplitted.splice(i, 2);
                i -= 2;
            }
        }

        // Compute the addition and subtraction sub-expressions
        for (let i = 1; i < expressionSplitted.length; i += 2) {
            if (expressionSplitted[i] === "-") {
                expressionSplitted[i - 1] = this.subtractOperator(expressionSplitted[i - 1], expressionSplitted[i + 1]);
                expressionSplitted.splice(i, 2);
                i -= 2;
            } else if (expressionSplitted[i] === "+") {
                expressionSplitted[i - 1] = this.addOperator(expressionSplitted[i - 1], expressionSplitted[i + 1]);
                expressionSplitted.splice(i, 2);
                i -= 2;
            }
        }

        this.#displayScreen.textContent = expressionSplitted[0];
    }

    /**
     * Compute the result of the addition between 2 numbers
     *
     * @param {number} a First number to use for the addition
     * @param {number} b Second number to use for the addition
     * @returns Result of the addition
     */
    addOperator(a, b) {
        return a + b;
    }

    /**
     * Compute the result of the subtraction between 2 numbers
     *
     * @param {number} a Number to take from
     * @param {number} b Number to take away
     * @returns Result of the subtraction
     */
    subtractOperator(a, b) {
        return a - b;
    }

    /**
     * Compute the result of the multiplication between 2 numbers
     *
     * @param {number} a First number to use for the multiplication
     * @param {number} b Second number to use for the multiplication
     * @returns Result of the multiplication
     */
    multiplyOperator(a, b) {
        return a * b;
    }

    /**
     * Compute the result of the division between 2 numbers
     *
     * @param {number} a Dividend of the division
     * @param {number} b Divisor of the division
     * @returns Quotient of the division
     */
    divideOperator(a, b) {
        if (b === 0) {
            this.printAndWait("Divided by 0", 4000);
            return;
        }

        return a / b;
    }

    /**
     * Print a message on the screen and wait for a given time
     *
     * @param {string} message Message to print on the screen
     * @param {number} time Number of milliseconds to wait
     */
    printAndWait(message, time) {
        const oldValue = this.#displayScreen.textContent;

        this.#displayScreen.textContent = message;
        this.#displayScreen.classList.add("waitingScreen");

        setTimeout(() => {
            this.#displayScreen.textContent = oldValue;
            this.#displayScreen.classList.remove("waitingScreen");
        }, time);
    }

    /**
     * Add a temporary class to a element for a given time
     *
     * @param {Node} element Element to add the class
     * @param {string} className Class to add
     * @param {number} time Time in milliseconds during which the element has the specified class
     */
    addTemporaryClass(element, className, time) {
        element.classList.add(className);

        setTimeout(() => {
            element.classList.remove(className);
        }, time);
    }
}
