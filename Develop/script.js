// Assignment code here
function generatePassword() {
  // Get the required password length from the user
  const length = getPasswordLength();
  if (!length) return "";

  // Put the functions that are required by the user in their own array so they can be called randomly
  const functionArray = getFunctionArray();

  // Validate input to ensure at least one character type is selected
  if (functionArray.length < 1) {
    alert("⚠️ Please select at least one character type");
    return "";
  }
  const password = createPasswordArray(length, functionArray);

  // convert the password array to a string with the 'join' method and return it
  return password.join("");
}

// Return password length if valid, otherwise return undefined and provide alert
function getPasswordLength() {
  const length = prompt("Please choose a password length (between 8 and 128 characters)");
  const parsedLength = parseInt(length);
  if (isNaN(parsedLength)) return alert("Invalid selection");
  if (parsedLength < 8 || parsedLength > 128) return alert("Invalid selection");
  return parsedLength;
}

// We have 4 functions here, each one is responsible for returning a random character within a certain set - eg: lowercase, uppercase, number or symbol
// By storing these functions (the function object, not result of a function) we can call them dynamically by randomly accessing this array's index and calling the result, eg arr[randomIndex]()
// This provides an easy way to build the password and ensure the password specifications are met
function getFunctionArray() {
  const arr = [];
  const lower = confirm("Include lowercase letters?");
  const upper = confirm("Include UPPERCASE letters?");
  const numeric = confirm("Include numbers?");
  const symbols = confirm("Include symbols?");
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
var generateBtn = document.querySelector("#generate");

// Write password to the #password input
function writePassword() {
  var password = generatePassword();
  var passwordText = document.querySelector("#password");
  passwordText.value = password;
}

// Add event listener to generate button
generateBtn.addEventListener("click", writePassword);
