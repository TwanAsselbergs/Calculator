function addTransitionEffect(button) {
  button.addEventListener("click", () => {
    const previousOperation = document.querySelector(".previous-operation");

    if (button.textContent === "=") {
      previousOperation.style.animation = "none";
      previousOperation.offsetHeight;
      previousOperation.style.animation = "slideIn 0.4s ease-in-out";
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

  let expression = "";
  let currentInput = "0";
  let resultDisplayed = false;
  let operatorPressed = false;
  let operatorAfterResult = false;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.textContent;

      if (value === "AC") {
        expression = "";
        currentInput = "0";
        display.textContent = currentInput;
        previousOperationDisplay.style.animation = "slideOut 0.4s ease-in-out";

        setTimeout(() => {
          previousOperationDisplay.textContent = "";
        }, 300);

        resultDisplayed = false;
        operatorPressed = false;
        operatorAfterResult = false;
      } else if (value === "+/-") {
        currentInput = (parseFloat(currentInput.replace(",", ".")) * -1)
          .toString()
          .replace(".", ",");
        updateDisplay();
      } else if (value === "%") {
        currentInput = (parseFloat(currentInput.replace(",", ".")) / 100)
          .toString()
          .replace(".", ",");
        updateDisplay();
      } else if (["+", "-", "×", "÷"].includes(value)) {
        if (resultDisplayed) {
          expression = currentInput.replace(",", ".") + " " + value + " ";
          resultDisplayed = false;
          operatorAfterResult = true;
        } else {
          if (operatorPressed || operatorAfterResult) {
            expression = expression.slice(0, -3) + " " + value + " ";
          } else {
            expression += currentInput.replace(",", ".") + " " + value + " ";
            operatorPressed = true;
          }
        }

        currentInput = "";
        updateDisplay();
      } else if (value === "=") {
        if (currentInput !== "") {
          expression += currentInput.replace(".", ",");
        }

        try {
          const result = evaluateExpression(expression);
          previousOperationDisplay.textContent = expression.replace(/\./g, ",");
          previousOperationDisplay.style.animation = "none";
          previousOperationDisplay.offsetHeight;
          previousOperationDisplay.style.animation = "slideIn 0.4s ease-in-out";

          currentInput = result.toString().replace(".", ",");
          expression = "";
          resultDisplayed = true;
          operatorPressed = false;
          operatorAfterResult = false;
        } catch (e) {
          currentInput = "Error";
          resultDisplayed = true;
        }
        updateDisplay(true);
      } else {
        if (currentInput === "0" || resultDisplayed) {
          currentInput = value;
          resultDisplayed = false;
        } else {
          currentInput += value;
        }
        operatorPressed = false;
        operatorAfterResult = false;
        updateDisplay();
      }
    });
  });

  function evaluateExpression(expr) {
    const safeExpr = expr.replace(/×/g, "*").replace(/÷/g, "/");
    return new Function("return " + safeExpr)();
  }

  function updateDisplay(isResult = false) {
    if (isResult) {
      display.textContent = currentInput;
    } else {
      display.textContent = expression + currentInput;
    }
  }
});
