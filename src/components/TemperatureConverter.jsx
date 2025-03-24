import React, { useState, useEffect } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Share } from "@capacitor/share";
import "../styles/TemperatureConverter.css";

const TemperatureConverter = () => {
  const [celsius, setCelsius] = useState("");
  const [fahrenheit, setFahrenheit] = useState(null);
  const [error, setError] = useState("");
  const [hasPermission, setHasPermission] = useState(false);

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

  const validateCelsius = (temp) => {
    const tempNum = parseFloat(temp);
    if (isNaN(tempNum)) {
      return "Please enter a valid temperature";
    }
    return "";
  };

  const convertTemperature = () => {
    setError("");
    const validationError = validateCelsius(celsius);
    if (validationError) {
      setError(validationError);
      setFahrenheit(null);
      return;
    }
    const convertedFahrenheit = (parseFloat(celsius) * 9) / 5 + 32;
    setFahrenheit(convertedFahrenheit.toFixed(2));
    scheduleNotification(convertedFahrenheit.toFixed(2));
  };

  const scheduleNotification = async (convertedFahrenheit) => {
    if (!hasPermission) {
      console.log("Notification permission not granted");
      return;
    }
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Temperature Conversion Complete",
            body: `The converted temperature is ${convertedFahrenheit}°F.`,
            id: 1,
            schedule: { at: new Date(Date.now() + 1000) },
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
    if (fahrenheit === null) {
      setError("Please convert the temperature first before sharing");
      return;
    }
    try {
      await Share.share({
        title: "My Temperature Conversion",
        text: `The converted temperature from ${celsius}°C is ${fahrenheit}°F.`,
        dialogTitle: "Share your temperature conversion",
      });
    } catch (error) {
      console.error("Error sharing result:", error);
      setError("Failed to share. Please try again.");
    }
  };

  return (
    <div className="converter-container">
      <div className="input-group">
        <label htmlFor="celsius">Nhập Độ C:</label>
        <input
          id="celsius"
          type="number"
          value={celsius}
          onChange={(e) => setCelsius(e.target.value)}
          placeholder="e.g., 25"
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="button-group">
        <button
          className="convert-btn"
          onClick={convertTemperature}
          disabled={!celsius}
        >
          Convert to Fahrenheit
        </button>

        <button
          className="share-btn"
          onClick={shareResult}
          disabled={fahrenheit === null}
        >
          Share Result
        </button>
      </div>

      {fahrenheit !== null && (
        <div className="result-container">
          <p>
            Converted temperature: <span className="temperature-result">{fahrenheit}°F</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default TemperatureConverter;