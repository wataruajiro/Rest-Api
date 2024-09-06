const express = require("express");
const path = require("path");
const config = require("./config.json");
const os = require('os');
const useragent = require('useragent');

global.config = config;
global.api = new Map();  // Ensure global.api is initialized here
const router = require("./router");
const app = express();

app.use(express.json());
app.use(router);

// Endpoint to serve the API list
app.get("/api-list", async function (req, res) {
  const apiList = Array.from(global.api.values()).map(api => api.config);
  res.json(apiList);
});

// Function to extract the client's real IP address
function getClientIp(req) {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    const forwardedIps = xForwardedFor.split(',').map(ip => ip.trim());
    return forwardedIps[0];  // Return the first IP in the list (client IP)
  }
  return req.ip;  // Fallback to req.ip if no X-Forwarded-For header exists
}

// Updated endpoint to serve statistics
app.get("/api-stats", async function (req, res) {
  const totalApis = global.api.size;

  // Parse user-agent string to get browser details
  const agent = useragent.parse(req.headers['user-agent']);

  const stats = {
    browserCodeName: agent.family, // Browser codename (family name)
    browserName: agent.toAgent(),  // Browser name and version
    browserLanguage: req.headers["accept-language"] || "en-US", // Accept-Language header
    cookie: true,
    browserOnline: true, // Since the request was received, we assume the browser is online
    platform: `${os.type()} ${os.arch()}`,
    userAgent: req.headers['user-agent'], // Full user-agent string
    ipAddress: getClientIp(req), // Get the client's actual IP address
    date: new Intl.DateTimeFormat("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Manila"
    }).format(new Date()),
    time: new Intl.DateTimeFormat("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Manila",
      hour12: false
    }).format(new Date()),
    totalApis,
  };

  res.json(stats);
});

app.get("/", async function (req, res) {
  res.sendFile(path.join(__dirname, "web/docs.html"));
});

app.get("*", async function (req, res) {
  res.sendFile(path.join(__dirname, "web/404.html"));
});

const PORT = process.env.PORT || global.config.port;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
