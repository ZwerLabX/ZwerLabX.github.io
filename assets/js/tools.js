// Tool Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize unit converter
    const unitInput = document.getElementById('unitInput');
    const unitType = document.getElementById('unitType');
    const unitConversion = document.getElementById('unitConversion');
    const unitResult = document.getElementById('unitResult');

    const conversions = {
        length: {
            meters: 1,
            kilometers: 1000,
            centimeters: 0.01,
            millimeters: 0.001,
            inches: 0.0254,
            feet: 0.3048,
            yards: 0.9144,
            miles: 1609.344
        },
        mass: {
            grams: 1,
            kilograms: 1000,
            milligrams: 0.001,
            pounds: 453.592,
            ounces: 28.3495
        },
        temperature: {
            celsius: 'C',
            fahrenheit: 'F',
            kelvin: 'K'
        }
    };

    function updateUnitConversionOptions() {
        if (!unitType || !unitConversion) return;
        
        const type = unitType.value;
        unitConversion.innerHTML = '';
        Object.keys(conversions[type]).forEach(unit => {
            const option = document.createElement('option');
            option.value = unit;
            option.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
            unitConversion.appendChild(option);
        });
    }

    function convertUnit() {
        if (!unitInput || !unitType || !unitConversion || !unitResult) return;

        const value = parseFloat(unitInput.value);
        if (isNaN(value)) {
            unitResult.textContent = 'Please enter a valid number';
            return;
        }

        const type = unitType.value;
        const fromUnit = unitConversion.value;

        if (type === 'temperature') {
            const results = [];
            Object.keys(conversions.temperature).forEach(to => {
                if (to !== fromUnit) {
                    let converted;
                    if (fromUnit === 'celsius') {
                        converted = to === 'fahrenheit' ? (value * 9/5) + 32 : value + 273.15;
                    } else if (fromUnit === 'fahrenheit') {
                        const celsius = (value - 32) * 5/9;
                        converted = to === 'celsius' ? celsius : celsius + 273.15;
                    } else { // kelvin
                        const celsius = value - 273.15;
                        converted = to === 'celsius' ? celsius : (celsius * 9/5) + 32;
                    }
                    results.push(`${converted.toFixed(2)}°${conversions.temperature[to]}`);
                }
            });
            unitResult.textContent = results.join(' | ');
        } else {
            const baseValue = value * conversions[type][fromUnit];
            const results = Object.entries(conversions[type])
                .filter(([u]) => u !== fromUnit)
                .map(([u, factor]) => `${(baseValue / factor).toFixed(4)} ${u}`);
            unitResult.textContent = results.join(' | ');
        }
    }

    // Event listeners for unit converter
    if (unitType) {
        unitType.addEventListener('change', () => {
            updateUnitConversionOptions();
            convertUnit();
        });
    }

    if (unitInput) {
        unitInput.addEventListener('input', convertUnit);
    }

    if (unitConversion) {
        unitConversion.addEventListener('change', convertUnit);
    }

    // Initialize unit converter
    updateUnitConversionOptions();
});