function DataTable({ data }) {
  console.log("DataTable received:", data);

  if (!data || data.length === 0) {
    return <div className="alert alert-info">No table data available</div>;
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="card p-3 shadow-sm mt-3">
      <h6 className="mb-3">📊 Data Table</h6>
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <table className="table table-striped table-hover table-sm mb-0">
          <thead className="table-dark" style={{ position: "sticky", top: 0, zIndex: 1 }}>
            <tr>
              {columns.map((col) => (
                <th key={col} className="text-capitalize">
                  {col.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col}>
                    {row[col] !== null && row[col] !== undefined
                      ? typeof row[col] === "number"
                        ? row[col].toLocaleString()
                        : row[col]
                      : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default DataTable;

