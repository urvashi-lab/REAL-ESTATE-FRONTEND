import { useEffect, useRef } from "react";
import ChartView from "./ChartView";
import DataTable from "./DataTable";

function ChatWindow({ messages }) {
  const endRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Download PDF handler
  const handleDownloadPDF = async (msg) => {
    try {
      // Prepare the data payload
      const payload = {
        summary: msg.text,
        chart: msg.chart,
        table: msg.table,
        chart_title: msg.chartTitle || "Analysis Report",
        detected_metric: msg.metric || "",
        matched_locations: msg.matchedLocations || {},
        is_general_analysis: msg.isGeneralAnalysis || false,
        intent: msg.intent || {}
      };

      console.log("📤 Sending payload to backend:", payload);

      // Make API call to download endpoint
      const response = await fetch("https://realestateagent-ol6i.onrender.com/api/download-pdf/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        // Try to get error details from response
        const errorText = await response.text();
        console.error("❌ Server error:", errorText);
        throw new Error(`Failed to generate PDF: ${response.status} - ${errorText}`);
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
      a.download = `analysis_report_${timestamp}.pdf`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log("✅ PDF downloaded successfully");
    } catch (error) {
      console.error("❌ Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  return (
    <div
      className="chat-window border rounded p-3 mb-3"
      style={{
        height: "500px",
        overflowY: "auto",
        backgroundColor: "#f8f9fa",
      }}
    >
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-3 ${
            msg.sender === "user" ? "text-end" : "text-start"
          }`}
        >
          {/* Message bubble */}
          <div
            className={`d-inline-block p-2 rounded ${
              msg.sender === "user"
                ? "bg-primary text-white"
                : msg.isError
                ? "bg-danger text-white"
                : "bg-white border"
            }`}
            style={{ maxWidth: "70%" }}
          >
            {msg.text}
          </div>

          {/* Bot response components */}
          {msg.sender === "bot" && !msg.isTyping && !msg.isError && (
            <>
              {/* Chart */}
              {msg.chart && (
                <div className="mt-2">
                  <ChartView data={msg.chart} metric={msg.metric} />
                </div>
              )}

              {/* Table */}
              {msg.table && msg.table.length > 0 && (
                <div className="mt-2">
                  {console.log("Rendering table with data:", msg.table)}
                  <DataTable data={msg.table} />
                </div>
              )}

              {/* Download Button - Only show if there's data to download */}
              {(msg.chart || msg.table) && (
                <div className="mt-3">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleDownloadPDF(msg)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                    </svg>
                    Download Report (PDF)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}

      {/* Auto-scroll anchor */}
      <div ref={endRef} />
    </div>
  );
}

export default ChatWindow;