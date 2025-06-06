document.addEventListener('DOMContentLoaded', function () {
    // Hash Generator Elements
    const hashInput = document.getElementById('hashInput');
    const hashType = document.getElementById('hashType');
    const generateHash = document.getElementById('generateHash');
    const hashOutput = document.getElementById('hashOutput');
    const copyHash = document.getElementById('copyHash');
    const fileInput = document.getElementById('fileInput');
    const compareHash = document.getElementById('compareHash');
    const comparisonStatus = document.querySelector('.comparison-status');
    const warningMessage = document.querySelector('.warning-message');
    let currentHash = '';
    
    // Initialize CryptoJS extensions if needed
    if (typeof CryptoJS === 'undefined') {
      console.error('CryptoJS is not loaded');
      return;
    }
  
    // Real-time generation with debounce
    if (hashInput && hashType) {
      hashInput.addEventListener('input', debounce(handleHashGeneration, 300));
      hashType.addEventListener('change', handleHashGeneration);
    }
  
    // File upload handler
    if (fileInput) {
      fileInput.addEventListener('change', handleFileUpload);
    }
  
    // Compare hash functionality
    if (compareHash && comparisonStatus) {
      compareHash.addEventListener('input', handleHashComparison);
    }
  
    // Copy button handler (matches password generator behavior)
    if (copyHash) {
      copyHash.addEventListener('click', handleCopyClick);
    }
  
    function updateHashVisualization(hash) {
      const strengthBar = document.getElementById('hashStrengthBar');
      const complexityLabel = document.getElementById('hashComplexity');
  
      if (!strengthBar || !complexityLabel || !hash) return;
  
      // More sophisticated complexity calculation
      const uniqueChars = new Set(hash).size;
      const lengthScore = Math.min(1, hash.length / 64); // Normalize length score
      const entropyScore = uniqueChars / 64; // Normalize entropy score
      const complexity = Math.min(100, lengthScore * 40 + entropyScore * 60);
  
      // Update progress bar
      strengthBar.style.width = `${complexity}%`;
  
      // Update colors and labels based on complexity
      if (complexity > 85) {
        strengthBar.className =
          'hash-strength-progress hash-strength-very-strong';
        complexityLabel.textContent = 'Very Strong';
        complexityLabel.style.color = '#20c997';
      } else if (complexity > 65) {
        strengthBar.className = 'hash-strength-progress hash-strength-strong';
        complexityLabel.textContent = 'Strong';
        complexityLabel.style.color = '#28a745';
      } else if (complexity > 35) {
        strengthBar.className = 'hash-strength-progress hash-strength-medium';
        complexityLabel.textContent = 'Medium';
        complexityLabel.style.color = '#ffc107';
      } else {
        strengthBar.className = 'hash-strength-progress hash-strength-weak';
        complexityLabel.textContent = 'Weak';
        complexityLabel.style.color = '#dc3545';
      }
    }
  
    function handleHashGeneration() {
      const text = hashInput.value;
      const type = hashType.value;
  
      if (!text) {
        if (hashOutput) hashOutput.value = '';
        currentHash = '';
        return;
      }
  
      if (hashOutput) hashOutput.classList.add('hash-loading');
  
      setTimeout(() => {
        currentHash = generateHashValue(text, type);
        if (hashOutput) {
          hashOutput.value = currentHash;
          hashOutput.classList.remove('hash-loading');
        }
  
        // Calculate visual complexity
        updateHashVisualization(currentHash);
  
        // Show result container
        const container = document.getElementById('hashResultContainer');
        if (container) {
          container.style.display = 'block';
          container.style.animation = 'fadeIn 0.5s ease';
        }
      }, 100);
    }
  
    function generateHashValue(text, type) {
      try {
        switch (type) {
          case 'md5':
            return CryptoJS.MD5(text).toString();
          case 'sha1':
            return CryptoJS.SHA1(text).toString();
          case 'sha256':
            return CryptoJS.SHA256(text).toString();
          case 'sha512':
            return CryptoJS.SHA512(text).toString();
          case 'sha3-256':
            if (CryptoJS.SHA3) {
              return CryptoJS.SHA3(text, { outputLength: 256 }).toString();
            }
            showUnsupportedError('SHA3-256');
            return '';
          case 'sha3-512':
            if (CryptoJS.SHA3) {
              return CryptoJS.SHA3(text, { outputLength: 512 }).toString();
            }
            showUnsupportedError('SHA3-512');
            return '';
          case 'ripemd160':
            if (CryptoJS.RIPEMD160) {
              return CryptoJS.RIPEMD160(text).toString();
            }
            showUnsupportedError('RIPEMD-160');
            return '';
          case 'blake2b':
            showUnsupportedError('BLAKE2b');
            return '';
          default:
            return '';
        }
      } catch (e) {
        console.error('Hash generation error:', e);
        return '';
      }
    }
  
    function showAlgorithmWarning(type) {
      if (!warningMessage) return;
  
      warningMessage.textContent = '';
      const warnings = {
        md5: '⚠️ MD5 is considered cryptographically broken',
        sha1: '⚠️ SHA-1 has known vulnerabilities',
      };
  
      if (warnings[type]) {
        warningMessage.textContent = warnings[type];
      }
    }
  
    function showUnsupportedError(algorithm) {
      if (warningMessage) {
        warningMessage.textContent = `⚠️ ${algorithm} requires additional library`;
      }
    }
  
    function handleFileUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = function (e) {
        if (hashInput) {
          hashInput.value = e.target.result;
          handleHashGeneration();
        }
      };
      reader.readAsText(file);
    }
  
    function handleHashComparison() {
      if (!comparisonStatus || !currentHash) return;
  
      const compareValue = compareHash.value.trim();
      if (compareValue.length === 0) {
        comparisonStatus.className = 'input-group-text comparison-status';
        return;
      }
  
      comparisonStatus.classList.toggle('match', compareValue === currentHash);
      comparisonStatus.classList.toggle('mismatch', compareValue !== currentHash);
    }
  
    function handleCopyClick() {
      if (!hashOutput || !hashOutput.value) return;
  
      const originalText = this.querySelector('.copy-text').textContent;
      this.querySelector('.copy-text').textContent = 'Copied!';
      this.classList.add('btn-success');
      this.classList.remove('btn-outline-primary');
  
      navigator.clipboard.writeText(hashOutput.value).catch(() => {
        this.querySelector('.copy-text').textContent = 'Failed!';
      });
  
      setTimeout(() => {
        this.querySelector('.copy-text').textContent = originalText;
        this.classList.remove('btn-success');
        this.classList.add('btn-outline-primary');
      }, 2000);
    }
  
    // Enhanced file handling
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  
    if (fileInput) {
      const dragDropZone = document.querySelector('.drag-drop-zone');
      const fileInfo = document.querySelector('.file-info');
      const fileName = document.querySelector('.file-name');
      const fileSize = document.querySelector('.file-size');
      const fileWarning = document.querySelector('.file-warning');
      const clearFileBtn = document.getElementById('clearFile');
      const uploadBtn = dragDropZone.querySelector('button');
  
      // Click handler
      uploadBtn.addEventListener('click', () => fileInput.click());
  
      // Drag and drop handlers
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
        dragDropZone.addEventListener(eventName, preventDefaults, false);
      });
  
      function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
      }
  
      ['dragenter', 'dragover'].forEach((eventName) => {
        dragDropZone.addEventListener(eventName, highlight, false);
      });
  
      ['dragleave', 'drop'].forEach((eventName) => {
        dragDropZone.addEventListener(eventName, unhighlight, false);
      });
  
      function highlight() {
        dragDropZone.classList.add('active');
      }
  
      function unhighlight() {
        dragDropZone.classList.remove('active');
      }
  
      dragDropZone.addEventListener('drop', handleDrop, false);
  
      function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length) {
          fileInput.files = files;
          updateFileInfo();
        }
      }
  
      // File input change handler
      fileInput.addEventListener('change', updateFileInfo);
  
      // Clear file handler
      clearFileBtn.addEventListener('click', () => {
        fileInput.value = '';
        fileInfo.style.display = 'none';
        fileWarning.style.display = 'none';
      });
  
      function updateFileInfo() {
        if (fileInput.files && fileInput.files.length > 0) {
          const file = fileInput.files[0];
          fileName.textContent = file.name;
          fileSize.textContent = formatFileSize(file.size);
          fileInfo.style.display = 'block';
  
          // Check file size
          if (file.size > MAX_FILE_SIZE) {
            fileWarning.style.display = 'block';
          } else {
            fileWarning.style.display = 'none';
          }
  
          // Process file
          handleFileUpload({ target: { files: [file] } });
        } else {
          fileInfo.style.display = 'none';
          fileWarning.style.display = 'none';
        }
      }
  
      function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      }
    }
    // Fix for select options showing HTML
    document.querySelectorAll('#hashType option').forEach((option) => {
      option.textContent = option.textContent.replace(/<[^>]*>/g, '').trim();
    });
  
    // Initialize tooltips
    document.querySelectorAll('.algorithm-info').forEach((info) => {
      // This ensures the HTML structure is preserved for the tooltip
      // while keeping the select option text clean
      const parent = info.parentElement;
      if (parent.tagName === 'OPTION') {
        parent.textContent = parent.textContent.split('<')[0].trim();
      }
    });
  
    // Add this at the end of your DOMContentLoaded event listener
    const algorithmInfo = {
      md5: {
        bitLength: '128-bit',
        uses: 'Checksums, non-crypto',
        security: 'Deprecated',
        securityClass: 'text-danger',
      },
      sha1: {
        bitLength: '160-bit',
        uses: 'Legacy systems',
        security: 'Vulnerable',
        securityClass: 'text-warning',
      },
      sha256: {
        bitLength: '256-bit',
        uses: 'Blockchain, TLS',
        security: 'Secure',
        securityClass: 'text-success',
      },
      sha512: {
        bitLength: '512-bit',
        uses: 'Cryptography, TLS',
        security: 'Secure',
        securityClass: 'text-success',
      },
      'sha3-256': {
        bitLength: '256-bit',
        uses: 'Cryptography, Ethereum',
        security: 'Highly Secure',
        securityClass: 'text-success',
      },
      'sha3-512': {
        bitLength: '512-bit',
        uses: 'High-security applications',
        security: 'Highly Secure',
        securityClass: 'text-success',
      },
      ripemd160: {
        bitLength: '160-bit',
        uses: 'Bitcoin addresses',
        security: 'Secure (for specific uses)',
        securityClass: 'text-warning',
      },
      blake2b: {
        bitLength: 'Variable (up to 512-bit)',
        uses: 'Cryptography, checksums',
        security: 'Highly Secure',
        securityClass: 'text-success',
      },
    };
  
    // Update tooltip when algorithm changes
    if (hashType) {
      hashType.addEventListener('change', updateAlgorithmTooltip);
      updateAlgorithmTooltip(); // Initialize on load
    }
  
    function updateAlgorithmTooltip() {
      const selectedAlgorithm = hashType.value;
      const info = algorithmInfo[selectedAlgorithm] || {};
  
      document.getElementById('tooltip-bit-length').textContent =
        info.bitLength || '-';
      document.getElementById('tooltip-uses').textContent = info.uses || '-';
  
      const securityCell = document.getElementById('tooltip-security');
      securityCell.textContent = info.security || '-';
      securityCell.className = info.securityClass || '';
    }
  });