/**
 * lib.js — A simple utility library.
 * Provides greeting and basic arithmetic operations.
 */

const lib = {
  /**
   * Returns a greeting string for the given name.
   * @param {string} name
   * @returns {string}
   */
  greet(name) {
    return `Hello, ${name}!`;
  },

  /**
   * Adds two numbers.
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  add(a, b) {
    return a + b;
  },

  /**
   * Subtracts b from a.
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  subtract(a, b) {
    return a - b;
  },

  /**
   * Multiplies two numbers.
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  multiply(a, b) {
    return a * b;
  },

  /**
   * Divides a by b. Returns an error string when b is zero.
   * @param {number} a
   * @param {number} b
   * @returns {number|string}
   */
  divide(a, b) {
    if (b === 0) {
      return "Error: Division by zero";
    }
    return a / b;
  },

  handleMessage(json) {
    try {
      const message = JSON.parse(json);
      console.log("Received message:", message);
      // Process the message as needed...
      if (message.type == "show") {
        console.log("Handling show message:", message);
        const stage = document.getElementById("stage");
        stage.setAttribute("data-last-type", message.type);

        const contentArea = stage.querySelector("[data-role='content-area']");
        const commandArea = stage.querySelector("[data-role='command-area']");

        if (message.jsData == "DISCLAIMER") {
          const scrollableDiv = document.createElement("div");
          scrollableDiv.style.overflowY = "scroll";
          scrollableDiv.style.minHeight = "100%";
          scrollableDiv.style.height = "100%";
          scrollableDiv.style.maxHeight = "100%";
          for (let i = 0; i < 500; i++) {
            const div = document.createElement("div");
            div.textContent = `Line ${i + 1}`;
            scrollableDiv.appendChild(div);
          }
          contentArea.appendChild(scrollableDiv);
          scrollableDiv.addEventListener("scroll", () => {
            const atBottom =
              scrollableDiv.scrollTop + scrollableDiv.clientHeight >=
              0.95 * scrollableDiv.scrollHeight;
            commandArea.querySelector("button").disabled = !atBottom;
          });

          const button = document.createElement("button");
          button.disabled = true; // Initially disabled
          button.textContent = "Click me!";
          button.addEventListener("click", () => {
            alert("Button clicked!");
          });
          commandArea.appendChild(button);
        }
      }
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  },
};
