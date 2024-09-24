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
        currentInput = "0";
        operator = null;
        previousInput = null;
        previousOperationDisplay.textContent = "";
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
