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
}
