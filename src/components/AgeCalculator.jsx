import React, { useState, useEffect } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Share } from "@capacitor/share";
import "../styles/AgeCalculator.css";

const AgeCalculator = () => {
  const [birthYear, setBirthYear] = useState("");
  const [age, setAge] = useState(null);
  const [error, setError] = useState("");
  const [hasPermission, setHasPermission] = useState(false);

  // Check notification permissions on component mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const permStatus = await LocalNotifications.checkPermissions();
        if (permStatus.display !== "granted") {
          const requestStatus = await LocalNotifications.requestPermissions();
          setHasPermission(requestStatus.display === "granted");
        } else {
          setHasPermission(true);
        }
      } catch (error) {
        console.error("Error checking notification permissions:", error);
        setHasPermission(false);
      }
    };

    checkPermissions();
  }, []);

  const validateBirthYear = (year) => {
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year, 10);

    if (isNaN(yearNum)) {
      return "Please enter a valid year";
    }

    if (yearNum < 1900) {
      return "Birth year must be 1900 or later";
    }

    if (yearNum > currentYear) {
      return "Birth year cannot be in the future";
    }

    return "";
  };

  const calculateAge = () => {
    // Clear previous error message
    setError("");

    // Validate input
    const validationError = validateBirthYear(birthYear);
    if (validationError) {
      setError(validationError);
      setAge(null);
      return;
    }

    // Calculate age
    const currentYear = new Date().getFullYear();
    const calculatedAge = currentYear - parseInt(birthYear, 10);
    setAge(calculatedAge);

    // Schedule local notification
    scheduleNotification(calculatedAge);
  };

  const scheduleNotification = async (calculatedAge) => {
    if (!hasPermission) {
      console.log("Notification permission not granted");
      return;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Age Calculation Complete",
            body: `Based on the birth year provided, your age is ${calculatedAge} years old.`,
            id: 1,
            schedule: { at: new Date(Date.now() + 1000) }, // Show after 1 second
            sound: null,
            actionTypeId: "",
            extra: null,
          },
        ],
      });
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  };

  const shareResult = async () => {
    if (age === null) {
      setError("Please calculate your age first before sharing");
      return;
    }

    try {
      await Share.share({
        title: "My Age Calculation",
        text: `Based on my birth year (${birthYear}), I am ${age} years old.`,
        dialogTitle: "Share your age calculation",
      });
    } catch (error) {
      console.error("Error sharing result:", error);
      setError("Failed to share. Please try again.");
    }
  };

  return (
    <div className="calculator-container">
      <div className="input-group">
        <label htmlFor="birth-year">Enter your birth year:</label>
        <input
          id="birth-year"
          type="number"
          min="1900"
          max={new Date().getFullYear()}
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          placeholder="e.g., 1990"
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="button-group">
        <button
          className="calculate-btn"
          onClick={calculateAge}
          disabled={!birthYear}
        >
          Calculate Age
        </button>

        <button
          className="share-btn"
          onClick={shareResult}
          disabled={age === null}
        >
          Share Results
        </button>
      </div>

      {age !== null && (
        <div className="result-container">
          <p>
            Your age is: <span className="age-result">{age}</span> years old
          </p>
        </div>
      )}

      {!hasPermission && <p className="permission-note">Hello I'm Tomoe</p>}
    </div>
  );
};

export default AgeCalculator;
