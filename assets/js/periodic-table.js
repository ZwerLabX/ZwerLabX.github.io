document.addEventListener('DOMContentLoaded', function() {
    const periodicTableContainer = document.querySelector('.periodic-table-container');
    const ggElement = document.querySelector('.gg-element');
    
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
    // Periodic Table Integration - only run if elements exist

    if (ggElement) {
        ggElement.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        
        // Rest of the periodic table code...
        createPeriodicTable();
        
        // Only add the click event if the element exists
        ggElement.addEventListener('click', function(e) {
            e.stopPropagation();
            document.querySelector('.periodic-table-container').classList.toggle('visible');
        });
    }

    // Close details card when clicking outside
    document.addEventListener('click', function(e) {
      const periodicTableContainer = document.querySelector('.periodic-table-container');
      if (periodicTableContainer) {
          if (!e.target.closest('.periodic-table-wrapper')) {
              periodicTableContainer.classList.remove('visible');
          }
      }
      
      // Existing click handler for element details card
      if (!e.target.closest('.element-details-card') && 
          !e.target.closest('.element-box')) {
          const detailsCard = document.querySelector('.element-details-card');
          if (detailsCard) detailsCard.style.display = 'none';
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

    if (periodicTableContainer && ggElement) {
        // Initialize periodic table
        createPeriodicTable();
        
        // Set up event listeners
        ggElement.addEventListener('click', function(e) {
            e.stopPropagation();
            periodicTableContainer.classList.toggle('visible');
        });

        ggElement.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });

        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.periodic-table-wrapper')) {
                periodicTableContainer.classList.remove('visible');
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
      
    const elementPopup = document.getElementById("elementPopup");
    if (elementPopup) {
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.element-details-card') && 
            !e.target.closest('.element-box')) {
            elementPopup.style.display = 'none';
        }
    });
    }
    const popupHeader = document.getElementById("popupHeader");
    if (elementPopup && popupHeader) {
        makePopupDraggable("elementPopup", "popupHeader");
    }

    // Periodic Table Integration - only initialize if elements exist
    const periodicTableWrapper = document.querySelector('.periodic-table-wrapper');
    if (periodicTableWrapper) {
        // Initialize periodic table
        createPeriodicTable();

        // Setup click handler for the trigger element
        const ggElement = document.querySelector('.gg-element');
        if (ggElement) {
            ggElement.addEventListener('click', function(e) {
                e.stopPropagation();
                document.querySelector('.periodic-table-container').classList.toggle('visible');
            });

            // Prevent default on mousedown
            ggElement.addEventListener('mousedown', (e) => {
                e.preventDefault();
            });
        }

        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.periodic-table-wrapper')) {
                document.querySelector('.periodic-table-container').classList.remove('visible');
            }
        });
    }

});