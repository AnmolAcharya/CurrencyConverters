import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { currencies } from "./currencies.js";

const App = () => {
  // const [count, setCount] = useState(0);
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [conversionHistory, setConversionHistory] = useState([]);

  // Load conversion history from localStorage when component mounts
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("history")) || [];
    setConversionHistory(savedHistory);
  }, []);

  const saveHistory = (entry) => {
    const updatedHistory = [entry, ...conversionHistory];
    setConversionHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
  };

  const convertCurrencies = async () => {
    if (!amount || !selectedCurrency) return;

    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
      );

      const rate = response.data.rates[selectedCurrency];
      const result = (amount * rate).toFixed(2);

      // Find the selected currency details from our currencies array
      const targetCurrency = currencies.find(
        (curr) => curr.code === selectedCurrency
      );

      // Use saveHistory instead of directly setting state
      const historyEntry = {
        result: result,
        code: selectedCurrency,
        symbol: targetCurrency.symbol,
        countryName: targetCurrency.name,
        flag: targetCurrency.flag
      };
      saveHistory(historyEntry);
    } catch (error) {
      console.error("Error converting currency:", error);
    }
  };

  const deleteHistoryItem = (index) => {
    const newHistory = conversionHistory.filter((_, i) => i !== index);
    setConversionHistory(newHistory);
    localStorage.setItem("history", JSON.stringify(newHistory)); // Save after deletion
  };

  return (
    <div className="container">
      <div className="converter-box">
        <h1 className="main-title">
          Smart Currency Converter
        </h1>

        <div className="input-group">
          <label>Base Currency</label>
          <div className="select-wrapper">
            {baseCurrency && (
              <img
                src={`https://flagcdn.com/w20/${currencies.find(c => c.code === baseCurrency)?.flag.toLowerCase()}.png`}
                alt={baseCurrency}
                className="currency-flag"
              />
            )}
            <select
              className="select-input"
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="input-group amount-group">
          <label>Amount</label>
          <div className="input-wrapper">
            <input
              type="number"
              className="number-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="input-group">
          <label>Target Currency</label>
          <div className="select-wrapper">
            {selectedCurrency && (
              <img
                src={`https://flagcdn.com/w20/${currencies.find(c => c.code === selectedCurrency)?.flag.toLowerCase()}.png`}
                alt={selectedCurrency}
                className="currency-flag"
              />
            )}
            <select
              className="select-input"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              <option value="">Select Currency</option>
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="button-container">
          <button
            className="convert-button"
            onClick={convertCurrencies}
          >
            Convert
          </button>
        </div>

        <h2 className="history-title">
          Conversion History
        </h2>
        <div className="history-container">
          {conversionHistory.length > 0 ? (
            <ul className="history-list">
              {conversionHistory.map((entry, index) => (
                <li key={index} className="history-item">
                  <div className="history-entry">
                    <img
                      src={`https://flagcdn.com/w40/${entry.flag.toLowerCase()}.png`}
                      alt="Country Flag"
                      className="flag-image"
                    />
                    <div className="conversion-details">
                      <span className="conversion-amount">
                        {entry.symbol} {entry.result}
                      </span>
                      <span className="currency-info">
                        {entry.code} - {entry.countryName}
                      </span>
                    </div>
                  </div>
                  <span
                    className="delete-button"
                    onClick={() => deleteHistoryItem(index)}
                  >
                    ×
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-history">
              Conversion history is empty.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
