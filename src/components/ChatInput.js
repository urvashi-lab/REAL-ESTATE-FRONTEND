import { useState, useRef } from "react";

function ChatInput({ onSend }) {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input, selectedFile);
      setInput(""); // Clear input after sending
      // File is NOT cleared - it persists until user uploads a new file or manually removes it
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
        "text/csv" // .csv
      ];
      
      if (validTypes.includes(file.type) || file.name.match(/\.(xlsx|xls|csv)$/i)) {
        setSelectedFile(file); // This replaces the previous file
      } else {
        alert("Please upload a valid Excel (.xlsx, .xls) or CSV file");
        e.target.value = "";
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
      {/* File Upload Section */}
      {selectedFile && (
        <div className="alert alert-info d-flex align-items-center justify-content-between py-2 mb-0">
          <div className="d-flex align-items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-spreadsheet" viewBox="0 0 16 16">
              <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5zM3 12v-2h2v2zm0 1h2v2H4a1 1 0 0 1-1-1zm3 2v-2h3v2zm4 0v-2h3v1a1 1 0 0 1-1 1zm3-3h-3v-2h3zm-7 0v-2h3v2z"/>
            </svg>
            <span className="small">{selectedFile.name}</span>
            <span className="badge bg-secondary small">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={handleRemoveFile}
          >
            ×
          </button>
        </div>
      )}

      {/* Input Section */}
      <div className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Ask about real estate data..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        
        {/* File Upload Button */}
        <label className="btn btn-outline-secondary" title="Upload file">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-paperclip" viewBox="0 0 16 16">
            <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z"/>
          </svg>
        </label>

        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </div>
    </form>
  );
}

export default ChatInput;