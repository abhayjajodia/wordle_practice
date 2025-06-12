import {Words} from './words.js';

const no_of_guesses = 6;
let remaining_guesses = no_of_guesses;
let current_guess = [];
let next_letter = 0;
let rightGuessString = Words[Math.floor(Math.random() * Words.length)].toLowerCase();
console.log(rightGuessString)




function makingBoard(){
    let board = document.getElementById('game-board')
    for (let i = 0; i < no_of_guesses; i++){
        let row = document.createElement('div')
        row.className = 'row'

        for(let j=0; j<5; j++){
            let letter = document.createElement('div')
            letter.className = 'letter'
            row.appendChild(letter)
        }
        board.appendChild(row);
    }
}

makingBoard();


document.addEventListener("keyup", (e) => {

    if (remaining_guesses === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && next_letter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

function insertLetter (pressedKey) {
    if (next_letter === 5) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("row")[6 - remaining_guesses]
    let box = row.children[next_letter]
    animateCSS(box, "pulse")
    box.textContent = pressedKey
    box.classList.add("filled-box")
    current_guess.push(pressedKey)
    next_letter += 1
}   

function deleteLetter () {
    let row = document.getElementsByClassName("row")[6 - remaining_guesses]
    let box = row.children[next_letter - 1]
   
    box.textContent = ""
    box.classList.remove("filled-box")
    current_guess.pop()
    next_letter -= 1
}

function checkGuess () {
    let row = document.getElementsByClassName("row")[6 - remaining_guesses]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)
    console.log(rightGuess)

    for (const val of current_guess) {
        guessString += val
    }

    if (guessString.length != 5) {
        toastr.error("Not enough letters!")
        return
    }

    if (!Words.includes(guessString)) {
        toastr.error("Word not in list!")
        return
    }


    for (let i = 0; i < 5; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = current_guess[i]

        let letterPosition = rightGuess.indexOf(current_guess[i])
        console.log(letterPosition)
        // is letter in the correct guess
        if (letterPosition === -1) {
            letterColor = 'grey'
        } else {
            // now, letter is definitely in word
            // if letter index and right guess index are the same
            // letter is in the right position 
            if (current_guess[i] === rightGuess[i]) {
                // shade green 
                letterColor = 'green'
            } else {
                // shade box yellow
                letterColor = 'yellow'
            }

            rightGuess[letterPosition] = "#"
        }

        let delay = 250 * i
        setTimeout(()=> {
            //shade box
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    if (guessString === rightGuessString) {
        toastr.success("You guessed right! Game over!")
        remaining_guesses = 0
        return
    } else {
        remaining_guesses -= 1;
        current_guess = [];
        next_letter = 0;

        if (remaining_guesses === 0) {
            toastr.error("You've run out of guesses! Game over!")
            toastr.info(`The right word was: "${rightGuessString}"`)
        }
    }
}


document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target

    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            } 

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});