const Logging = require("@/@library/logging");
const { initMasterDb, preloadAllTenants } = require("database");

// Start Server After Master DB Connects
const startServer = async (app) => {
    try {
        await initMasterDb(); // ✅ 1. Connect Master DB
        Logging.info("✅ Master DB connected!");

        const PORT = process.env.PORT || 8000;
        const server = app.listen(PORT, async () => {
            Logging.info(`🚀 Server running on port ${PORT}`);

            // ✅ 3. Load tenants in background
            try {
                await preloadAllTenants();
                Logging.info("✅ All tenants preloaded!");
            } catch (error) {
                Logging.error("❌ Error loading tenants: " + error.message);
            }
        });

        require("./main")(app)

        // Graceful Shutdown
        process.on("SIGINT", () => {
            Logging.warn("⚠️ Shutting down gracefully...");
            server.close(() => {
                Logging.info("🔴 Process terminated.");
                process.exit(0);
            });
        });

    } catch (error) {
        Logging.error("❌ Master DB connection failed: " + error.message);
        process.exit(1); // Exit process if DB fails
    }
};

module.exports = startServer;