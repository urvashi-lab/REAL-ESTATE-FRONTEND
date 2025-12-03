import { useState } from "react";
import axios from "axios";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";

function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! Ask me about real estate analytics." },
  ]);

const handleSend = async (userText, file = null) => {
  // 1️⃣ Show user message with file info + typing indicator
  const userMessage = {
    sender: "user",
    text: userText,
  };

  // Add file info to user message if file exists
  if (file) {
    userMessage.fileName = file.name;
    userMessage.fileSize = (file.size / 1024).toFixed(1) + " KB";
  }

  setMessages((prev) => [
    ...prev,
    userMessage,
    { sender: "bot", text: "Analyzing data...", isTyping: true },
  ]);

  try {
    // 2️⃣ Prepare request with FormData if file exists
    let requestData;
    let headers = {};

    if (file) {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('query', userText);
      formData.append('file', file);
      requestData = formData;
      // Don't set Content-Type - let browser set it with boundary
    } else {
      // Use JSON for text-only queries
      requestData = { query: userText };
      headers['Content-Type'] = 'application/json';
    }

    // 3️⃣ Call Django API
    const res = await axios.post(
      "https://realestateagent-ol6i.onrender.com/api/analyze/",
      requestData,
      { headers }
    );

    const data = res.data;
    console.log("📥 Backend response:", data); // Debug log

    // 4️⃣ Replace "Analyzing..." with real response + ALL metadata
    setMessages((prev) => [
      ...prev.slice(0, -1), // Remove typing indicator
      {
        sender: "bot",
        text: data.summary,
        chart: data.chart,
        table: data.table,
        metric: data.detected_metric,
        // Map backend fields to frontend fields for PDF
        chartTitle: data.chart_title,
        matchedLocations: data.matched_locations,
        isGeneralAnalysis: data.is_general_analysis,
        intent: data.intent,
        fileUsed: data.file_used, // Show which file was analyzed
      },
    ]);
  } catch (err) {
    console.error("Full error:", err);
    
    // 5️⃣ Extract actual error message from backend
    let errorMessage = "Error communicating with server.";
    
    if (err.response?.data) {
      // Backend returned an error response
      const errorData = err.response.data;
      
      // Handle different error formats
      if (errorData.error) {
        errorMessage = errorData.error;
        if (errorData.details) {
          errorMessage += `: ${errorData.details}`;
        }
        // Show available columns if structure is wrong
        if (errorData.found_columns) {
          errorMessage += `\n\nFound columns: ${errorData.found_columns.join(', ')}`;
        }
      } else {
        errorMessage = JSON.stringify(errorData);
      }
      
      console.error("Backend error:", errorData);
    } else if (err.request) {
      // Request was made but no response received
      errorMessage = "No response from server. Is Django running?";
    } else {
      // Something else happened
      errorMessage = err.message;
    }

    setMessages((prev) => [
      ...prev.slice(0, -1), // Remove typing indicator
      { 
        sender: "bot", 
        text: `❌ ${errorMessage}`,
        isError: true 
      },
    ]);
  }
};

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-3">
        🏠 AI Real Estate Analytics Chatbot
      </h3>

      <ChatWindow messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
}

export default App;




