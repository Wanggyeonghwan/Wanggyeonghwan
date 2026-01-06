// Simple calculator logic with keyboard support and basic input sanitization

const displayEl = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let expression = ''; // string shown in the display

function updateDisplay() {
  displayEl.textContent = expression === '' ? '0' : expression;
}

// Append a value (digit, dot, operator, parentheses)
function appendValue(val) {
  // Prevent multiple leading zeros like "000"
  if (expression === '0' && val === '0') return;
  if (expression === '0' && val !== '.' && /[0-9]/.test(val)) {
    expression = val;
  } else {
    expression += val;
  }
  updateDisplay();
}

// Backspace
function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

// Clear
function clearAll() {
  expression = '';
  updateDisplay();
}

// Evaluate expression safely
function evaluateExpression() {
  if (!expression) return;
  // Allow only digits, spaces, operators, parentheses and decimal point
  const safePattern = /^[0-9+\-*/().\s]+$/;
  if (!safePattern.test(expression)) {
    displayEl.textContent = 'Error';
    expression = '';
    return;
  }

  try {
    // Use Function constructor instead of eval for slightly safer scope
    // Still only use after sanitization above.
    // Replace unicode multiplication/division symbols if present
    const sanitized = expression.replace(/×/g, '*').replace(/÷/g, '/');
    const result = Function('"use strict"; return (' + sanitized + ')')();
    // Handle Infinity / NaN
    if (result === Infinity || result === -Infinity || Number.isNaN(result)) {
      displayEl.textContent = 'Error';
      expression = '';
    } else {
      // Limit to reasonable decimal places
      expression = String(Number.isFinite(result) && !Number.isInteger(result) ? parseFloat(result.toFixed(10)) : result);
      updateDisplay();
    }
  } catch (e) {
    displayEl.textContent = 'Error';
    expression = '';
  }
}

// Button click handling
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.getAttribute('data-value');
    const action = btn.getAttribute('data-action');

    if (action === 'clear') {
      clearAll();
    } else if (action === 'back') {
      backspace();
    } else if (action === 'equals') {
      evaluateExpression();
    } else if (val !== null) {
      appendValue(val);
    }
  });
});

// Keyboard support
window.addEventListener('keydown', (e) => {
  // Allow digits and operators directly
  if (/^[0-9]$/.test(e.key)) {
    appendValue(e.key);
    e.preventDefault();
    return;
  }

  if (['+', '-', '*', '/', '.', '(', ')'].includes(e.key)) {
    appendValue(e.key);
    e.preventDefault();
    return;
  }

  if (e.key === 'Enter' || e.key === '=') {
    evaluateExpression();
    e.preventDefault();
    return;
  }

  if (e.key === 'Backspace') {
    backspace();
    e.preventDefault();
    return;
  }

  if (e.key === 'Escape') {
    clearAll();
    e.preventDefault();
    return;
  }
});

// Initialize
updateDisplay();