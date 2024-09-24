function addTransitionEffect(button) {
  button.addEventListener("click", () => {
    const previousOperation = document.querySelector(".previous-operation");

    if (button.textContent === "=") {
      previousOperation.style.animation = "none";
      previousOperation.offsetHeight; // Trigger reflow
      previousOperation.style.animation = "slideIn 0.4s ease-in-out";
    } else if (button.textContent === "AC") {
      previousOperation.style.animation = "none";
      previousOperation.offsetHeight; // Trigger reflow
      previousOperation.style.animation = "slideOut 0.4s ease-in-out";
    }
  });
}

document
  .querySelectorAll(".btn.number, .btn.operator")
  .forEach(addTransitionEffect);

document.addEventListener("DOMContentLoaded", () => {
  const display = document.querySelector(".current-input");
  const previousOperationDisplay = document.querySelector(
    ".previous-operation"
  );
  const buttons = document.querySelectorAll(".btn");
  let currentInput = "0";
  let operator = null;
  let previousInput = null;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.textContent;

      if (value === "AC") {
        previousOperationDisplay.style.animation = "slideOut 0.4s ease-in-out";
        setTimeout(() => {
          previousOperationDisplay.textContent = "";
        }, 300);
        currentInput = "0";
        operator = null;
        previousInput = null;
        display.textContent = currentInput;
      } else if (value === "+/-") {
        currentInput = (parseFloat(currentInput.replace(",", ".")) * -1)
          .toString()
          .replace(".", ",");
      } else if (value === "%") {
        currentInput = (parseFloat(currentInput.replace(",", ".")) / 100)
          .toString()
          .replace(".", ",");
      } else if (["+", "-", "×", "÷"].includes(value)) {
        if (operator && previousInput !== null) {
          if (currentInput !== "0") {
            currentInput = calculate(
              parseFloat(previousInput.replace(",", ".")),
              parseFloat(currentInput.replace(",", ".")),
              operator
            )
              .toString()
              .replace(".", ",");
            previousOperationDisplay.textContent = `${previousInput} ${operator} ${currentInput}`;
          }
          operator = value;
          display.textContent = `${previousInput} ${operator}`;
        } else if (!operator) {
          operator = value;
          previousInput = currentInput;
          display.textContent = `${previousInput} ${operator}`;
          currentInput = "0";
        } else {
          operator = value;
          display.textContent = `${previousInput} ${operator}`;
        }
      } else if (value === "=") {
        if (operator && previousInput !== null && currentInput !== "0") {
          const result = calculate(
            parseFloat(previousInput.replace(",", ".")),
            parseFloat(currentInput.replace(",", ".")),
            operator
          )
            .toString()
            .replace(".", ",");
          previousOperationDisplay.textContent = `${previousInput} ${operator} ${currentInput}`;
          currentInput = result;
          operator = null;
          previousInput = null;
        }
      } else {
        if (currentInput === "0") {
          currentInput = value;
        } else {
          currentInput += value;
        }
        display.textContent = operator
          ? `${previousInput} ${operator} ${currentInput}`
          : currentInput;
      }

      if (!operator) {
        display.textContent = currentInput;
      }
    });
  });

  function calculate(a, b, operator) {
    switch (operator) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return a / b;
      default:
        return b;
    }
  }
});
