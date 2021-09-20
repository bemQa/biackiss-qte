const buttonClassDefault = "captcha__letter";
const buttonClassEnd = "captcha__letter--end";
const buttonClassNow = "captcha__letter--now";
const captcha = document.getElementsByClassName("captcha")[0];
const keySequence = "QWEASD";
const KeySequenceLength = 7;
const timerScale = document.getElementsByClassName("timer__scale")[0];
const textForTimer = document.getElementsByClassName("timer__text")[0];
const messageSucess = document.getElementsByClassName("message__success")[0];
const messageFail = document.getElementsByClassName("message__fail")[0];
let captchaPosition = document.getElementsByClassName('captcha')[0] ;
const TIME_LEFT_STATIC = 4000;
let TIME_LEFT = 4000;
let TIME_LEFT_LEFT;
let fTimer = null;
let ftimer;

let generatingKeys = document.getElementsByClassName(buttonClassDefault);
let generatingKeysArrayElements = Array.prototype.slice.call(generatingKeys);


function addElement(letters) {
    let newButton = document.createElement("div");
    let randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
    newButton.classList.add(buttonClassDefault);
    newButton.setAttribute("data-letter", randomLetter);
    newButton.innerText = randomLetter;
    captcha.appendChild(newButton);
}

function mSuccess() {
    messageSucess.classList.remove("message--hidden");
}

function mFail() {
    messageFail.classList.remove("message--hidden");
}

function newGenerationButtons() {
    messageFail.classList.add("message--hidden");
    messageSucess.classList.add("message--hidden");
    for (var i = 0; i < KeySequenceLength; i++) {
        addElement(keySequence)
    }
}

function removeButtons() {
    Array.prototype.slice.call(document.getElementsByClassName(buttonClassDefault)).forEach((el) => {
        el.remove();
    })
}

function jumpToLetter(from, to) {
    generatingKeys[from].classList.add(buttonClassEnd);
    generatingKeys[from].classList.remove(buttonClassNow);
    if (to < KeySequenceLength) {
        generatingKeys[to].classList.add(buttonClassNow);
        parseInt(captchaPosition.setAttribute('data-position', to));
    }
}

function restart() {
    startTimer();
    removeButtons();
    newGenerationButtons();
    generatingKeysArrayElements.forEach((el) => {
        el.classList.remove(buttonClassEnd);
        el.classList.remove(buttonClassNow);
    })
    generatingKeys[0].classList.add(buttonClassNow);
    parseInt(captchaPosition.setAttribute('data-position', 0));
}

function startTimer() {
    document.getElementsByClassName("timer__scale")[0].classList.add("timer__scale--animation");
    document.getElementsByClassName("timer__scale")[0].classList.remove("timer__scale--full");
    if (ftimer == null) {
        ftimer = setInterval(function(){
            if (TIME_LEFT > 0) {
                TIME_LEFT -= 100;
                textForTimer.innerText = (TIME_LEFT/1000).toFixed(1) + " сек.";
                timerScale.style.width = TIME_LEFT/TIME_LEFT_STATIC * 100 + '%';
            } else {
                clearInterval(fTimer);
                mFail();
            }
        }, 100);
    }
}


document.addEventListener("keydown", (e) => {
    // console.log(e.keyCode);
    var p = captchaPosition.getAttribute('data-position');
    if(e.keyCode == generatingKeys[parseInt(p)].getAttribute("data-letter").charCodeAt(0)) {
        // console.log("Yes!");
        // console.log("captchaPosition = " + parseInt(p) + ", KeySequenceLength = " + KeySequenceLength);
        jumpToLetter(parseInt(p), parseInt(p) + 1);
        if (parseInt(p) < KeySequenceLength - 1) {
            // console.log("+");
        }
        else if (parseInt(p) + 1 == KeySequenceLength && TIME_LEFT > 0) {
            clearInterval(ftimer);
            mSuccess();
        }
    }
    else if (e.keyCode == 32 && parseInt(captchaPosition.getAttribute('data-position')) < KeySequenceLength) {
        document.location.reload();
    }
    else {
        // console.log("No!");
        restart();
    }
});

restart();
generatingKeys[0].classList.add(buttonClassNow);
document.getElementsByClassName("timer__scale")[0].classList.add("timer__scale--go");
