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
      console.log("Handling show message:", json);
      const stage = document.getElementById("stage");
      // stage.setAttribute("data-last-type", message.type);

      const contentArea = stage.querySelector("[data-role='content-area']");
      const commandArea = stage.querySelector("[data-role='command-area']");

      if (json.startsWith("DISCLAIMER")) {
        const scrollableDiv = document.createElement("div");
        scrollableDiv.style.overflowY = "scroll";
        scrollableDiv.style.minHeight = "100%";
        scrollableDiv.style.height = "100%";
        scrollableDiv.style.maxHeight = "100%";

        let N = 10;
        if (json == "DISCLAIMER_LONG") {
          N = 500;
        }
        for (let i = 0; i < N; i++) {
          const div = document.createElement("div");
          div.textContent = `Line ${i + 1}`;
          scrollableDiv.appendChild(div);
        }
        contentArea.appendChild(scrollableDiv);

        function verifyScroll() {
          const atBottom =
            scrollableDiv.scrollTop + scrollableDiv.clientHeight >=
            0.95 * scrollableDiv.scrollHeight;
          commandArea.querySelector("button").disabled = !atBottom;
        }
        scrollableDiv.addEventListener("scroll", verifyScroll);

        const button = document.createElement("button");
        button.disabled = true; // Initially disabled
        button.textContent = "Click me!";
        button.addEventListener("click", () => {
          alert("Button clicked!");
        });
        commandArea.appendChild(button);


        // Check initial scroll position in case content fits without scrolling
        verifyScroll();
      }

      if (json === 'CANVAS_TESTING') {
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        contentArea.appendChild(canvas);

        function drawShapes() {
          const w = canvas.clientWidth;
          const h = canvas.clientHeight;
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, w, h);

          const cols = 2, rows = 2;
          const cellW = w / cols;
          const cellH = h / rows;
          const r = Math.min(cellW, cellH) * 0.3;

          ctx.fillStyle = '#44aaff';

          for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
              const cx = cellW * col + cellW / 2;
              const cy = cellH * row + cellH / 2;

              if (w < 300) {
                // rectangle on small screens
                ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
              } else if (w >= 500) {
                // triangle on large screens
                ctx.beginPath();
                ctx.moveTo(cx, cy - r);
                ctx.lineTo(cx + r, cy + r);
                ctx.lineTo(cx - r, cy + r);
                ctx.closePath();
                ctx.fill();
              } else {
                // circle on medium screens
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
        }

        const observer = new ResizeObserver(drawShapes);
        observer.observe(canvas);
        drawShapes();
      }
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  },
};
