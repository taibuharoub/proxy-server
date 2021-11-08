const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const apiCache = require("apicache");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each IP to 5 requests per windowMs
});
app.use(limiter);
// we using this as a Proxy
app.set("trust proxy", 1);

app.use("/api", require("./routes/index"));

app.listen(PORT, () => {
  console.log(`Server at http://localhost:${PORT}`);
});
