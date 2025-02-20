const generatePassword = document.getElementById("generatePassword");
const displayPassword = document.getElementById("displayPassword");
const passwordLength = document.getElementById("passwordLength");
const copyPassword = document.getElementById("copyPassword");
const includeUppercase = document.getElementById("includeUppercase");
const includeLowercase = document.getElementById("includeLowercase");
const includeNumbers = document.getElementById("includeNumbers");
const includeSymbols = document.getElementById("includeSymbols");
const strengthProgress = document.getElementById("strengthProgress");
const strengthText = document.getElementById("strengthText");
const darkModeToggle = document.getElementById("darkModeToggle");
const downloadPassword = document.getElementById("downloadPassword");
const shareFeedback = document.getElementById("shareFeedback");
const stars = document.querySelectorAll(".stars span");
const historyList = document.getElementById("historyList");
const clearHistory = document.getElementById("clearHistory");
const contactForm = document.getElementById("contactForm");

let passwordHistory = [];

generatePassword.addEventListener("click", function () {
  let length = parseInt(passwordLength.value);

  // Input validation
  if (isNaN(length) || length < 8 || length > 64) {
    alert("Please enter a valid password length between 8 and 64.");
    return;
  }

  let possibleCharacters = "";
  if (includeUppercase.checked) possibleCharacters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeLowercase.checked) possibleCharacters += "abcdefghijklmnopqrstuvwxyz";
  if (includeNumbers.checked) possibleCharacters += "0123456789";
  if (includeSymbols.checked) possibleCharacters += "!@#$%^&*()_+";

  if (possibleCharacters === "") {
    alert("Please select at least one character type.");
    return;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    password += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
  }

  displayPassword.textContent = password;
  copyPassword.style.display = "inline";
  downloadPassword.style.display = "inline";

  // Update password strength
  const strength = checkPasswordStrength(password);
  strengthProgress.style.width = `${(strength / 4) * 100}%`;
  strengthText.textContent = getStrengthText(strength);

  // Add password to history
  passwordHistory.push(password);
  updatePasswordHistory();
});

// Copy to clipboard functionality
copyPassword.addEventListener("click", function () {
  navigator.clipboard.writeText(displayPassword.textContent).then(() => {
    alert("Password copied to clipboard!");
  }).catch(() => {
    alert("Failed to copy password.");
  });
});

// Download password as a .txt file
downloadPassword.addEventListener("click", function () {
  const password = displayPassword.textContent;
  const blob = new Blob([password], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "password.txt";
  a.click();
  URL.revokeObjectURL(url);
});

// Dark mode toggle
darkModeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
});

// Share Feedback Button
shareFeedback.addEventListener("click", function () {
  window.location.href = "mailto:sark.dal.storm@gmail.com?subject=Password%20Generator%20Feedback";
});

// Rate This Tool Section
stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    stars.forEach((s, i) => {
      if (i <= index) {
        s.classList.add("active");
      } else {
        s.classList.remove("active");
      }
    });
    alert(`Thanks for rating us ${index + 1} stars!`);
  });
});

contactForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the form from submitting the traditional way
  alert("Thank you for your message! We'll get back to you soon.");
  contactForm.reset(); // Clear the form
});

// Password History Section
function updatePasswordHistory() {
  historyList.innerHTML = passwordHistory.map((pwd, index) => `
    <li>${index + 1}. ${pwd}</li>
  `).join("");
}

clearHistory.addEventListener("click", function () {
  passwordHistory = [];
  updatePasswordHistory();
});

// Password strength calculation
function checkPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*()_+]/.test(password)) strength++;
  return strength; // 0 = weak, 1-2 = medium, 3-4 = strong
}

function getStrengthText(strength) {
  switch (strength) {
    case 0: return "Weak";
    case 1: return "Medium";
    case 2: return "Medium";
    case 3: return "Strong";
    case 4: return "Very Strong";
    default: return "";
  }
}