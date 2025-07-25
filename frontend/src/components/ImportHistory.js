import React, { useEffect, useState } from "react";
import api from "../api";
import "./ImportHistory.css";

const ImportHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/import-logs");
        setLogs(res.data);
      } catch (err) {
        console.error("Error fetching import logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="container import-history-container">
      <h2>Job Import History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered table-hover import-table mt-4">
          <thead className="thead-dark">
            <tr>
              <th>File Name</th>
              <th>Import Date/Time</th>
              <th>Total</th>
              <th>New</th>
              <th>Updated</th>
              <th>Failed</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td className="text-truncate">{log.filename || "cron-feed"}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.total}</td>
                <td className={log.new ? "new" : "text-muted"}>{log.new}</td>
                <td className={log.updated > 0 ? "updated-cell" : ""}>
                  {log.updated}
                </td>
                <td className={log.failed ? "failed" : "text-muted"}>
                  {log.failed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ImportHistory;
