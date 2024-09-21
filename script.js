const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
console.log("lksjdflksjdfl;ksjdflaksdjf");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handelSlider();
// set the strength color to grey;
setIndicator("#ccc")

// set defalut password lenght

function handelSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    // hw wala
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow abhi bacha hai karna
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowercase(){
     return String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}


function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }

    else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ){
        setIndicator("#ff0");
    }

    else{
        setIndicator("#f00");

    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }

    // to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");

    }, 2000);
}

inputSlider.addEventListener('input', (e) =>{
    passwordLength = e.target.value;
    handelSlider(); 
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
})


// eventlistener on the checkbox

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckbox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    // special condidtion if passworldlength < checkcount

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handelSlider();
    }
}

allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


// shuffle password
function shufflePassword(array){
    // Fisher Yates Method 

    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}



// addeventlistener on the generate button
generateBtn.addEventListener('click',() => {

    if(checkCount == 0)
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handelSlider();
    }
    
    // let start journey to find new password

    // remove old password
    password = "";

    // let put the stuff mentioned by the checkbox
        
    // if(uppercaseCheck.checked){
    //     password += generateUppercase(); 
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowercase(); 
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber(); 
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol(); 
    // }

    // doing by using array of above commented for more easy
    
    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
       
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase)
    }

    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }

    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    // compulsary addition

    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }

    // remaining addition
    for(let i = 0; i < passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;

    // calculate strength
    calcStrength();
})