"use strict";

// Mock the DOM using jsdom if running in Node.js
if (typeof document === "undefined") {
  const { JSDOM } = require("jsdom");
  const { window } = new JSDOM(`<!DOCTYPE html><html><body>
    <div id="minute_25"></div>
    <div id="minute_50"></div>
    <div id="second_25"></div>
    <div id="second_50"></div>
    <button id="start_stop_25"></button>
    <button id="start_stop_50"></button>
    <button id="reset_25"></button>
    <button id="reset_50"></button>
    <button id="reset_10"></button>
    <button id="start_stop_10"></button>
  </body></html>`);
  global.document = window.document;
}

let displayElement = {
  minutes: {
    POMODORO_25: document.getElementById("minute_25"),
    POMODORO_50: document.getElementById("minute_50"),
    REST: document.getElementById("minute_10"),
  },
  seconds: {
    POMODORO_25: document.getElementById("second_25"),
    POMODORO_50: document.getElementById("second_50"),
    REST: document.getElementById("second_10"),
  },
};

let buttonStartElement = {
  POMODORO_25: document.getElementById("start_stop_25"),
  POMODORO_50: document.getElementById("start_stop_50"),
  REST: document.getElementById("start_stop_10"),
};

let resetButtonElement = {
  POMODORO_25: document.getElementById("reset_25"),
  POMODORO_50: document.getElementById("reset_50"),
  REST: document.getElementById("reset_10"),
};

let startTime = {
  POMODORO_25: {
    minutes: Number("24"),
    seconds: Number("60"),
  },
  POMODORO_50: {
    minutes: Number("49"),
    seconds: Number("60"),
  },
  REST: {
    minutes: Number("09"),
    seconds: Number("60"),
  },
};

document.addEventListener("DOMContentLoaded", () => {
  // Define button states in a higher scope
  const buttonStates = {
    POMODORO_25: true,
    POMODORO_50: true,
    REST: true,
  };

  // Shared interval IDs for each timer
  const INTERVAL_IDS = {
    POMODORO_25: null,
    POMODORO_50: null,
    REST: null,
  };

  // Function to start a timer
  /**
   * Starts a countdown timer for a specific type and updates the UI accordingly.
   *
   * @param {string} type - The type of timer to start (e.g., a specific category or identifier).
   *
   * The function performs the following:
   * - Changes the button text to "Stop" for the specified timer type.
   * - Initializes a countdown interval that decrements the time every second.
   * - Updates the displayed minutes and seconds in the UI.
   * - Stops the timer when it reaches 00:00, resets the button text to "Start",
   *   and updates the button state to indicate the timer is stopped.
   *
   * Dependencies:
   * - `buttonStartElement`: An object containing button elements for each timer type.
   * - `INTERVAL_IDS`: An object storing interval IDs for each timer type to allow clearing intervals.
   * - `startTime`: An object containing the current minutes and seconds for each timer type.
   * - `displayElement`: An object containing elements to display minutes and seconds for each timer type.
   * - `buttonStates`: An object tracking the state (started/stopped) of each timer type.
   *
   * Note:
   * - The function assumes that `startTime[type]` contains valid `minutes` and `seconds` properties.
   * - The UI elements (`buttonStartElement`, `displayElement`) and state objects (`INTERVAL_IDS`, `buttonStates`)
   *   must be properly initialized before calling this function.
   */

  function startTimer(type) {
    buttonStartElement[type].textContent = "Stop";
    INTERVAL_IDS[type] = setInterval(() => {
      if (startTime[type].seconds === 0 && startTime[type].minutes === 0) {
        clearInterval(INTERVAL_IDS[type]);
        buttonStartElement[type].textContent = "Start";
        buttonStates[type] = true;
        document.title = "Timer Finished!";
        return;
      }
      if (startTime[type].seconds === 0) {
        startTime[type].minutes--;
        startTime[type].seconds = 59;
      } else {
        startTime[type].seconds--;
      }
      displayElement.minutes[type].textContent = String(
        startTime[type].minutes
      ).padStart(2, "0");
      displayElement.seconds[type].textContent = String(
        startTime[type].seconds
      ).padStart(2, "0");

      // Update the title with the current timer
      document.title = `${String(startTime[type].minutes).padStart(
        2,
        "0"
      )}:${String(startTime[type].seconds).padStart(2, "0")} - Timer`;
    }, 1000);
  }

  // Function to stop a timer
  function stopTimer(type) {
    buttonStartElement[type].textContent = "Start";
    clearInterval(INTERVAL_IDS[type]);
  }

  // Function to reset a timer
  function resetTimer(type) {
    clearInterval(INTERVAL_IDS[type]);
    startTime[type].minutes =
      type === "POMODORO_25" ? 25 : type === "POMODORO_50" ? 50 : 10;
    startTime[type].seconds = 0;
    displayElement.minutes[type].textContent = String(
      startTime[type].minutes
    ).padStart(2, "0");
    displayElement.seconds[type].textContent = String(
      startTime[type].seconds
    ).padStart(2, "0");
    buttonStartElement[type].textContent = "Start";
    buttonStates[type] = true;
    document.title = "Pomodoro Method";
  }

  // Event listeners for reset buttons
  resetButtonElement.POMODORO_25.addEventListener("click", () =>
    resetTimer("POMODORO_25")
  );
  resetButtonElement.POMODORO_50.addEventListener("click", () =>
    resetTimer("POMODORO_50")
  );
  resetButtonElement.REST.addEventListener("click", () => resetTimer("REST"));

  // Function to toggle a timer
  function toggleTimer(type) {
    if (buttonStates[type]) {
      startTimer(type);
    } else {
      stopTimer(type);
    }
    buttonStates[type] = !buttonStates[type];
  }

  // Event listeners for each timer
  buttonStartElement.POMODORO_25.addEventListener("click", () =>
    toggleTimer("POMODORO_25")
  );
  buttonStartElement.POMODORO_50.addEventListener("click", () =>
    toggleTimer("POMODORO_50")
  );
  buttonStartElement.REST.addEventListener("click", () => toggleTimer("REST"));
});
