const fs = require("fs");
const path = require("path");

const BASE_LOG_DIR = path.join(__dirname, "../../_logs/query_logs"); // Base folder for all logs

// 🕒 Function to Get Formatted Date & Time
const getFormattedTimestamp = () => {
    const now = new Date();
    return now.toISOString().replace("T", " ").split(".")[0]; // Format: YYYY-MM-DD HH:MM:SS
};

const loggerdb = (query, timing, dbName) => {
    const timestamp = getFormattedTimestamp(); // 🕒 Get current date & time
    const cleanedQuery = query.replace(/^Executed \(default\): /, ""); // Remove extra text
    const logMessage = `[${timestamp}] [Executed in ${timing ?? 'N/A'}ms] :: Query => ${cleanedQuery}\n`;
    const logMessageWithoutTime = `[Executed in ${timing ?? 'N/A'}ms] :: Query => ${cleanedQuery}\n`;

    // ✅ Tenant-Specific Folder & File
    const tenantLogDir = path.join(BASE_LOG_DIR, dbName); // Folder: query_logs/tenantDB
    const logFilePath = path.join(tenantLogDir, 'queries.log'); // File: query_logs/tenantDB/queries.log

    // ✅ Ensure Directory Exists
    if (!fs.existsSync(tenantLogDir)) {
        fs.mkdirSync(tenantLogDir, { recursive: true }); // Create tenant folder if not exists
    }

    // ✅ Append Log to File
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) console.error("❌ Error writing to log file:", err);
    });

    // Logging.queryLog(`[DB: ${dbName}] ${logMessageWithoutTime}`); // ✅ Print to console as well
}

module.exports = {
    loggerdb
}