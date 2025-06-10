// Reference Display element
const display = document.getElementById('display');

// Track if we have performed a calculation
let justCalculated = false;

function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

function getLastChar() {
    return display.value.slice(-1);
}

function appendToDisplay(value) {
    console.log('Button pressed:', value);
    let currentValue = display.value;

    // If a calculation was just performed and user inputs a number
    if (justCalculated && !isNaN(value)) {
        display.value = value;
        justCalculated = false;
        return;
    }

    // If just calculated and user inputs non-operator (like decimal)
    if (justCalculated && !isOperator(value) && isNaN(value)) {
        display.value = value;
        justCalculated = false;
        return;
    }

    // Handles operators
    if (isOperator(value)) {
        // Don't allow operator as first char (except for minus)
        if (currentValue === '0' && value !== '-') {
            return; // Do nothing     
        }
        // If the last character is already an operator, replace it
        if (isOperator(getLastChar())) {
            display.value = currentValue.slice(0, -1) + value;
        } else {
            display.value = currentValue + value;
        }
    } else if (!isNaN(value)) {
        // Handle numbers
        if (currentValue === '0') {
            display.value = value;
        } else {
            display.value = currentValue + value;
        }
    } else if (value === '.') {
        // Handle decimal point
        if (currentValue === '0') {
            display.value = currentValue + value;
        } else {
            // Get the last number in the display (after last operator)
            let parts = currentValue.split(/[+\-*/]/);
            let lastNumber = parts[parts.length - 1];

            // Only add decimal if number doesn't already have one
            if (!lastNumber.includes('.')) {
                display.value = currentValue + value;
            }   
        }
    } else {
        // Handle any other characters
        display.value = currentValue + value;
    }

    // Reset justCalculated flag when user starts typing
    justCalculated = false;
    console.log('Display updated to:', display.value);
}

function clearDisplay() {
    console.log('Clear button pressed');
    display.value = '0';
    justCalculated = false;

    // Visual feedback for clear button
    display.style.backgroundColor = '#f0f0f0';
    setTimeout(() => {
        display.style.backgroundColor = '';
    }, 150);
}

function deleteLast() {
    console.log('Backspace button pressed');
    let currentValue = display.value;

    if (currentValue.length <= 1 || currentValue === '0') {
        display.value = '0';
    } else {
        display.value = currentValue.slice(0, -1);
    }
    justCalculated = false;
}

function calculate() {
    console.log('Equals button pressed');
    let expression = display.value;
    
    // Don't calculate if expression ends with an operator
    if (isOperator(getLastChar())) {
        return;
    }
    
    try {
        let result = eval(expression);
        
        // Handle division by zero and other edge cases
        if (!isFinite(result)) {
            display.value = "Error";
            justCalculated = false;
        } else {
            // Round to prevent floating point precision issues
            display.value = parseFloat(result.toPrecision(12)).toString();
            justCalculated = true;
        }
    } catch (error) {
        display.value = "Error";
        justCalculated = false;
    }
}

// Keyboard event handling
document.addEventListener('keydown', function (event) {
    console.log('Key pressed:', event.key);

    if (event.key >= '0' && event.key <= '9') {
        appendToDisplay(event.key);
    } else if (event.key === '.') {
        appendToDisplay('.');
    } else if (['+', '-', '*', '/'].includes(event.key)) {
        appendToDisplay(event.key);
    } else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculate();
    } else if (event.key === 'Escape' || event.key.toLowerCase() === 'c') {
        clearDisplay();
    } else if (event.key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('Calculator loaded successfully');
    if (display) {
        display.value = '0'; // Initialize display to '0'
        console.log('Current display value:', display.value);
    } else {
        console.log('Display element not found');
    }
});