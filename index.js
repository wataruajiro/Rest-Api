const express = require("express");
const path = require("path");
const config = require("./config.json");
const os = require("os");

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

// Updated endpoint to serve statistics
app.get("/api-stats", async function (req, res) {
  const totalApis = global.api.size;
  const categories = new Set(Array.from(global.api.values()).map(api => api.config.category));
  const totalCategories = categories.size;

  // These values should be replaced with actual data in a production environment
  const dailyRequests = 1000000;
  const uptime = 99.99;

  const stats = {
    browserCodeName: "Mozilla",
    browserName: "Netscape",
    cookiesEnabled: true,
    browserLanguage: "en-US",
    browserOnline: true,
    platform: `${os.type()} ${os.arch()}`,
    userAgent: req.get('User-Agent'),
    ipAddress: req.ip,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    totalApis,
    totalCategories,
    uptime
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