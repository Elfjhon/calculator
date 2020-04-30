// import { InvalidInputError } from 'utils';
const input = document.querySelector('.input-io');
const buttons = document.querySelectorAll('button');
const numButtons = document.querySelectorAll('.num-btn');
const clearButton = document.querySelector('#clr-btn');
const oprButtons = document.querySelectorAll('.opr-btn');
const evalButton = document.querySelector('.eval-btn')
const bkspButton = document.querySelector('#bksp-btn');
const pctButton = document.querySelector('#pct-btn');

var calcInput = ''; var curValue = '';
const MDAS = '*/+-';

window.addEventListener('keydown', (event) => {
    if (event.key==='Escape') clearInput();
    else if (event.key==='=' || event.key==='Enter') operateInput();
    else if (MDAS.includes(event.key)) selectOperator(event);
    else if ('0123456789.'.includes(event.key)) selectNumber(event);
    else if (event.key==='%') percentInput();
    else if (event.key==='Backspace' || event.key==='Delete') undoInput();
});

// EVENT LISTENER ATTACHMENT
numButtons.forEach(numButton => { // why doens't this work? i was calling the function () and not passing in just the function
    numButton.addEventListener('click', selectNumber);
});
oprButtons.forEach(oprButton => {
    oprButton.addEventListener('click', selectOperator);
});
clearButton.addEventListener('click', clearInput);
evalButton.addEventListener('click', operateInput);
bkspButton.addEventListener('click', undoInput);
pctButton.addEventListener('click', percentInput);

// DISPLAY FUNCTIONS
function displayInput(value) {
    input.value = value;
}
// EVENT LISTENERS
function percentInput() {
    if (curValue!=='') {
        curValue = '' + (parseFloat(curValue) / 100);
        displayInput(curValue);
    }
}
function undoInput() {
    if (curValue === '') return;
    curValue = curValue.split('').slice(0,-1).length===0 ? '' : ''+curValue.split('').slice(0,-1).join('');
    displayInput(curValue);
}
function operateInput() {
    if (curValue === '') return;
    console.log('Current operation: ' + calcInput + curValue);
    calcInput = '' + evaluate(calcInput + curValue);
    displayInput(calcInput);
    curValue = '';
    console.log('Result: ' + calcInput);
}
function clearInput() {
    calcInput = '';
    curValue = '';
    displayInput(calcInput);
    console.log('Cleared input: ' + calcInput + ', ' + curValue);
}
function selectOperator(event) {
    const value = (event.target.value) ? event.target.value : event.key;
    console.log('End of calcinput: ' + calcInput.slice(-1));
    if (calcInput==='') {
        if (curValue!=='') calcInput += curValue + value;
        else calcInput += 0+value;
    } else { // if there is loaded data
        if (curValue!=='') calcInput += curValue + value; 
        else calcInput += value;
    }
    curValue = '';
    input.value = '';
}
function selectNumber(event) {
    const value = (event.target.value) ? event.target.value : event.key;
    if (value === '.' && !curValue.includes('.')) {
        curValue += value;        
    } else if (value !== '.') {
        curValue += value;
    }
    displayInput(''+curValue);
}

// OPERATION FUNCTIONS
// parse the array into numbers and operators
/*
need to do some sort of pruning...
split the statement first
then go through the statements 
*/
function evaluate(statement) {
    statement = statement.split(/(\*|\/|\+|\-)+/);
    //hacky way of checking for negative
    statement[0] = statement[0]==='' ? 0 : statement[0];
    // reset values
    index = 0;
    for (var val of ['*/', '+-']) {
        while (index < statement.length) {
            if (val.includes(statement[index])) {
                const value = operate(statement[index], 
                    parseFloat(statement[index-1]), 
                    parseFloat(statement[index+1]));
                if (value==='error') {
                    alert('Statement error: '+statement.toString());
                    return 0;
                }
                else if (value === 'Unable to divide by 0') {
                    alert('Cannot divide by 0');
                    return 0;
                }
                statement.splice(index-1, 3, value);
                index -= 1;
            } else 
                index += 1;
        }
        index = 0;
    }
    return statement[0].toString().length > 5 ? parseFloat(statement[0].toFixed(5)) : statement[0];
}

function add(a, b) {
    if (isNaN(a) || isNaN(b)) return 0;
    return a + b;
}

function subtract(a, b) {
    if (isNaN(a) || isNaN(b)) return 0;
    return a - b;
}

function multiply(a, b) {
    if (isNaN(a) || isNaN(b)) return 0;
    return a * b;
}

function divide(a, b) {
    if (isNaN(a) || isNaN(b)) return 0;
    if (b === 0) return 'Unable to divide by 0';
    return a / b;
}

function operate(operator, a, b) {
    switch (operator) {
        case '+':
            return add(a,b);
        case '-':
            return subtract(a,b);
        case '*':
            return multiply(a,b);
        case '/':
            return divide(a,b);
        default:
            console.log('error');
            return 'error';
    }
}