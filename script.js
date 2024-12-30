// Basic math functions
function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    return b === 0 ? 'Error' : a / b;
}
function modulo(a, b) {
    return b === 0 ? 'Error' : a % b;
}

// Variables to track the calculator state
let firstOperand = '';
let secondOperand = '';
let currentOperator = '';
let resetDisplay = false;
let decimalUsed = false;

// Reference to the display element
const display = document.getElementById('display');

// Performs the math operation based on the operator
function operate(operator, a, b) {
    const num1 = parseFloat(a);
    const num2 = parseFloat(b);

    switch (operator) {
        case '+': return add(num1, num2);
        case '-': return subtract(num1, num2);
        case 'x': return multiply(num1, num2);
        case '÷': return divide(num1, num2);
        case '%': return modulo(num1, num2);
        default: return null;
    }
}

// Updates the display with a value
function updateDisplay(value) {
    if (value.toString().length > 12) {
        value = value.toString().includes('.') ? parseFloat(value).toFixed(8) : 'Error';
    }
    display.textContent = value;
}

// Handles number button clicks
function handleNumberInput(number) {
    if (display.textContent === 'Error' || resetDisplay) {
        display.textContent = '0';
        resetDisplay = false;
    }

    // Prevents overflow of display
    if (display.textContent.length >= 12) return;

    // Add new numbers or overwrite "0"
    if (display.textContent === '0') {
        updateDisplay(number);
    } else {
        updateDisplay(display.textContent + number);
    }

    // Save the number to the correct operand
    if (currentOperator) {
        secondOperand = display.textContent;
    } else {
        firstOperand = display.textContent;
    }
}

// Handles operator button clicks
function handleOperatorInput(operator) {
    if (firstOperand && currentOperator && secondOperand) {
        calculate();
    }
    currentOperator = operator;
    resetDisplay = true;
    decimalUsed = false;
}

// Handles decimal input
function handleDecimalInput() {
    if (resetDisplay) {
        display.textContent = '0';
        resetDisplay = false;
    }

    if (!decimalUsed) {
        updateDisplay(display.textContent + '.');
        decimalUsed = true;
    }

    // Update the correct operand
    if (currentOperator) {
        secondOperand = display.textContent;
    } else {
        firstOperand = display.textContent;
    }
}

// Calculates the result
function calculate() {
    if (firstOperand && currentOperator && secondOperand) {
        const result = operate(currentOperator, firstOperand, secondOperand);
        updateDisplay(result === 'Error' ? 'Error' : result);
        firstOperand = result.toString();
        secondOperand = '';
        currentOperator = '';
        resetDisplay = true;
    }
}

// Clears the calculator
function clearCalculator() {
    firstOperand = '';
    secondOperand = '';
    currentOperator = '';
    decimalUsed = false;
    resetDisplay = false;
    updateDisplay('0');
}

// Deletes the last character
function backspace() {
    if (display.textContent === 'Error') {
        clearCalculator();
        return;
    }

    const newDisplay = display.textContent.slice(0, -1) || '0';
    updateDisplay(newDisplay);
    decimalUsed = newDisplay.includes('.');
}

// Add event listeners for buttons
document.querySelectorAll('.box').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (button.classList.contains('number')) {
            handleNumberInput(value);
        } else if (value === '.') {
            handleDecimalInput();
        } else if (button.id === 'clear') {
            clearCalculator();
        } else if (button.id === 'backspace') {
            backspace();
        } else if (button.id === 'equal') {
            calculate();
        } else if (button.classList.contains('operator')) {
            handleOperatorInput(value);
        }
    });
});

// Add keyboard event listeners
document.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (e.key >= '0' && e.key <= '9') {
        handleNumberInput(e.key);
    } else if (e.key === '.') {
        handleDecimalInput();
    } else if (e.key === 'Escape') {
        clearCalculator();
    } else if (e.key === 'Backspace') {
        backspace();
    } else if (e.key === 'Enter') {
        calculate();
    } else if (['+', '-'].includes(e.key)) {
        handleOperatorInput(e.key);
    } else if (e.key === '*') {
        handleOperatorInput('x');
    } else if (e.key === '/') {
        handleOperatorInput('÷');
    } else if (e.key === '%') {
        handleOperatorInput('%');
    }
});
