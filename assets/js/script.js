document.addEventListener("DOMContentLoaded", function () {
    // Dark mode elements
    const darkModeToggle = document.getElementById("darkModeToggle");
    const darkModeIcon = document.getElementById("darkModeIcon");

    // Password generator elements
    const generatePassword = document.getElementById("generatePassword");
    const displayPassword = document.getElementById("displayPassword");
    const passwordLength = document.getElementById("passwordLength");
    const lengthValue = document.getElementById("lengthValue");
    const copyPassword = document.getElementById("copyPassword");
    const downloadPassword = document.getElementById("downloadPassword");
    const includeUppercase = document.getElementById("includeUppercase");
    const includeLowercase = document.getElementById("includeLowercase");
    const includeNumbers = document.getElementById("includeNumbers");
    const includeSymbols = document.getElementById("includeSymbols");
    const historyListElement = document.getElementById("historyList");
    const clearHistoryButton = document.getElementById("clearHistory");
    const passwordStrength = document.getElementById("passwordStrength");
    const strengthLabel = document.getElementById("strengthLabel");
    const passwordContainer = document.getElementById("passwordContainer");
    
    // Initialize password history
    let historyList = JSON.parse(localStorage.getItem("passwordHistory")) || [];

    // Enhanced dark mode detection and initialization
    function initializeDarkMode() {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
        let darkMode = localStorage.getItem("darkMode");
        
        if (darkMode === null) {
            // If no preference is stored, use system preference
            darkMode = prefersDark.matches;
            localStorage.setItem("darkMode", darkMode);
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

    // Initialize dark mode before anything else
    initializeDarkMode();

    // Dark mode toggle functionality
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", () => {
            const isDark = !document.body.classList.contains("dark-mode");
            updateDarkModeUI(isDark);
        });
    }

    // Password length slider
    if (passwordLength && lengthValue) {
        passwordLength.addEventListener("input", () => {
            lengthValue.textContent = passwordLength.value;
        });
    }

    // Enhanced password generation
    function generateSecurePassword(length) {
        const charSets = {
            uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            lowercase: "abcdefghijklmnopqrstuvwxyz",
            numbers: "0123456789",
            symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
        };

        let chars = "";
        let password = "";
        
        // Add selected character sets
        if (includeUppercase?.checked) chars += charSets.uppercase;
        if (includeLowercase?.checked) chars += charSets.lowercase;
        if (includeNumbers?.checked) chars += charSets.numbers;
        if (includeSymbols?.checked) chars += charSets.symbols;

        if (!chars) {
            alert("Please select at least one character type.");
            return "";
        }

        // Ensure at least one character from each selected set
        const selectedSets = [];
        if (includeUppercase?.checked) selectedSets.push(charSets.uppercase);
        if (includeLowercase?.checked) selectedSets.push(charSets.lowercase);
        if (includeNumbers?.checked) selectedSets.push(charSets.numbers);
        if (includeSymbols?.checked) selectedSets.push(charSets.symbols);

        // Generate initial characters from each set
        selectedSets.forEach(set => {
            const array = new Uint32Array(1);
            crypto.getRandomValues(array);
            password += set[array[0] % set.length];
        });

        // Fill the rest randomly
        const remainingLength = length - selectedSets.length;
        if (remainingLength > 0) {
            const array = new Uint32Array(remainingLength);
            crypto.getRandomValues(array);
            
            for (let i = 0; i < remainingLength; i++) {
                password += chars[array[i] % chars.length];
            }
        }

        // Shuffle the password
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    function checkPasswordStrength(password) {
        const result = zxcvbn(password);
        const strength = result.score; // 0-4
        
        const colors = ['#dc3545', '#dc3545', '#ffc107', '#28a745', '#28a745'];
        const messages = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
        
        if (passwordStrength && strengthLabel) {
            passwordStrength.style.width = `${(strength + 1) * 20}%`;
            passwordStrength.style.backgroundColor = colors[strength];
            strengthLabel.textContent = messages[strength];
            strengthLabel.style.color = colors[strength];
        }
        
        return strength;
    }

    function updateHistory() {
        if (!historyListElement) return;
        
        historyListElement.innerHTML = "";
        historyList.forEach((pwd, index) => {
            const li = document.createElement("li");
            li.className = "history-item";
            li.innerHTML = `
                <span class="password-text">${pwd}</span>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary copy-btn" data-index="${index}">
                        Copy
                    </button>
                    <button class="btn btn-outline-danger delete-btn" data-index="${index}">
                        Delete
                    </button>
                </div>
            `;
            historyListElement.appendChild(li);
        });
        
        localStorage.setItem("passwordHistory", JSON.stringify(historyList));
    }

    // Event Listeners
    if (generatePassword) {
        generatePassword.addEventListener("click", function() {
            const length = parseInt(passwordLength?.value || "16");
            if (isNaN(length) || length < 8 || length > 64) {
                alert("Password length must be between 8 and 64 characters.");
                return;
            }
            
            const password = generateSecurePassword(length);
            if (password && displayPassword) {
                displayPassword.textContent = password;
                passwordContainer.style.display = "block";
                checkPasswordStrength(password);
                historyList.unshift(password);
                if (historyList.length > 10) historyList.pop();
                updateHistory();
            }
        });
    }

    if (copyPassword) {
        copyPassword.addEventListener("click", function() {
            const password = displayPassword.textContent;
            if (password) {
                navigator.clipboard.writeText(password)
                    .then(() => {
                        copyPassword.textContent = "Copied!";
                        setTimeout(() => {
                            copyPassword.textContent = "Copy to Clipboard";
                        }, 2000);
                    })
                    .catch(() => alert("Failed to copy password"));
            }
        });
    }

    if (downloadPassword) {
        downloadPassword.addEventListener("click", function() {
            const password = displayPassword.textContent;
            if (password) {
                const blob = new Blob([password], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'password.txt';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
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

    // History item actions
    if (historyListElement) {
        historyListElement.addEventListener("click", function(event) {
            const button = event.target.closest("button");
            if (!button) return;

            const index = button.getAttribute("data-index");
            
            if (button.classList.contains("copy-btn")) {
                navigator.clipboard.writeText(historyList[index])
                    .then(() => {
                        button.textContent = "Copied!";
                        setTimeout(() => button.textContent = "Copy", 2000);
                    })
                    .catch(() => alert("Failed to copy password"));
            } else if (button.classList.contains("delete-btn")) {
                historyList.splice(index, 1);
                updateHistory();
            }
        });
    }

    // Initialize history on page load
    updateHistory();
});