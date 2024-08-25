import React, { useState } from "react";
import "./App.css";
import jsonlint from "jsonlint";

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let parsedInput;
      try {
        parsedInput = JSON.parse(jsonInput);
      } catch (e) {
        setError("Invalid JSON format. Please enter a valid JSON.");
        return;
      }

      setError("");

      const res = await fetch(
        "https://bajaj-finserv-test-1.onrender.com/bfhl",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: parsedInput.data }),
        }
      );

      const data = await res.json();
      setResponse(data);
      setShowDropdown(true); // Show dropdown after valid submission
    } catch (e) {
      setError("An error occurred while processing the request.");
    }
  };

  const handleOptionChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(value);
  };

  const renderResponse = () => {
    if (!response) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = response;
    return (
      <div className="response-container">
        {selectedOptions.includes("Alphabets") && (
          <div>
            <h3>Alphabets</h3>
            <p>{alphabets.join(", ")}</p>
          </div>
        )}
        {selectedOptions.includes("Numbers") && (
          <div>
            <h3>Numbers</h3>
            <p>{numbers.join(", ")}</p>
          </div>
        )}
        {selectedOptions.includes("Highest Lowercase Alphabet") && (
          <div>
            <h3>Highest Lowercase Alphabet</h3>
            <p>{highest_lowercase_alphabet.join(", ")}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>21BCI0011</h1> {/* Website title with roll number */}
      <form onSubmit={handleSubmit}>
        <label>Enter JSON:</label>
        <textarea
          value={jsonInput}
          onChange={handleJsonInputChange}
          rows="4"
          cols="50"
        />
        <button type="submit">Send</button>
        {error && <p className="error">{error}</p>}
      </form>
      {showDropdown && response && (
        <>
          <label>Select options to display:</label>
          <select multiple onChange={handleOptionChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest Lowercase Alphabet">
              Highest Lowercase Alphabet
            </option>
          </select>
          {renderResponse()}
        </>
      )}
    </div>
  );
};

export default App;
