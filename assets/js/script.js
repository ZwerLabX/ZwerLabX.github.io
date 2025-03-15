document.addEventListener("DOMContentLoaded", function () {
    // Dark mode elements
    const darkModeToggle = document.getElementById("darkModeToggle");
    const darkModeIcon = document.getElementById("darkModeIcon");

    // Password generator elements
    const generatePassword = document.getElementById("generatePassword");
    const displayPassword = document.getElementById("displayPassword");
    const passwordLength = document.getElementById("passwordLength");
    const copyPassword = document.getElementById("copyPassword");
    const downloadPassword = document.getElementById("downloadPassword");
    const includeUppercase = document.getElementById("includeUppercase");
    const includeLowercase = document.getElementById("includeLowercase");
    const includeNumbers = document.getElementById("includeNumbers");
    const includeSymbols = document.getElementById("includeSymbols");
    const historyListElement = document.getElementById("historyList");
    const clearHistoryButton = document.getElementById("clearHistory");
    const passwordStrength = document.getElementById("passwordStrength");
    
    // Initialize password history
    let historyList = JSON.parse(localStorage.getItem("passwordHistory")) || [];

    // Enhanced dark mode detection and initialization
    function initializeDarkMode() {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
        let darkMode = localStorage.getItem("darkMode");
        
        if (darkMode === null) {
            darkMode = prefersDark.matches;
        } else {
            darkMode = darkMode === "true";
        }
        
        updateDarkModeUI(darkMode);
        
        // Listen for system dark mode changes
        prefersDark.addEventListener("change", (e) => {
            if (localStorage.getItem("darkMode") === null) {
                updateDarkModeUI(e.matches);
            }
        });
    }

    function updateDarkModeUI(isDark) {
        document.body.classList.toggle("dark-mode", isDark);
        if (darkModeIcon) {
            darkModeIcon.textContent = isDark ? "🌕" : "🌑";
            darkModeIcon.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
        }
        localStorage.setItem("darkMode", isDark);
    }

    // Initialize dark mode
    initializeDarkMode();

    // Dark mode toggle functionality
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", () => {
            const isDark = !document.body.classList.contains("dark-mode");
            updateDarkModeUI(isDark);
        });
    }

    // Password generation functions
    function generateRandomPassword(length) {
        const charSets = {
            uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            lowercase: "abcdefghijklmnopqrstuvwxyz",
            numbers: "0123456789",
            symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
        };

        let chars = "";
        if (includeUppercase?.checked) chars += charSets.uppercase;
        if (includeLowercase?.checked) chars += charSets.lowercase;
        if (includeNumbers?.checked) chars += charSets.numbers;
        if (includeSymbols?.checked) chars += charSets.symbols;

        if (!chars) {
            alert("Please select at least one character type.");
            return "";
        }

        let password = "";
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        
        for (let i = 0; i < length; i++) {
            password += chars[array[i] % chars.length];
        }

        return password;
    }

    function checkPasswordStrength(password) {
        let strength = 0;
        const checks = [
            password.length >= 12,
            /[A-Z]/.test(password),
            /[a-z]/.test(password),
            /[0-9]/.test(password),
            /[^A-Za-z0-9]/.test(password)
        ];
        
        strength = checks.filter(Boolean).length;

        if (passwordStrength) {
            const percentage = (strength / checks.length) * 100;
            passwordStrength.style.width = `${percentage}%`;
            passwordStrength.classList.remove("bg-danger", "bg-warning", "bg-success");
            
            if (strength <= 2) {
                passwordStrength.classList.add("bg-danger");
                passwordStrength.setAttribute("aria-label", "Weak password");
            } else if (strength <= 3) {
                passwordStrength.classList.add("bg-warning");
                passwordStrength.setAttribute("aria-label", "Moderate password");
            } else {
                passwordStrength.classList.add("bg-success");
                passwordStrength.setAttribute("aria-label", "Strong password");
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
                <span class="password-text">${pwd}</span>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary copy-btn" data-index="${index}" aria-label="Copy password">
                        Copy
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-index="${index}" aria-label="Delete password">
                        Delete
                    </button>
                </div>
            `;
            historyListElement.appendChild(listItem);
        });
        
        localStorage.setItem("passwordHistory", JSON.stringify(historyList));
    }

    // Event Listeners
    document.addEventListener("click", function(event) {
        if (event.target.classList.contains("copy-btn")) {
            const index = event.target.getAttribute("data-index");
            navigator.clipboard.writeText(historyList[index])
                .then(() => {
                    event.target.textContent = "Copied!";
                    setTimeout(() => {
                        event.target.textContent = "Copy";
                    }, 2000);
                })
                .catch(() => alert("Failed to copy password"));
        }

        if (event.target.classList.contains("delete-btn")) {
            const index = event.target.getAttribute("data-index");
            historyList.splice(index, 1);
            updateHistory();
        }
    });

    if (generatePassword) {
        generatePassword.addEventListener("click", function() {
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
                historyList.unshift(password);
                updateHistory();
                checkPasswordStrength(password);
            }
        });
    }

    if (clearHistoryButton) {
        clearHistoryButton.addEventListener("click", function() {
            if (confirm("Are you sure you want to clear all password history?")) {
                historyList = [];
                updateHistory();
            }
        });
    }

    // Initialize history on page load
    updateHistory();
});