const generateBtn = document.querySelector("#generate");
const copyBtn = document.querySelector("#copy");
const lengthInputRange = document.getElementById("pw-length-range");
const lengthInputText = document.getElementById("pw-length-text");
const fieldSet = document.querySelector("fieldset");
const passwordText = document.querySelector(".card-body");

// Global scope for password so it is accessible to clipboard function
let password = "";

lengthInputRange.addEventListener("input", () => {
  lengthInputText.value = lengthInputRange.value;
});

lengthInputText.addEventListener("change", e => {
  const validateInput = el => {
    const val = el.value;
    if (isNaN(val)) {
      return (el.value = 8);
    }
    if (val < 8) return (el.value = 8);
    if (val > 128) return (el.value = 128);
  };
  validateInput(e.target);
  lengthInputRange.value = e.target.value;
});

fieldSet.addEventListener("input", () => {
  // If all children are unchecked, disable generate button
  const characterChecks = fieldSet.querySelectorAll("input");
  const validateInputs = () => {
    let valid = false;
    characterChecks.forEach(el => {
      if (el.checked) return (valid = true);
    });
    return valid;
  };
  const valid = validateInputs();
  if (valid) {
    generateBtn.removeAttribute("disabled");
  } else {
    generateBtn.setAttribute("disabled", true);
  }
});

function generatePassword() {
  // Get the required password length from the user
  const length = getPasswordLength();
  if (!length) {
    password = "";
    return;
  }

  // Put the functions that are required by the user in their own array so they can be called randomly
  const functionArray = getFunctionArray();

  // Validate input to ensure at least one character type is selected
  if (functionArray.length < 1) {
    alert("⚠️ Please select at least one character type");
    return "";
  }
  const passwordArray = createPasswordArray(length, functionArray);

  // convert the password array to a string with the 'join' method and return it
  password = passwordArray.join("");
}

// Return password length if valid, otherwise return undefined and provide alert
function getPasswordLength() {
  const length = parseInt(lengthInputRange.value);
  if (isNaN(length)) return null;
  if (length < 8 || length > 128) return null;
  return length;
}

// We have 4 functions here, each one is responsible for returning a random character within a certain set - eg: lowercase, uppercase, number or symbol
// By storing these functions (the function object, not result of a function) we can call them dynamically by randomly accessing this array's index and calling the result, eg arr[randomIndex]()
// This provides an easy way to build the password and ensure the password specifications are met
function getFunctionArray() {
  const arr = [];
  const lower = fieldSet.querySelector("#lower").checked;
  const upper = fieldSet.querySelector("#upper").checked;
  const numeric = fieldSet.querySelector("#number").checked;
  const symbols = fieldSet.querySelector("#symbol").checked;
  if (lower) arr.push(getLower);
  if (upper) arr.push(getUpper);
  if (numeric) arr.push(getNumber);
  if (symbols) arr.push(getSymbol);
  return arr;
}

function createPasswordArray(length, functionArray) {
  // Initialize empty array to eventually be returned by the function
  const arr = [];

  // Begin building password by calling each function at least once so that requirements are met

  // (characters to be inserted in random order)
  functionArray.forEach(func => {
    insertRandomly(func(), arr);
  });

  // Finish building the array by randomly calling functions and inserting them into random locations within the array
  // (using the functions randomly helps avoid building patterns into the password)
  while (arr.length < length) {
    const idx = Math.floor(Math.random() * functionArray.length);
    insertRandomly(functionArray[idx](), arr);
  }

  // the array will now contain the specified character sets (at least one of each, and a random amount more) in random locations throughout the password
  return arr;
}

// Using the splice function we can insert an element at any location within the array
function insertRandomly(char, arr) {
  const idx = Math.floor(Math.random() * arr.length);
  arr.splice(idx, 0, char);
  return arr;
}

// Four functions for getting random characters of different types
// (Using function expressions instead of declarations as a visual indicator that these functions are of the same group and going to be handled within an array)
const getLower = function () {
  return String.fromCharCode(Math.floor(Math.random() * 26 + 97));
};

const getUpper = function () {
  return getLower().toUpperCase();
};

const getNumber = function () {
  const num = Math.floor(Math.random() * 10);
  return num.toString();
};

const getSymbol = function () {
  const symbols = " !\"#$%&'()*+,-./:;<=>?@[]^_`{|}~";
  const idx = Math.floor(Math.random() * symbols.length);
  return symbols[idx];
};

// Get references to the #generate element

// click handler for 'copy to clipboard' button
function onCopy() {
  copyBtn.classList.add("copied");
  navigator.clipboard.writeText(password);
  setTimeout(() => {
    copyBtn.classList.remove("copied");
  }, 2000);
}

// Add event listeners to buttons
generateBtn.addEventListener("click", writePassword);
copyBtn.addEventListener("click", onCopy);

// only show the 'copy to clipboard' button if a password has been successfully generated
function displayClipboard() {
  if (password) {
    copyBtn.classList.remove("hide");
  } else {
    copyBtn.classList.add("hide");
  }
}

// remove all child elements from container
function clearElement(el) {
  el.innerText = "";
}

// spannify the text - grab each character in the string and wrap it in a span, then append it to the parent container
function spanText(text, container) {
  text.split("").forEach(letter => {
    const spanEl = document.createElement("span");
    spanEl.innerText = letter;
    container.appendChild(spanEl);
  });
}

// create an array out of the container's children (the spans making up the password)
// then animate them individually
function animateText(container) {
  const elements = Array.from(container.children);
  elements.forEach(el => {
    setAnimation(el);
  });
}

// applies animation to a single span element
function setAnimation(el) {
  // create a random delay between 0 and 1 second
  const delay = Math.floor(Math.random() * 1000);

  // ensure we have access to the original character intended as the password
  const originalChar = el.innerText;

  // begin the animation after random delay
  setTimeout(() => {
    // add class to display characters - original style has color set to transparent
    el.classList.add("show");
    // use this as random characters available to show - this is purely cosmetic and only related to the animation
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$^&*()_+-=<>,./?~`{}[]";
    let remaining = 5;

    const interval = setInterval(() => {
      // on the final loop, set the character to the originally intended one and break loop
      if (remaining < 1) {
        el.innerText = originalChar;
        return clearInterval(interval);
      }
      // set the element inner text to a random character from chars string
      const idx = Math.floor(Math.random() * chars.length);
      el.innerText = chars[idx];
      remaining--;
    }, 80);
  }, delay);
}

// Write password to the #password input
function writePassword(e) {
  e.preventDefault();
  // run function to generate a password and store it in global password variable
  generatePassword();
  // display the 'copy to clipboard' button if password successfully generates
  displayClipboard();
  // remove an existing password before displaying new password
  clearElement(passwordText);
  // put each letter of the password into a span element for display and animation purposes
  spanText(password, passwordText);
  // animate the password generation
  animateText(passwordText);
}
