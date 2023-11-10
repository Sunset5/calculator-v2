let firstNumber = '',
    secondNumber = '',
    sign = '',
    finish = false,
    finishSign = false;

const digit = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
const action = ['-', '+', '/', 'X',];

const out = document.querySelector('.result');

function clearAll() {
    firstNumber = '';
    secondNumber = '';
    sign = '';
    finish = false;
    finishSign = false;
    out.textContent = 0;
}

document.querySelector('.ac').onclick = clearAll;

document.querySelector('.buttons').onclick = (event) => {
    if (!event.target.classList.contains('btn')) return
    if (event.target.classList.contains('ac')) return

    const key = event.target.textContent

    // out limit of 13 characters
    if (out.textContent.length >= 13 && secondNumber === '' && key !== '+/-') return;
    else if (out.textContent.length >= 13 && sign !== '' && secondNumber !== '' && key !== '=' && key !== '+/-') return;
    else if (firstNumber.length >= 10 && action.includes(key)) return;

    // disappearance of the Error message on click (when dividing by 0)
    if (out.textContent === 'Ошибка') clearAll();

    // implementation +/-
    if (key === '+/-' && out.textContent !== '0') {
        // first number
        if (out.textContent === firstNumber) {
            out.textContent = String(-out.textContent);
            firstNumber = out.textContent;
        }
        // second number
        else if (out.textContent.includes(secondNumber) && secondNumber !== '') {
            // if two cons are next to each other, then there will be a plus, and if a plus, then a minus
            if (sign === '-') {
                out.textContent = out.textContent.slice(0, out.textContent.length - secondNumber.length - 2) + '+ ';
                sign = '+';
                out.textContent += secondNumber;
                return;
            } else if (sign === '+') {
                out.textContent = out.textContent.slice(0, out.textContent.length - secondNumber.length - 2) + '- ';
                sign = '-';
                secondNumber = secondNumber;
                out.textContent += secondNumber;
                return;
            }
            // the usual reversal of the sign
            out.textContent = out.textContent.slice(0, out.textContent.length - secondNumber.length);
            secondNumber = String(-secondNumber);
            out.textContent += secondNumber;
        }
    }

    // implementation %
    if (key === '%' && out.textContent !== '0') {
        // first number
        if (out.textContent == firstNumber) {
            if ((String(out.textContent / 100)).length >= 13) return; // out limit of 13 characters
            out.textContent /= 100;
            firstNumber = out.textContent
        }
        // second number
        else if (out.textContent.includes(secondNumber)) {
            if ((String(secondNumber / 100)).length >= 13) return; // out limit of 13 characters
            out.textContent = out.textContent.slice(0, out.textContent.length - secondNumber.length);
            secondNumber = String(secondNumber / 100);
            out.textContent += secondNumber;
        }
    }

    // Entering numbers
    if (digit.includes(key)) {
        if (out.textContent === '0' && key !== '.') out.textContent = ''; // Deleting zeros at the beginning of input and adds 0 if it puts the first point
        // filling in the first number
        if (secondNumber === '' && sign === '') {
            if (key === '.' && firstNumber.includes('.')) return; // if there is already one point, then it is no longer possible
            else if (key === '.' && out.textContent === '') {
                firstNumber += '0'; // adds 0 if it puts the first point
                out.textContent += '0';
            }
            if (firstNumber[0] === '-' && firstNumber[1] === '0' && !firstNumber.includes('.') && key === '0' && key !== '.') return; // if he wants to put more than one zero and there is no point
            else if (!firstNumber.includes('.') && firstNumber[1] === '0' && key !== '0' && key !== '.') {
                firstNumber = firstNumber.slice(0, firstNumber.length - 1);
                firstNumber += key;
                out.textContent = firstNumber;
                return;
            }
            firstNumber += key;
            out.textContent += key;
        }
        // pressing any digit causes a reset for a new set after calculation
        else if (finish && !out.textContent.includes(' ')) {
            firstNumber = (key === '.') ? '0' + key : key;
            out.textContent = firstNumber;
            secondNumber = '';
            sign = '';
            finish = false;
            finishSign = false;
        }
        // filling in the second object when the calculation continues
        else if (finish && secondNumber !== '') {
            if (key === '.') out.textContent += '0'; // adds 0 if it puts the first point
            secondNumber = key;
            finish = false; // Makes it possible to enter the second number after calculations
            out.textContent += key;
        }
        // filling in the second number
        else {
            if (key === '.' && secondNumber === '') {
                secondNumber += '0';
                out.textContent += secondNumber; // adds 0 if it puts the first point   
            }
            if (key === '.' && secondNumber.includes('.')) return; // there can only be one zero to a point and the point itself is one
            // if the second number starts with 0 and then wants to put a digit other than a dot
            if (secondNumber[0] === '0' && !secondNumber.includes('.') && key !== '.') {
                out.textContent = out.textContent.slice(0, out.textContent.length - secondNumber.length)
                secondNumber = key;
                out.textContent += secondNumber;
                return;
            }
            secondNumber += key;
            out.textContent += key;
        }
        // console.log(firstNumber, typeof firstNumber, sign, typeof sign, secondNumber, typeof secondNumber, out.textContent, typeof out.textContent, finish);
        return;
    }

    // if it wants to change the sign while typing, but only if the second number is not typed on the screen
    if (action.includes(key) && finishSign && !digit.includes(out.textContent[out.textContent.length - 1])) {
        sign = key;
        out.textContent = out.textContent.slice(0, out.textContent.length - 3);
        out.textContent += ' ' + key + ' ';
        return;
    }

    // Calculation
    if (key === '=' || action.includes(key) && secondNumber !== '' && finishSign) {
        // if after the first input of the number presses the sign
        if (secondNumber === '') secondNumber = firstNumber;
        // calculation and display
        switch (sign) {
            case '+':
                // out limit of 13 character and rounding
                if (String((+firstNumber + +secondNumber)).length >= 13 && !String(+firstNumber + +secondNumber).includes('.')) return;
                else {
                    console.log(+firstNumber);
                    console.log(+secondNumber);
                    firstNumber = +firstNumber + +secondNumber;
                    firstNumber = firstNumber.toString();
                    let i = firstNumber.length - firstNumber.split('.')[0].length - 1;
                    while (firstNumber.length >= 13 || firstNumber[i] === '0' && i !== 0) {
                        firstNumber = (+firstNumber).toFixed(i - firstNumber.split('.')[0].length - 1); // rounding if the result has a dot or many zeros at the end
                        i--;
                    }
                }
                break;
            case '-':
                firstNumber -= secondNumber;
                break;
            case 'X':
                // out limit of 13 character and rounding
                if (String((firstNumber * secondNumber)).length >= 13 && !String(firstNumber * secondNumber).includes('.')) return;
                else {
                    firstNumber *= secondNumber;
                    firstNumber = firstNumber.toString();
                    let i = firstNumber.length - firstNumber.split('.')[0].length - 1;
                    while (firstNumber.length >= 13 || firstNumber[i] === '0') {
                        firstNumber = (+firstNumber).toFixed(i - firstNumber.split('.')[0].length - 1); // rounding if the result has a dot or many zeros at the end
                        i--;
                    }
                    break;
                }
            case '/':
                // when div on 0 (NaN and Infinity)
                if (firstNumber / secondNumber !== firstNumber / secondNumber || firstNumber / secondNumber === Infinity) {
                    out.textContent = 'Ошибка';
                    firstNumber = '';
                    secondNumber = '';
                    sign = '';
                    finish = false;
                    finishSign = false;
                    return;
                }
                // out limit of 13 character and rounding
                if (String(firstNumber / secondNumber).length >= 13) {
                    firstNumber /= secondNumber;
                    firstNumber = firstNumber.toString();
                    let i = firstNumber.length - firstNumber.split('.')[0].length - 1;
                    while (firstNumber.length >= 13 || firstNumber[i] === '0' && i !== 0) {
                        firstNumber = (+firstNumber).toFixed(i - firstNumber.split('.')[0].length - 1); // rounding if the result has a dot or many zeros at the end
                        i--;
                    }
                }
                break;
        }
        firstNumber = String(firstNumber);
        // console.log(firstNumber, typeof firstNumber, sign, typeof sign, secondNumber, typeof secondNumber, out.textContent, typeof out.textContent, finish);
        out.textContent = firstNumber;
        finish = true;
        finishSign = false; // Makes it possible to calculate by pressing the second sign
    }

    // Input a sign
    if (action.includes(key) && !finishSign) {
        if (firstNumber === '' && key !== '-') firstNumber = out.textContent; // if he immediately presses the sign when the result is 0
        // rounding the first number if there are no more digits after the dot or only zeros
        if (firstNumber[firstNumber.length - 1] === '.' || firstNumber[firstNumber.length - 1] === '0') {
            // firstNumber = firstNumber.toString();
            let i = firstNumber.length - firstNumber.split('.')[0].length - 1;
            while (firstNumber.length >= 13 || firstNumber[i] === '0') {
                firstNumber = (+firstNumber).toFixed(i - firstNumber.split('.')[0].length - 1); // rounding if the result has a dot or many zeros at the end
                i--;
            }
            // firstNumber = String(Math.round(+firstNumber));
            out.textContent = firstNumber;
        }
        // possibility to add a minus sign to the first number at the beginning of calculation
        if (firstNumber[0] === '-' && !digit.includes(firstNumber[1])) return;
        else if (firstNumber === '' && key === '-') {
            firstNumber = key;
            out.textContent = firstNumber;
            return;
        }
        sign = key;
        out.textContent += ' ' + key + ' ';
        finishSign = true;
    }
}