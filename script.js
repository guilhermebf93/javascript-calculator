//Documents variables
const screen = document.getElementById('screen');
const keyboard = document.getElementById('keyboard');

//Keys Array
const keysArr = [
    {
        name: 'clear',
        screen: 'C'
    },
    {
        name: 'change-signal',
        screen: '+/-'
    },
    {
        name: 'multiply',
        screen: 'x'
    },
    {
        name: 'divide',
        screen: '÷'
    },
    {
        name: '7',
        screen: '7'
    },
    {
        name: '8',
        screen: '8'
    },
    {
        name: '9',
        screen: '9'
    },
    {
        name: 'subtract',
        screen: '-'
    },
    {
        name: '4',
        screen: '4'
    },
    {
        name: '5',
        screen: '5'
    },
    {
        name: '6',
        screen: '6'
    },
    {
        name: 'add',
        screen: '+'
    },
    {
        name: '1',
        screen: '1'
    },
    {
        name: '2',
        screen: '2'
    },
    {
        name: '3',
        screen: '3'
    },
    {
        name: '0',
        screen: '0'
    },
    {
        name: 'period',
        screen: '.'
    },
    {
        name: 'equals',
        screen: '='
    }
];
const regex = /\d/;
//Draws Keyboard
const drawKeyboard = () => {

    //Add a button element for each key in KeysArr
    keysArr.forEach(key => {
        keyboard.innerHTML += `
            <button 
                type="button" 
                class="button btn-${key.name}" 
                id="${key.name}"
                value="${key.screen}">
            ${key.screen}
            </button>
        `;

        
        //Adds color to the non-digits keys
        if (!regex.test(key.screen)) {
            if (key.screen === '=' || key.screen === 'C') {
                document.getElementById(key.name).style.backgroundColor = 'var(--red)';
            } else {
                document.getElementById(key.name).style.backgroundColor = 'var(--mid-shade)';
            }
            document.getElementById(key.name).style.color = 'var(--bg-white)';
        }
    });

};

//Handles the functioning of the calculator
const calculator = () => {
    drawKeyboard();

    //Calculator state
    const state = {
        numString: '0',
        calcArray: []
    };

    const calculate = array => {
        let newArr = [...array];

        while (newArr.length > 1) {
            while (newArr.includes('x') || newArr.includes('÷')) {
                newArr.forEach((element, index) => {
                    if (element === 'x') {
                        newArr.splice(index - 1, 3, Number(newArr[index - 1]) * Number(newArr[index + 1]));
                    };

                    if (element === '÷') {
                        newArr.splice(index - 1, 3, Number(newArr[index - 1]) / Number(newArr[index + 1]));
                    }
                })
            }
            
            while (newArr.includes('+') || newArr.includes('-')) {
                newArr.forEach((element, index) => {
                    if (element === '+') {
                        newArr.splice(index - 1, 3, Number(newArr[index - 1]) + Number(newArr[index + 1]));
                    };

                    if (element === '-') {
                        newArr.splice(index - 1, 3, Number(newArr[index - 1]) - Number(newArr[index + 1]));
                    }
                })
            }
        }

        state.calcArray = [];
        state.numString = '';
        updateScreen();
        setTimeout(() => {
            state.numString = newArr[0];
            updateScreen();
        }, 125);
    }

    const updateScreen = () => {
        screen.textContent = `${state.calcArray.join(' ')} ${state.numString}`;
    }

    updateScreen();

    const handleNumber = number => {
        if (state.numString === '' || state.numString == '0') {
            state.numString = number;
        } else {
            state.numString += number;
        }
        updateScreen();
    }    

    const handleSymbol = symbol => {
        switch (symbol) {
            case 'C':
                state.numString = '0';
                state.calcArray = [];
                break;
            case '+/-':
                let numArr = state.numString.split('');
                if (regex.test(numArr[0])) {
                    numArr.unshift('-');
                } else {
                    numArr.shift();
                };
                state.numString = numArr.join('');
                break;
            case '=':
                state.calcArray = [...state.calcArray, state.numString];
                state.numString = ''
                calculate(state.calcArray);
                break;
            case '.':
                if (!state.numString.includes('.')) {
                    state.numString += symbol;
                };
                break;
            default:
                if (state.numString !== '') {
                    state.calcArray = [...state.calcArray, state.numString, symbol];
                    state.numString = '';
                } else {
                    state.calcArray[state.calcArray.length - 1] = symbol;
                }
                break;
        }
        updateScreen();
    }

    const handleInput = value => {
        regex.test(value)
            ? handleNumber(value)
            : handleSymbol(value);
    }

    const keys = [...document.getElementsByClassName('button')];
    keys.forEach(key => {
        key.addEventListener('click', event => {
            handleInput(event.target.value);
            updateScreen();
        });
    });

    document.getElementById('container').addEventListener('keydown', event => {
        event.preventDefault();
        let key = event.key;
        const calcKeys = ['Backspace', 'Delete', 'Enter', 'x', '*', '/', '+', '-', '.', ','];

        if (regex.test(key) || calcKeys.includes(key)) {
            
            switch (key) {
                case 'Backspace':
                case 'Delete':
                    handleInput('C');
                    break;
                case 'Enter':
                    handleInput('=');
                    break;
                case '*':
                    handleInput('x');
                    break;
                case '/':
                    handleInput('÷');
                    break;
                case ',':
                    handleInput('.');
                    break;
                default:
                    handleInput(key);
                    break;
            }
        }

    })
}

calculator();