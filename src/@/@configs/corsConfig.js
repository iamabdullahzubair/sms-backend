const allowedOrigins = new Set([
    'http://localhost:5173',
    'http://schoolmaster.com',
    // Add more static origins if needed
]);

// Dynamically add tenant origins
const addAllowedOrigin = (subdomain) => {
    if (!subdomain) return;

    const protocol = process.env.USE_HTTPS === 'true' ? 'https' : 'http';
    const origin = `${protocol}://${subdomain}.${process.env.SYSTEM_DOMAIN}`;

    if (!allowedOrigins.has(origin)) {
        allowedOrigins.add(origin);
        console.log(`✅ Added new allowed origin: ${origin}`);
    }
};

// Dynamic CORS handler
const corsOptionsDelegate = function (req, callback) {
    const origin = req.header('Origin');

    if (!origin) {
        return callback(null, { origin: false }); // block requests without origin
    }

    if (allowedOrigins.has(origin)) {
        return callback(null, {
            origin: true,
            credentials: true,
        });
    } else {
        console.warn(`⛔ Blocked by CORS: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
    }
};

module.exports = {
    corsOptionsDelegate,
    addAllowedOrigin,
};
