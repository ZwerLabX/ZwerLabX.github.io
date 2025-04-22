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
    
    //navbar
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const indicator = document.createElement('div');
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

    // =============================================
    // START OF NEW CONSTANTS SEARCH FUNCTIONALITY
    // =============================================
    
    // ========================
// START SEARCH FUNCTIONALITY (REPLACE THIS ENTIRE BLOCK)
// ========================
    if (document.getElementById('constantsSearch')) {
        const constantsSearch = document.getElementById('constantsSearch');
        const clearSearch = document.getElementById('clearSearch');
        const searchResults = document.getElementById('searchResults');
        const constantSections = document.querySelectorAll('.constants-section');
        const navItems = document.querySelectorAll('.constant-nav-item');

        function resetAllSections() {
            // Hide all sections and remove active classes
            constantSections.forEach(section => {
                section.classList.remove('active');
            });
            navItems.forEach(nav => {
                nav.classList.remove('active');
            });
        }

        function searchConstants(query) {
            const searchTerm = query.trim().toLowerCase();
            let matches = [];

            // Reset UI
            document.querySelectorAll('.constant-card').forEach(card => {
                card.classList.remove('search-match');
                card.querySelectorAll('.highlight-match').forEach(match => {
                    match.outerHTML = match.innerHTML;
                });
            });

            if (!searchTerm) {
                searchResults.style.display = 'none';
                resetAllSections();
                // Re-activate the default section (Universal)
                document.querySelector('.constant-nav-item[data-section="universal"]').classList.add('active');
                document.getElementById('universal').classList.add('active');
                return;
            }

            // Find matches
            document.querySelectorAll('.constant-card').forEach(card => {
                const text = card.textContent.toLowerCase();
                const nameElement = card.querySelector('.constant-name');
                const valueElement = card.querySelector('.constant-value');
                const section = card.closest('.constants-section');
                const sectionName = section.id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                if (text.includes(searchTerm)) {
                    matches.push({ card, nameElement, valueElement, section, sectionName });
                }
            });

            // Display results
            searchResults.innerHTML = '';
            if (matches.length > 0) {
                searchResults.style.display = 'block';
                matches.forEach((match) => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    resultItem.innerHTML = `
                        <span class="section-badge">${match.sectionName}</span>
                        ${match.nameElement.textContent}
                        <span class="text-muted">${match.valueElement.textContent}</span>
                    `;
                    
                    resultItem.addEventListener('click', () => {
                        resetAllSections();
                        
                        // 1. Activate section and tab
                        const navItem = document.querySelector(`.constant-nav-item[data-section="${match.section.id}"]`);
                        navItem.classList.add('active');
                        match.section.classList.add('active');
                        
                        // 2. Highlight and scroll
                        match.card.classList.add('search-match');
                        match.section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        
                        // 3. Add pulse animation (NEW)
                        const activeSection = document.querySelector('.constants-section.active');
                        activeSection.style.animation = 'sectionActivePulse 0.5s';
                        setTimeout(() => {
                            activeSection.style.animation = '';
                            // Final scroll adjustment after animation
                            match.card.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
                        }, 500);
                        
                        // 4. Cleanup
                        searchResults.style.display = 'none';
                        constantsSearch.value = '';
                    });

                    searchResults.appendChild(resultItem);
                });
            } else {
                searchResults.innerHTML = `
                    <div class="no-results-item">
                        No constants found for "${searchTerm}"
                    </div>
                `;
                searchResults.style.display = 'block';
            }
        }

        // Event listeners
        constantsSearch.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => searchConstants(e.target.value), 300);
        });

        clearSearch.addEventListener('click', () => {
            constantsSearch.value = '';
            searchConstants('');
            searchResults.style.display = 'none';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchResults.style.display = 'none';
            }
        });

        let searchTimeout;
    }
// ========================
// END SEARCH FUNCTIONALITY
// ========================

// Enhanced Unit Converter
// Enhanced Unit Converter with Categories
    if (document.getElementById('unitCategory')) {
        const unitCategories = {
            length: {
                meters: 1,
                kilometers: 1000,
                centimeters: 0.01,
                millimeters: 0.001,
                inches: 0.0254,
                feet: 0.3048,
                yards: 0.9144,
                miles: 1609.344,
                nauticalMiles: 1852
            },
            mass: {
                grams: 1,
                kilograms: 1000,
                milligrams: 0.001,
                pounds: 453.592,
                ounces: 28.3495,
                tons: 907185,
                metricTons: 1000000
            },
            temperature: {
                celsius: 'C',
                fahrenheit: 'F',
                kelvin: 'K',
                rankine: 'R',
                delisle: 'De',
                newton: 'N',
                réaumur: 'Ré'
            },
            time: {
                seconds: 1,
                minutes: 60,
                hours: 3600,
                days: 86400,
                weeks: 604800,
                months: 2629800,
                years: 31557600
            },
            volume: {
                liters: 1,
                milliliters: 0.001,
                gallons: 3.78541,
                quarts: 0.946353,
                pints: 0.473176,
                cups: 0.24,
                cubicMeters: 1000,
                cubicFeet: 28.3168
            },
            velocity: {
                metersPerSecond: 1,
                kilometersPerHour: 0.277778,
                milesPerHour: 0.44704,
                feetPerSecond: 0.3048,
                knots: 0.514444
            },
            pressure: {
                pascals: 1,
                kilopascals: 1000,
                megapascals: 1000000,
                psi: 6894.76,
                bar: 100000,
                atmosphere: 101325,
                torr: 133.322
            },
            energy: {
                joules: 1,
                kilojoules: 1000,
                calories: 4.184,
                kilocalories: 4184,
                wattHours: 3600,
                electronvolts: 1.60218e-19
            },
            power: {
                watts: 1,
                kilowatts: 1000,
                horsepower: 745.7,
                btuPerHour: 0.293071,
                footPoundsPerMinute: 0.022597
            }
        };

        const unitValue = document.getElementById('unitValue');
        const unitResult = document.getElementById('unitResult');
        const unitCategory = document.getElementById('unitCategory');
        const unitFrom = document.getElementById('unitFrom');
        const unitTo = document.getElementById('unitTo');
        const swapBtn = document.getElementById('swapUnits');
        const historyList = document.getElementById('conversionHistory');
        let conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];
        let lastConversionKey = null;
        let historyTimeout;

        function populateUnits() {
            const category = unitCategory.value;
            const units = unitCategories[category];
            
            // Clear existing options
            unitFrom.innerHTML = '';
            unitTo.innerHTML = '';
            
            // Populate both From and To dropdowns
            Object.keys(units).forEach(unit => {
                const fromOption = document.createElement('option');
                const toOption = document.createElement('option');
                
                fromOption.value = unit;
                fromOption.textContent = formatUnitName(unit);
                
                toOption.value = unit;
                toOption.textContent = formatUnitName(unit);
                
                unitFrom.appendChild(fromOption);
                unitTo.appendChild(toOption);
            });
            
            // Set default selections
            if (category === 'temperature') {
                unitFrom.value = 'celsius';
                unitTo.value = 'fahrenheit';
            } else {
                unitFrom.value = Object.keys(units)[0];
                unitTo.value = Object.keys(units)[1];
            }
            
            convertUnits();
        }

        function formatUnitName(unit) {
            return unit.replace(/([A-Z])/g, ' $1').replace(/(^|\s)\S/g, l => l.toUpperCase());
        }

        function convertUnits() {
            const value = parseFloat(unitValue.value);
            if (isNaN(value)) {
                unitResult.value = '';
                return;
            }

            const category = unitCategory.value;
            const fromUnit = unitFrom.value;
            const toUnit = unitTo.value;
            
            clearTimeout(historyTimeout);
            
            if (category === 'temperature') {
                unitResult.value = convertTemperature(value, fromUnit, toUnit);
            } else {
                const baseValue = value * unitCategories[category][fromUnit];
                unitResult.value = (baseValue / unitCategories[category][toUnit]).toFixed(6);
            }

            historyTimeout = setTimeout(() => {
                addToHistory(value, fromUnit, unitResult.value, toUnit, category);
            }, 1500);
        }

        function convertTemperature(value, from, to) {
            if (from === to) return value.toFixed(2);
            
            // Convert to Kelvin first
            let kelvin;
            switch (from) {
                case 'celsius': kelvin = value + 273.15; break;
                case 'fahrenheit': kelvin = (value + 459.67) * 5/9; break;
                case 'rankine': kelvin = value * 5/9; break;
                case 'delisle': kelvin = 373.15 - value * 2/3; break;
                case 'newton': kelvin = value * 100/33 + 273.15; break;
                case 'réaumur': kelvin = value * 5/4 + 273.15; break;
                default: kelvin = value;
            }
            
            // Convert from Kelvin to target
            let result;
            switch (to) {
                case 'celsius': result = kelvin - 273.15; break;
                case 'fahrenheit': result = (kelvin * 9/5) - 459.67; break;
                case 'rankine': result = kelvin * 9/5; break;
                case 'delisle': result = (373.15 - kelvin) * 3/2; break;
                case 'newton': result = (kelvin - 273.15) * 33/100; break;
                case 'réaumur': result = (kelvin - 273.15) * 4/5; break;
                default: result = kelvin;
            }
            
            return result.toFixed(6);
        }

        function addToHistory(value, fromUnit, result, toUnit, category) {
            const historyContainer = document.getElementById('conversionHistory');
            historyContainer.classList.add('saving');
            setTimeout(() => historyContainer.classList.remove('saving'), 500);

            if (!value || !result) return;
            
            const conversionKey = `${value}_${fromUnit}_${toUnit}_${category}`;
            if (conversionKey === lastConversionKey) return;
            
            lastConversionKey = conversionKey;
            conversionHistory.unshift({
                value,
                fromUnit: formatUnitName(fromUnit),
                result,
                toUnit: formatUnitName(toUnit),
                category,
                timestamp: new Date().toLocaleTimeString()
            });

            if (conversionHistory.length > 5) conversionHistory.pop();
            localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
            updateHistory();
        }

        function updateHistory() {
            historyList.innerHTML = '';
            conversionHistory.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${item.value} ${item.fromUnit} → ${item.result} ${item.toUnit}
                    <span class="text-muted">${item.category}</span>
                    <span class="timestamp">${item.timestamp}</span>
                `;
                historyList.appendChild(li);
            });
        }

        // Event listeners
        unitCategory.addEventListener('change', populateUnits);
        unitFrom.addEventListener('change', convertUnits);
        unitTo.addEventListener('change', convertUnits);
        unitValue.addEventListener('input', convertUnits);
        
        swapBtn.addEventListener('click', () => {
            [unitFrom.value, unitTo.value] = [unitTo.value, unitFrom.value];
            convertUnits();
        });

        // Initial setup
        populateUnits();
        updateHistory();
    }
    // Periodic Table Data and Functionality
    const elements = [
        {
          symbol: "H", name: "Hydrogen", number: 1,
          mass: 1.008, electronegativity: 2.20,
          config: "1s¹", category: "nonmetal",
          discovered: 1766
        },
        {
          symbol: "He", name: "Helium", number: 2,
          mass: 4.0026, electronegativity: null,
          config: "1s²", category: "noble-gas",
          discovered: 1868
        },
        {
          symbol: "Li", name: "Lithium", number: 3,
          mass: 6.94, electronegativity: 0.98,
          config: "[He] 2s¹", category: "alkali-metal",
          discovered: 1817
        },
        {
          symbol: "Be", name: "Beryllium", number: 4,
          mass: 9.0122, electronegativity: 1.57,
          config: "[He] 2s²", category: "alkaline-earth",
          discovered: 1798
        },
        {
          symbol: "B", name: "Boron", number: 5,
          mass: 10.81, electronegativity: 2.04,
          config: "[He] 2s² 2p¹", category: "metalloid",
          discovered: 1808
        },
        {
          symbol: "C", name: "Carbon", number: 6,
          mass: 12.011, electronegativity: 2.55,
          config: "[He] 2s² 2p²", category: "nonmetal",
          discovered: "Ancient"
        },
        {
          symbol: "N", name: "Nitrogen", number: 7,
          mass: 14.007, electronegativity: 3.04,
          config: "[He] 2s² 2p³", category: "nonmetal",
          discovered: 1772
        },
        {
          symbol: "O", name: "Oxygen", number: 8,
          mass: 15.999, electronegativity: 3.44,
          config: "[He] 2s² 2p⁴", category: "nonmetal",
          discovered: 1774
        },
        {
          symbol: "F", name: "Fluorine", number: 9,
          mass: 18.998, electronegativity: 3.98,
          config: "[He] 2s² 2p⁵", category: "halogen",
          discovered: 1886
        },
        {
          symbol: "Ne", name: "Neon", number: 10,
          mass: 20.180, electronegativity: null,
          config: "[He] 2s² 2p⁶", category: "noble-gas",
          discovered: 1898
        },
        {
          symbol: "Na", name: "Sodium", number: 11,
          mass: 22.990, electronegativity: 0.93,
          config: "[Ne] 3s¹", category: "alkali-metal",
          discovered: 1807
        },
        {
          symbol: "Mg", name: "Magnesium", number: 12,
          mass: 24.305, electronegativity: 1.31,
          config: "[Ne] 3s²", category: "alkaline-earth",
          discovered: 1755
        },
        {
          symbol: "Al", name: "Aluminum", number: 13,
          mass: 26.982, electronegativity: 1.61,
          config: "[Ne] 3s² 3p¹", category: "post-transition-metal",
          discovered: 1825
        },
        {
          symbol: "Si", name: "Silicon", number: 14,
          mass: 28.085, electronegativity: 1.90,
          config: "[Ne] 3s² 3p²", category: "metalloid",
          discovered: 1824
        },
        {
          symbol: "P", name: "Phosphorus", number: 15,
          mass: 30.974, electronegativity: 2.19,
          config: "[Ne] 3s² 3p³", category: "nonmetal",
          discovered: 1669
        },
        {
          symbol: "S", name: "Sulfur", number: 16,
          mass: 32.06, electronegativity: 2.58,
          config: "[Ne] 3s² 3p⁴", category: "nonmetal",
          discovered: "Ancient"
        },
        {
          symbol: "Cl", name: "Chlorine", number: 17,
          mass: 35.45, electronegativity: 3.16,
          config: "[Ne] 3s² 3p⁵", category: "halogen",
          discovered: 1774
        },
        {
          symbol: "Ar", name: "Argon", number: 18,
          mass: 39.948, electronegativity: null,
          config: "[Ne] 3s² 3p⁶", category: "noble-gas",
          discovered: 1894
        },
        {
          symbol: "K", name: "Potassium", number: 19,
          mass: 39.098, electronegativity: 0.82,
          config: "[Ar] 4s¹", category: "alkali-metal",
          discovered: 1807
        },
        {
          symbol: "Ca", name: "Calcium", number: 20,
          mass: 40.078, electronegativity: 1.00,
          config: "[Ar] 4s²", category: "alkaline-earth",
          discovered: 1808
        },
        {
          symbol: "Sc", name: "Scandium", number: 21,
          mass: 44.956, electronegativity: 1.36,
          config: "[Ar] 3d¹ 4s²", category: "transition-metal",
          discovered: 1879
        },
        {
          symbol: "Ti", name: "Titanium", number: 22,
          mass: 47.867, electronegativity: 1.54,
          config: "[Ar] 3d² 4s²", category: "transition-metal",
          discovered: 1791
        },
        {
          symbol: "V", name: "Vanadium", number: 23,
          mass: 50.942, electronegativity: 1.63,
          config: "[Ar] 3d³ 4s²", category: "transition-metal",
          discovered: 1801
        },
        {
          symbol: "Cr", name: "Chromium", number: 24,
          mass: 51.996, electronegativity: 1.66,
          config: "[Ar] 3d⁵ 4s¹", category: "transition-metal",
          discovered: 1797
        },
        {
          symbol: "Mn", name: "Manganese", number: 25,
          mass: 54.938, electronegativity: 1.55,
          config: "[Ar] 3d⁵ 4s²", category: "transition-metal",
          discovered: 1774
        },
        {
          symbol: "Fe", name: "Iron", number: 26,
          mass: 55.845, electronegativity: 1.83,
          config: "[Ar] 3d⁶ 4s²", category: "transition-metal",
          discovered: "Ancient"
        },
        {
          symbol: "Co", name: "Cobalt", number: 27,
          mass: 58.933, electronegativity: 1.88,
          config: "[Ar] 3d⁷ 4s²", category: "transition-metal",
          discovered: 1735
        },
        {
          symbol: "Ni", name: "Nickel", number: 28,
          mass: 58.693, electronegativity: 1.91,
          config: "[Ar] 3d⁸ 4s²", category: "transition-metal",
          discovered: 1751
        },
        {
          symbol: "Cu", name: "Copper", number: 29,
          mass: 63.546, electronegativity: 1.90,
          config: "[Ar] 3d¹⁰ 4s¹", category: "transition-metal",
          discovered: "Ancient"
        },
        {
          symbol: "Zn", name: "Zinc", number: 30,
          mass: 65.38, electronegativity: 1.65,
          config: "[Ar] 3d¹⁰ 4s²", category: "transition-metal",
          discovered: 1746
        },
        {
          symbol: "Ga", name: "Gallium", number: 31,
          mass: 69.723, electronegativity: 1.81,
          config: "[Ar] 3d¹⁰ 4s² 4p¹", category: "post-transition-metal",
          discovered: 1875
        },
        {
          symbol: "Ge", name: "Germanium", number: 32,
          mass: 72.630, electronegativity: 2.01,
          config: "[Ar] 3d¹⁰ 4s² 4p²", category: "metalloid",
          discovered: 1886
        },
        {
          symbol: "As", name: "Arsenic", number: 33,
          mass: 74.922, electronegativity: 2.18,
          config: "[Ar] 3d¹⁰ 4s² 4p³", category: "metalloid",
          discovered: "Ancient"
        },
        {
          symbol: "Se", name: "Selenium", number: 34,
          mass: 78.971, electronegativity: 2.55,
          config: "[Ar] 3d¹⁰ 4s² 4p⁴", category: "nonmetal",
          discovered: 1817
        },
        {
          symbol: "Br", name: "Bromine", number: 35,
          mass: 79.904, electronegativity: 2.96,
          config: "[Ar] 3d¹⁰ 4s² 4p⁵", category: "halogen",
          discovered: 1826
        },
        {
          symbol: "Kr", name: "Krypton", number: 36,
          mass: 83.798, electronegativity: 3.00,
          config: "[Ar] 3d¹⁰ 4s² 4p⁶", category: "noble-gas",
          discovered: 1898
        },
        {
          symbol: "Rb", name: "Rubidium", number: 37,
          mass: 85.468, electronegativity: 0.82,
          config: "[Kr] 5s¹", category: "alkali-metal",
          discovered: 1861
        },
        {
          symbol: "Sr", name: "Strontium", number: 38,
          mass: 87.62, electronegativity: 0.95,
          config: "[Kr] 5s²", category: "alkaline-earth",
          discovered: 1790
        },
        {
          symbol: "Y", name: "Yttrium", number: 39,
          mass: 88.906, electronegativity: 1.22,
          config: "[Kr] 4d¹ 5s²", category: "transition-metal",
          discovered: 1794
        },
        {
          symbol: "Zr", name: "Zirconium", number: 40,
          mass: 91.224, electronegativity: 1.33,
          config: "[Kr] 4d² 5s²", category: "transition-metal",
          discovered: 1789
        },
        {
          symbol: "Nb", name: "Niobium", number: 41,
          mass: 92.906, electronegativity: 1.6,
          config: "[Kr] 4d⁴ 5s¹", category: "transition-metal",
          discovered: 1801
        },
        {
          symbol: "Mo", name: "Molybdenum", number: 42,
          mass: 95.95, electronegativity: 2.16,
          config: "[Kr] 4d⁵ 5s¹", category: "transition-metal",
          discovered: 1781
        },
        {
          symbol: "Tc", name: "Technetium", number: 43,
          mass: 98, electronegativity: 1.9,
          config: "[Kr] 4d⁵ 5s²", category: "transition-metal",
          discovered: 1937
        },
        {
          symbol: "Ru", name: "Ruthenium", number: 44,
          mass: 101.07, electronegativity: 2.2,
          config: "[Kr] 4d⁷ 5s¹", category: "transition-metal",
          discovered: 1844
        },
        {
          symbol: "Rh", name: "Rhodium", number: 45,
          mass: 102.91, electronegativity: 2.28,
          config: "[Kr] 4d⁸ 5s¹", category: "transition-metal",
          discovered: 1803
        },
        {
          symbol: "Pd", name: "Palladium", number: 46,
          mass: 106.42, electronegativity: 2.20,
          config: "[Kr] 4d¹⁰", category: "transition-metal",
          discovered: 1803
        },
        {
          symbol: "Ag", name: "Silver", number: 47,
          mass: 107.87, electronegativity: 1.93,
          config: "[Kr] 4d¹⁰ 5s¹", category: "transition-metal",
          discovered: "Ancient"
        },
        {
          symbol: "Cd", name: "Cadmium", number: 48,
          mass: 112.41, electronegativity: 1.69,
          config: "[Kr] 4d¹⁰ 5s²", category: "transition-metal",
          discovered: 1817
        },
        {
          symbol: "In", name: "Indium", number: 49,
          mass: 114.82, electronegativity: 1.78,
          config: "[Kr] 4d¹⁰ 5s² 5p¹", category: "post-transition-metal",
          discovered: 1863
        },
        {
          symbol: "Sn", name: "Tin", number: 50,
          mass: 118.71, electronegativity: 1.96,
          config: "[Kr] 4d¹⁰ 5s² 5p²", category: "post-transition-metal",
          discovered: "Ancient"
        },
        {
          symbol: "Sb", name: "Antimony", number: 51,
          mass: 121.76, electronegativity: 2.05,
          config: "[Kr] 4d¹⁰ 5s² 5p³", category: "metalloid",
          discovered: "Ancient"
        },
        {
          symbol: "Te", name: "Tellurium", number: 52,
          mass: 127.60, electronegativity: 2.1,
          config: "[Kr] 4d¹⁰ 5s² 5p⁴", category: "metalloid",
          discovered: 1782
        },
        {
          symbol: "I", name: "Iodine", number: 53,
          mass: 126.90, electronegativity: 2.66,
          config: "[Kr] 4d¹⁰ 5s² 5p⁵", category: "halogen",
          discovered: 1811
        },
        {
          symbol: "Xe", name: "Xenon", number: 54,
          mass: 131.29, electronegativity: 2.6,
          config: "[Kr] 4d¹⁰ 5s² 5p⁶", category: "noble-gas",
          discovered: 1898
        },
        {
          symbol: "Cs", name: "Cesium", number: 55,
          mass: 132.91, electronegativity: 0.79,
          config: "[Xe] 6s¹", category: "alkali-metal",
          discovered: 1860
        },
        {
          symbol: "Ba", name: "Barium", number: 56,
          mass: 137.33, electronegativity: 0.89,
          config: "[Xe] 6s²", category: "alkaline-earth",
          discovered: 1808
        },
        {
          symbol: "La", name: "Lanthanum", number: 57,
          mass: 138.91, electronegativity: 1.10,
          config: "[Xe] 5d¹ 6s²", category: "lanthanide",
          discovered: 1839
        },
        {
          symbol: "Ce", name: "Cerium", number: 58,
          mass: 140.12, electronegativity: 1.12,
          config: "[Xe] 4f¹ 5d¹ 6s²", category: "lanthanide",
          discovered: 1803
        },
        {
          symbol: "Pr", name: "Praseodymium", number: 59,
          mass: 140.91, electronegativity: 1.13,
          config: "[Xe] 4f³ 6s²", category: "lanthanide",
          discovered: 1885
        },
        {
          symbol: "Nd", name: "Neodymium", number: 60,
          mass: 144.24, electronegativity: 1.14,
          config: "[Xe] 4f⁴ 6s²", category: "lanthanide",
          discovered: 1885
        },
        {
          symbol: "Pm", name: "Promethium", number: 61,
          mass: 145, electronegativity: 1.13,
          config: "[Xe] 4f⁵ 6s²", category: "lanthanide",
          discovered: 1945
        },
        {
          symbol: "Sm", name: "Samarium", number: 62,
          mass: 150.36, electronegativity: 1.17,
          config: "[Xe] 4f⁶ 6s²", category: "lanthanide",
          discovered: 1879
        },
        {
          symbol: "Eu", name: "Europium", number: 63,
          mass: 151.96, electronegativity: 1.2,
          config: "[Xe] 4f⁷ 6s²", category: "lanthanide",
          discovered: 1901
        },
        {
          symbol: "Gd", name: "Gadolinium", number: 64,
          mass: 157.25, electronegativity: 1.2,
          config: "[Xe] 4f⁷ 5d¹ 6s²", category: "lanthanide",
          discovered: 1880
        },
        {
          symbol: "Tb", name: "Terbium", number: 65,
          mass: 158.93, electronegativity: 1.2,
          config: "[Xe] 4f⁹ 6s²", category: "lanthanide",
          discovered: 1843
        },
        {
          symbol: "Dy", name: "Dysprosium", number: 66,
          mass: 162.50, electronegativity: 1.22,
          config: "[Xe] 4f¹⁰ 6s²", category: "lanthanide",
          discovered: 1886
        },
        {
          symbol: "Ho", name: "Holmium", number: 67,
          mass: 164.93, electronegativity: 1.23,
          config: "[Xe] 4f¹¹ 6s²", category: "lanthanide",
          discovered: 1878
        },
        {
          symbol: "Er", name: "Erbium", number: 68,
          mass: 167.26, electronegativity: 1.24,
          config: "[Xe] 4f¹² 6s²", category: "lanthanide",
          discovered: 1842
        },
        {
          symbol: "Tm", name: "Thulium", number: 69,
          mass: 168.93, electronegativity: 1.25,
          config: "[Xe] 4f¹³ 6s²", category: "lanthanide",
          discovered: 1879
        },
        {
          symbol: "Yb", name: "Ytterbium", number: 70,
          mass: 173.05, electronegativity: 1.1,
          config: "[Xe] 4f¹⁴ 6s²", category: "lanthanide",
          discovered: 1878
        },
        {
          symbol: "Lu", name: "Lutetium", number: 71,
          mass: 174.97, electronegativity: 1.27,
          config: "[Xe] 4f¹⁴ 5d¹ 6s²", category: "lanthanide",
          discovered: 1907
        },
        {
          symbol: "Hf", name: "Hafnium", number: 72,
          mass: 178.49, electronegativity: 1.3,
          config: "[Xe] 4f¹⁴ 5d² 6s²", category: "transition-metal",
          discovered: 1923
        },
        {
          symbol: "Ta", name: "Tantalum", number: 73,
          mass: 180.95, electronegativity: 1.5,
          config: "[Xe] 4f¹⁴ 5d³ 6s²", category: "transition-metal",
          discovered: 1802
        },
        {
          symbol: "W", name: "Tungsten", number: 74,
          mass: 183.84, electronegativity: 2.36,
          config: "[Xe] 4f¹⁴ 5d⁴ 6s²", category: "transition-metal",
          discovered: 1783
        },
        {
          symbol: "Re", name: "Rhenium", number: 75,
          mass: 186.21, electronegativity: 1.9,
          config: "[Xe] 4f¹⁴ 5d⁵ 6s²", category: "transition-metal",
          discovered: 1925
        },
        {
          symbol: "Os", name: "Osmium", number: 76,
          mass: 190.23, electronegativity: 2.2,
          config: "[Xe] 4f¹⁴ 5d⁶ 6s²", category: "transition-metal",
          discovered: 1803
        },
        {
          symbol: "Ir", name: "Iridium", number: 77,
          mass: 192.22, electronegativity: 2.20,
          config: "[Xe] 4f¹⁴ 5d⁷ 6s²", category: "transition-metal",
          discovered: 1803
        },
        {
          symbol: "Pt", name: "Platinum", number: 78,
          mass: 195.08, electronegativity: 2.28,
          config: "[Xe] 4f¹⁴ 5d⁹ 6s¹", category: "transition-metal",
          discovered: 1735
        },
        {
          symbol: "Au", name: "Gold", number: 79,
          mass: 196.97, electronegativity: 2.54,
          config: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹", category: "transition-metal",
          discovered: "Ancient"
        },
        {
          symbol: "Hg", name: "Mercury", number: 80,
          mass: 200.59, electronegativity: 2.00,
          config: "[Xe] 4f¹⁴ 5d¹⁰ 6s²", category: "transition-metal",
          discovered: "Ancient"
        },
        {
          symbol: "Tl", name: "Thallium", number: 81,
          mass: 204.38, electronegativity: 1.62,
          config: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹", category: "post-transition-metal",
          discovered: 1861
        },
        {
          symbol: "Pb", name: "Lead", number: 82,
          mass: 207.2, electronegativity: 2.33,
          config: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²", category: "post-transition-metal",
          discovered: "Ancient"
        },
        {
          symbol: "Bi", name: "Bismuth", number: 83,
          mass: 208.98, electronegativity: 2.02,
          config: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³", category: "post-transition-metal",
          discovered: "Ancient"
        },
        {
          symbol: "Po", name: "Polonium", number: 84,
          mass: 209, electronegativity: 2.0,
          config: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴", category: "metalloid",
          discovered: 1898
        },
        {
          symbol: "At", name: "Astatine", number: 85,
          mass: 210, electronegativity: 2.2,
          config: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵", category: "halogen",
          discovered: 1940
        },
        {
          symbol: "Rn", name: "Radon", number: 86,
          mass: 222, electronegativity: null,
          config: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶", category: "noble-gas",
          discovered: 1900
        },
        {
          symbol: "Fr", name: "Francium", number: 87,
          mass: 223, electronegativity: 0.7,
          config: "[Rn] 7s¹", category: "alkali-metal",
          discovered: 1939
        },
        {
          symbol: "Ra", name: "Radium", number: 88,
          mass: 226, electronegativity: 0.9,
          config: "[Rn] 7s²", category: "alkaline-earth",
          discovered: 1898
        },
        {
          symbol: "Ac", name: "Actinium", number: 89,
          mass: 227, electronegativity: 1.1,
          config: "[Rn] 6d¹ 7s²", category: "actinide",
          discovered: 1899
        },
        {
          symbol: "Th", name: "Thorium", number: 90,
          mass: 232.04, electronegativity: 1.3,
          config: "[Rn] 6d² 7s²", category: "actinide",
          discovered: 1829
        },
        {
          symbol: "Pa", name: "Protactinium", number: 91,
          mass: 231.04, electronegativity: 1.5,
          config: "[Rn] 5f² 6d¹ 7s²", category: "actinide",
          discovered: 1913
        },
        {
          symbol: "U", name: "Uranium", number: 92,
          mass: 238.03, electronegativity: 1.38,
          config: "[Rn] 5f³ 6d¹ 7s²", category: "actinide",
          discovered: 1789
        },
        {
          symbol: "Np", name: "Neptunium", number: 93,
          mass: 237, electronegativity: 1.36,
          config: "[Rn] 5f⁴ 6d¹ 7s²", category: "actinide",
          discovered: 1940
        },
        {
          symbol: "Pu", name: "Plutonium", number: 94,
          mass: 244, electronegativity: 1.28,
          config: "[Rn] 5f⁶ 7s²", category: "actinide",
          discovered: 1940
        },
        {
          symbol: "Am", name: "Americium", number: 95,
          mass: 243, electronegativity: 1.13,
          config: "[Rn] 5f⁷ 7s²", category: "actinide",
          discovered: 1944
        },
        {
          symbol: "Cm", name: "Curium", number: 96,
          mass: 247, electronegativity: 1.28,
          config: "[Rn] 5f⁷ 6d¹ 7s²", category: "actinide",
          discovered: 1944
        },
        {
          symbol: "Bk", name: "Berkelium", number: 97,
          mass: 247, electronegativity: 1.3,
          config: "[Rn] 5f⁹ 7s²", category: "actinide",
          discovered: 1949
        },
        {
          symbol: "Cf", name: "Californium", number: 98,
          mass: 251, electronegativity: 1.3,
          config: "[Rn] 5f¹⁰ 7s²", category: "actinide",
          discovered: 1950
        },
        {
          symbol: "Es", name: "Einsteinium", number: 99,
          mass: 252, electronegativity: 1.3,
          config: "[Rn] 5f¹¹ 7s²", category: "actinide",
          discovered: 1952
        },
        {
          symbol: "Fm", name: "Fermium", number: 100,
          mass: 257, electronegativity: 1.3,
          config: "[Rn] 5f¹² 7s²", category: "actinide",
          discovered: 1952
        },
        {
          symbol: "Md", name: "Mendelevium", number: 101,
          mass: 258, electronegativity: 1.3,
          config: "[Rn] 5f¹³ 7s²", category: "actinide",
          discovered: 1955
        },
        {
          symbol: "No", name: "Nobelium", number: 102,
          mass: 259, electronegativity: 1.3,
          config: "[Rn] 5f¹⁴ 7s²", category: "actinide",
          discovered: 1958
        },
        {
          symbol: "Lr", name: "Lawrencium", number: 103,
          mass: 262, electronegativity: 1.3,
          config: "[Rn] 5f¹⁴ 6d¹ 7s²", category: "actinide",
          discovered: 1961
        },
        {
          symbol: "Rf", name: "Rutherfordium", number: 104,
          mass: 267, electronegativity: null,
          config: "[Rn] 5f¹⁴ 6d² 7s²", category: "transition-metal",
          discovered: 1969
        },
        {
          symbol: "Db", name: "Dubnium", number: 105,
          mass: 268, electronegativity: null,
          config: "[Rn] 5f¹⁴ 6d³ 7s²", category: "transition-metal",
          discovered: 1970
        },
        {
          symbol: "Sg", name: "Seaborgium", number: 106,
          mass: 269, electronegativity: null,
          config: "[Rn] 5f¹⁴ 6d⁴ 7s²", category: "transition-metal",
          discovered: 1974
        },
        {
          symbol: "Bh", name: "Bohrium", number: 107,
          mass: 270, electronegativity: null,
          config: "[Rn] 5f¹⁴ 6d⁵ 7s²", category: "transition-metal",
          discovered: 1981
        },
        {
          symbol: "Hs", name: "Hassium", number: 108,
          mass: 269, electronegativity: null,
          config: "[Rn] 5f¹⁴ 6d⁶ 7s²", category: "transition-metal",
          discovered: 1984
        },
        {
          symbol: "Mt", name: "Meitnerium", number: 109,
          mass: 278, electronegativity: null,
          config: "[Rn] 5f¹⁴ 6d⁷ 7s²", category: "unknown",
          discovered: 1982
        },
        {
          symbol: "Ds", name: "Darmstadtium", number: 110,
          mass: 281, electronegativity: null,
          config: "[Rn] 5f¹⁴ 6d⁸ 7s²", category: "unknown",
          discovered: 1994
        },
        {
          symbol: "Rg", name: "Roentgenium", number: 111,
          mass: 282, electronegativity: null,
          config: "[Rn] 5f¹⁴ 6d⁹ 7s²", category: "unknown",
          discovered: 1994
        },
        {
          symbol: "Cn", name: "Copernicium", number: 112,
          mass: 285, electronegativity: null,
          config: "[Rn] 5f¹⁴ 6d¹⁰ 7s²", category: "unknown",
          discovered: 1996
        },
        {
          symbol: "Nh", name: "Nihonium", number: 113,
          mass: 286, electronegativity: null,
          config: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹", category: "unknown",
          discovered: 2003
        },
        {
          symbol: "Fl", name: "Flerovium", number: 114,
          mass: 289, electronegativity: null,
          config: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²", category: "unknown",
          discovered: 1998
        },
        {
          symbol: "Mc", name: "Moscovium", number: 115,
          mass: 290, electronegativity: null,
          config: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³", category: "unknown",
          discovered: 2003
        },
        {
          symbol: "Lv", name: "Livermorium", number: 116,
          mass: 293, electronegativity: null,
          config: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴", category: "unknown",
          discovered: 2000
        },
        {
          symbol: "Ts", name: "Tennessine", number: 117,
          mass: 294, electronegativity: null,
          config: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵", category: "unknown",
          discovered: 2010
        },
        {
          symbol: "Og", name: "Oganesson", number: 118,
          mass: 294, electronegativity: null,
          config: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶",
          category: "unknown", discovered: 2006
        }
      ];
    
      elements.forEach(element => {
        // Determine block based on electron configuration
        if (element.config.includes('f')) element.block = 'f';
        else if (element.config.includes('d')) element.block = 'd';
        else if (element.config.includes('p')) element.block = 'p';
        else if (element.config.includes('s')) element.block = 's';
        
        // Determine period (row)
        const periodMatch = element.config.match(/[1-7][s|p|d|f]/);
        element.period = periodMatch ? parseInt(periodMatch[0][0]) : 1;
    });

    function createPeriodicTable() {
        const container = document.querySelector('.periodic-table-grid');
        
        // Clear existing elements
        container.innerHTML = '';
        
        // Create a position map for the standard periodic table layout
        const positionMap = createPositionMap();
        
        elements.forEach(element => {
            const div = document.createElement('div');
            div.className = `element-box ${element.category}`;
            
            // Set block and period attributes
            div.dataset.block = element.block;
            div.dataset.period = element.period;
            
            // Set position based on our map
            const pos = positionMap[element.number];
            if (pos) {
                div.style.gridColumn = pos.col;
                div.style.gridRow = pos.row;
            }
            
            div.innerHTML = `
                <div class="element-number">${element.number}</div>
                <div class="element-symbol">${element.symbol}</div>
                <div class="element-details-popup">
                    <strong>${element.name}</strong><br>
                    Atomic Mass: ${element.mass}<br>
                    Electronegativity: ${element.electronegativity || 'N/A'}<br>
                    Config: ${element.config}
                </div>
            `;
            
            // Add hover effects
            setupHoverEffects(div);
            
            container.appendChild(div);
        });
    }
    
    function createPositionMap() {
        // This map defines where each element should be placed in the grid
        // Format: atomic number: {col: 'x / span y', row: 'z'}
        return {
            // Period 1
            1: {col: '1', row: '1'},  // H
            2: {col: '18', row: '1'}, // He
            
            // Period 2
            3: {col: '1', row: '2'},  // Li
            4: {col: '2', row: '2'},  // Be
            // Skip to p-block
            5: {col: '13', row: '2'}, // B
            6: {col: '14', row: '2'}, // C
            7: {col: '15', row: '2'}, // N
            8: {col: '16', row: '2'}, // O
            9: {col: '17', row: '2'}, // F
            10: {col: '18', row: '2'}, // Ne
            
            // Period 3
            11: {col: '1', row: '3'}, // Na
            12: {col: '2', row: '3'}, // Mg
            // Skip to p-block
            13: {col: '13', row: '3'}, // Al
            14: {col: '14', row: '3'}, // Si
            15: {col: '15', row: '3'}, // P
            16: {col: '16', row: '3'}, // S
            17: {col: '17', row: '3'}, // Cl
            18: {col: '18', row: '3'}, // Ar
            
            // Period 4
            19: {col: '1', row: '4'}, // K
            20: {col: '2', row: '4'}, // Ca
            // d-block starts
            21: {col: '3', row: '4'}, // Sc
            22: {col: '4', row: '4'}, // Ti
            23: {col: '5', row: '4'}, // V
            24: {col: '6', row: '4'}, // Cr
            25: {col: '7', row: '4'}, // Mn
            26: {col: '8', row: '4'}, // Fe
            27: {col: '9', row: '4'}, // Co
            28: {col: '10', row: '4'}, // Ni
            29: {col: '11', row: '4'}, // Cu
            30: {col: '12', row: '4'}, // Zn
            // p-block
            31: {col: '13', row: '4'}, // Ga
            32: {col: '14', row: '4'}, // Ge
            33: {col: '15', row: '4'}, // As
            34: {col: '16', row: '4'}, // Se
            35: {col: '17', row: '4'}, // Br
            36: {col: '18', row: '4'}, // Kr
            
            // Period 5 (similar to period 4)
            37: {col: '1', row: '5'}, // Rb
            38: {col: '2', row: '5'}, // Sr
            // d-block
            39: {col: '3', row: '5'}, // Y
            40: {col: '4', row: '5'}, // Zr
            41: {col: '5', row: '5'}, // Nb
            42: {col: '6', row: '5'}, // Mo
            43: {col: '7', row: '5'}, // Tc
            44: {col: '8', row: '5'}, // Ru
            45: {col: '9', row: '5'}, // Rh
            46: {col: '10', row: '5'}, // Pd
            47: {col: '11', row: '5'}, // Ag
            48: {col: '12', row: '5'}, // Cd
            // p-block
            49: {col: '13', row: '5'}, // In
            50: {col: '14', row: '5'}, // Sn
            51: {col: '15', row: '5'}, // Sb
            52: {col: '16', row: '5'}, // Te
            53: {col: '17', row: '5'}, // I
            54: {col: '18', row: '5'}, // Xe
            
            // Period 6 (with lanthanides)
            55: {col: '1', row: '6'}, // Cs
            56: {col: '2', row: '6'}, // Ba
            // Lanthanides (f-block) - will be placed in separate rows
            57: {col: '3', row: '9'}, // La
            58: {col: '4', row: '9'}, // Ce
            59: {col: '5', row: '9'}, // Pr
            60: {col: '6', row: '9'}, // Nd
            61: {col: '7', row: '9'}, // Pm
            62: {col: '8', row: '9'}, // Sm
            63: {col: '9', row: '9'}, // Eu
            64: {col: '10', row: '9'}, // Gd
            65: {col: '11', row: '9'}, // Tb
            66: {col: '12', row: '9'}, // Dy
            67: {col: '13', row: '9'}, // Ho
            68: {col: '14', row: '9'}, // Er
            69: {col: '15', row: '9'}, // Tm
            70: {col: '16', row: '9'}, // Yb
            71: {col: '17', row: '9'}, // Lu
            // Continue with d-block
            72: {col: '3', row: '6'}, // Hf
            73: {col: '4', row: '6'}, // Ta
            74: {col: '5', row: '6'}, // W
            75: {col: '6', row: '6'}, // Re
            76: {col: '7', row: '6'}, // Os
            77: {col: '8', row: '6'}, // Ir
            78: {col: '9', row: '6'}, // Pt
            79: {col: '10', row: '6'}, // Au
            80: {col: '11', row: '6'}, // Hg
            // p-block
            81: {col: '13', row: '6'}, // Tl
            82: {col: '14', row: '6'}, // Pb
            83: {col: '15', row: '6'}, // Bi
            84: {col: '16', row: '6'}, // Po
            85: {col: '17', row: '6'}, // At
            86: {col: '18', row: '6'}, // Rn
            
            // Period 7 (with actinides)
            87: {col: '1', row: '7'}, // Fr
            88: {col: '2', row: '7'}, // Ra
            // Actinides (f-block) - separate rows
            89: {col: '3', row: '10'}, // Ac
            90: {col: '4', row: '10'}, // Th
            91: {col: '5', row: '10'}, // Pa
            92: {col: '6', row: '10'}, // U
            93: {col: '7', row: '10'}, // Np
            94: {col: '8', row: '10'}, // Pu
            95: {col: '9', row: '10'}, // Am
            96: {col: '10', row: '10'}, // Cm
            97: {col: '11', row: '10'}, // Bk
            98: {col: '12', row: '10'}, // Cf
            99: {col: '13', row: '10'}, // Es
            100: {col: '14', row: '10'}, // Fm
            101: {col: '15', row: '10'}, // Md
            102: {col: '16', row: '10'}, // No
            103: {col: '17', row: '10'}, // Lr
            // Continue with d-block
            104: {col: '3', row: '7'}, // Rf
            105: {col: '4', row: '7'}, // Db
            106: {col: '5', row: '7'}, // Sg
            107: {col: '6', row: '7'}, // Bh
            108: {col: '7', row: '7'}, // Hs
            109: {col: '8', row: '7'}, // Mt
            110: {col: '9', row: '7'}, // Ds
            111: {col: '10', row: '7'}, // Rg
            112: {col: '11', row: '7'}, // Cn
            // p-block
            113: {col: '13', row: '7'}, // Nh
            114: {col: '14', row: '7'}, // Fl
            115: {col: '15', row: '7'}, // Mc
            116: {col: '16', row: '7'}, // Lv
            117: {col: '17', row: '7'}, // Ts
            118: {col: '18', row: '7'}  // Og
        };
    }
    
    function setupHoverEffects(elementDiv) {
        let hoverTimeout;
        let popup = elementDiv.querySelector('.element-details-popup');

        elementDiv.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
           
            // Get element position
            const rect = elementDiv.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            
            // Calculate center position
            const centerX = rect.left + scrollLeft + (rect.width / 2);
            const topY = rect.top + scrollTop;
            
            // Position popup above element
            popup.style.left = `${centerX}px`;
            popup.style.top = `${topY - popup.offsetHeight - 10}px`;
            popup.style.opacity = '1';
            popup.style.transform = 'translateX(-50%)';
        });

        const elementNumber = parseInt(elementDiv.querySelector('.element-number').textContent);
        const element = elements.find(el => el.number === elementNumber);
        
        elementDiv.addEventListener('click', function(e) {
            e.stopPropagation();
            showElementDetails(element);
        });
        elementDiv.addEventListener('mouseleave', function() {
            // const popup = this.querySelector('.element-details-popup');
            hoverTimeout = setTimeout(() => {
                popup.style.opacity = '0';
            }, 300);
        });
    }
    
    function showElementDetails(element) {
      const detailsCard = document.querySelector('.element-details-card');
      if (!detailsCard) return;
      
      detailsCard.style.display = 'block';
      detailsCard.querySelector('.element-name').textContent = element.name;
      detailsCard.querySelector('.element-symbol').textContent = element.symbol;
      detailsCard.querySelector('.atomic-number').textContent = element.number;
      detailsCard.querySelector('.atomic-mass').textContent = element.mass;
      detailsCard.querySelector('.electronegativity').textContent = 
          element.electronegativity || 'N/A';
      detailsCard.querySelector('.electron-config').textContent = element.config;
      
      // Position the details card
      positionDetailsCard(detailsCard);
    }

    
    function positionDetailsCard(card) {
      // Center the card on screen
      // card.style.left = '50%';
      // card.style.top = '50%';
      // card.style.transform = 'translate(-50%, -50%)';
      card.style.left = '50%';
      card.style.top = '50%'; // Or another Y offset
      card.style.transform = 'translateX(-50%)';
    }

    // Toggle periodic table visibility
    document.querySelector('.gg-element').addEventListener('click', function(e) {
        e.stopPropagation();
        document.querySelector('.periodic-table-container').classList.toggle('visible');
    });
    
    // Close details card when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.element-details-card') && 
            !e.target.closest('.element-box')) {
            document.querySelector('.element-details-card').style.display = 'none';
        }
        
        // Close periodic table when clicking outside
        if (!e.target.closest('.periodic-table-wrapper')) {
            document.querySelector('.periodic-table-container').classList.remove('visible');
        }
    });
    // Add at bottom of existing JS
    // const mainContent = document.querySelector('main, .container, body > div:first-child');
    // if (mainContent) {
    //   mainContent.style.paddingBottom = '60px';
    // }

    document.querySelector('.gg-element')?.addEventListener('mousedown', (e) => {
      e.preventDefault();
    });
    // Initialize periodic table
    createPeriodicTable();
      
    // Auto-close with delay and animation
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        // Only auto-close in mobile view
        if (window.getComputedStyle(navbarToggler).display !== 'none') {
          // Add visual feedback
          this.classList.add('active');
          setTimeout(() => {
            this.classList.remove('active');
          }, 200);
          
          // Close after delay
          setTimeout(() => {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) bsCollapse.hide();
          }, 150); // 150ms delay
        }
      });
    });

    // Handle dropdowns separately
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        if (window.getComputedStyle(navbarToggler).display !== 'none') {
          // Keep menu open for dropdowns
          e.stopPropagation();
          const dropdown = this.nextElementSibling;
          dropdown.classList.toggle('show');
        }
      });
    });

    /////////////////////////////////////////
    indicator.className = 'active-indicator';
    navbar.appendChild(indicator);
  
    // Track scroll position
    let lastScroll = 0;
    let ticking = false;
  
    // Sticky Scroll Behavior
    window.addEventListener('scroll', function() {
      const currentScroll = window.scrollY;
      
      // Only run if scroll position changed significantly
      if (Math.abs(currentScroll - lastScroll) > 50) {
        if (currentScroll > lastScroll && currentScroll > 100) {
          // Scrolling down
          navbar.classList.add('sticky-hide');
        } else {
          // Scrolling up
          navbar.classList.remove('sticky-hide');
        }
        lastScroll = currentScroll;
      }
  
      // Active Section Highlight
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    });
  
    function updateActiveSection() {
      const fromTop = window.scrollY + navbar.offsetHeight + 50;
      
      navLinks.forEach(link => {
        const section = document.querySelector(link.hash);
        if (
          section &&
          section.offsetTop <= fromTop &&
          section.offsetTop + section.offsetHeight > fromTop
        ) {
          link.classList.add('active');
          // Position indicator
          const linkRect = link.getBoundingClientRect();
          const navRect = navbar.getBoundingClientRect();
          indicator.style.width = `${linkRect.width}px`;
          indicator.style.left = `${linkRect.left - navRect.left}px`;
        } else {
          link.classList.remove('active');
        }
      });
    }
    function makePopupDraggable(popupId, headerId) {
      const popup = document.getElementById(popupId);
      const header = document.getElementById(headerId);
  
      let offsetX = 0, offsetY = 0, isDragging = false;
  
      header.addEventListener('mousedown', (e) => {
          isDragging = true;
          offsetX = e.clientX - popup.offsetLeft;
          offsetY = e.clientY - popup.offsetTop;
          document.body.style.userSelect = 'none';
      });
  
      document.addEventListener('mouseup', () => {
          isDragging = false;
          document.body.style.userSelect = 'auto';
      });
  
      document.addEventListener('mousemove', (e) => {
          if (!isDragging) return;
          popup.style.left = `${e.clientX - offsetX}px`;
          popup.style.top = `${e.clientY - offsetY}px`;
      });
    }
    
    makePopupDraggable("elementPopup", "popupHeader");
  
  
    // Initialize
    updateActiveSection();
}); // Existing closing of DOMContentLoaded
