const url = require("url");
const express = require("express");
const router = express.Router();
const needle = require("needle");
const apiCache = require("apicache");

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

// Init Cache
let cache = apiCache.middleware;

router.get("/", cache("2 minutes"), async (req, res) => {
  try {
    // will show the query params that are passed in the url
    // will add them to our params object, will also destructure them
    console.log(url.parse(req.url, true).query);

    // will use url search params
    // new URLSearchParams() takes in an object of params you wanna add
    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      ...url.parse(req.url, true).query,
    });

    const apiRes = await needle("get", `${API_BASE_URL}?${params}`);
    // console.log(apiRes);
    const data = apiRes.body;

    // logging the request to the public api
    if (process.env.NODE_ENV !== "production") {
      console.log(`REQUEST: ${API_BASE_URL}?${params}`);
    }

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
