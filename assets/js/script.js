document.addEventListener("DOMContentLoaded", function () {
    console.log("Dark Mode Script Loaded on: " + window.location.pathname);

    const generatePassword = document.getElementById("generatePassword");
    const displayPassword = document.getElementById("displayPassword");
    const passwordLength = document.getElementById("passwordLength");
    const copyPassword = document.getElementById("copyPassword");
    const downloadPassword = document.getElementById("downloadPassword");
    const includeUppercase = document.getElementById("includeUppercase");
    const includeLowercase = document.getElementById("includeLowercase");
    const includeNumbers = document.getElementById("includeNumbers");
    const includeSymbols = document.getElementById("includeSymbols");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const darkModeIcon = document.getElementById("darkModeIcon");
    const historyListElement = document.getElementById("historyList");
    const clearHistoryButton = document.getElementById("clearHistory");
    const passwordStrength = document.getElementById("passwordStrength");
    let historyList = JSON.parse(localStorage.getItem("passwordHistory")) || [];

    function generateRandomPassword(length) {
        let chars = "";
        if (includeUppercase?.checked) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (includeLowercase?.checked) chars += "abcdefghijklmnopqrstuvwxyz";
        if (includeNumbers?.checked) chars += "0123456789";
        if (includeSymbols?.checked) chars += "!@#$%^&*()_+";

        if (!chars) {
            alert("Please select at least one character type.");
            return "";
        }

        let password = "";
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    function updateDarkMode() {
        const isDarkMode = localStorage.getItem("darkMode") === "true";
        document.body.classList.toggle("dark-mode", isDarkMode);
        document.querySelector("nav")?.classList.toggle("dark-mode", isDarkMode);
        document.querySelector("footer")?.classList.toggle("dark-mode", isDarkMode);
        if (darkModeIcon) {
            darkModeIcon.src = isDarkMode ? "images/dark-toggle-on.jpeg" : "images/dark-toggle-off.jpeg";
        }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", function () {
            const isDarkMode = document.body.classList.toggle("dark-mode");
            localStorage.setItem("darkMode", isDarkMode);
            document.querySelector("nav")?.classList.toggle("dark-mode", isDarkMode);
            document.querySelector("footer")?.classList.toggle("dark-mode", isDarkMode);
            if (darkModeIcon) {
                darkModeIcon.src = isDarkMode ? "images/dark-toggle-on.jpeg" : "images/dark-toggle-off.jpeg";
            }
        });
        updateDarkMode(); // Ensure dark mode is applied on page load
    }

    function checkPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
    
        if (passwordStrength) {
            passwordStrength.style.width = (strength * 20) + "%";
            passwordStrength.classList.remove("bg-danger", "bg-warning", "bg-success");
    
            if (strength <= 2) {
                passwordStrength.classList.add("bg-danger");
            } else if (strength <= 4) {
                passwordStrength.classList.add("bg-warning");
            } else {
                passwordStrength.classList.add("bg-success");
            }
        }
    }
    
    function updateHistory() {
        if (!historyListElement) return;
        historyListElement.innerHTML = "";
        historyList.forEach((pwd, index) => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            listItem.innerHTML = `
                <span>${pwd}</span>
                <div>
                    <button class="btn btn-sm btn-outline-success copy-btn" data-index="${index}">Copy</button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            historyListElement.appendChild(listItem);
        });
        localStorage.setItem("passwordHistory", JSON.stringify(historyList));
    }

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("copy-btn")) {
            const index = event.target.getAttribute("data-index");
            navigator.clipboard.writeText(historyList[index]).then(() => {
                alert("Password copied to clipboard!");
            });
        }

        if (event.target.classList.contains("delete-btn")) {
            const index = event.target.getAttribute("data-index");
            historyList.splice(index, 1);
            updateHistory();
        }
    });

    if (generatePassword) {
        generatePassword.addEventListener("click", function () {
            const length = parseInt(passwordLength?.value || "12");
            if (isNaN(length) || length < 8 || length > 64) {
                alert("Password length must be between 8 and 64 characters.");
                return;
            }
            
            const password = generateRandomPassword(length);
            if (password && displayPassword) {
                displayPassword.textContent = password;
                displayPassword.style.display = "block";
                if (copyPassword) copyPassword.style.display = "inline-block";
                if (downloadPassword) downloadPassword.style.display = "inline-block";
                historyList.push(password);
                updateHistory();
                checkPasswordStrength(password);
            }
        });
    }

    if (clearHistoryButton) {
        clearHistoryButton.addEventListener("click", function () {
            historyList = [];
            updateHistory();
        });
    }

    updateHistory();
});
