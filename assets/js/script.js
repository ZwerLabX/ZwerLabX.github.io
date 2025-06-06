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
          // Skip if hash is empty or invalid
          if (!link.hash || link.hash === '#') return;
          
          try {
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
          } catch (e) {
              console.warn(`Invalid selector for nav link: ${link.hash}`);
          }
      });
    }
    // Initialize
    updateActiveSection();


}); // Existing closing of DOMContentLoaded
