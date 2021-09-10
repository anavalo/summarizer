const express = require("express");
const app = express();
const cors = require("cors");
const cheerio = require("cheerio");
const axios = require("axios");
const summarize = require('text-summarization')
const { get, children } = require("cheerio/lib/api/traversing");
const { text } = require("cheerio/lib/api/manipulation");

app.use(express.json());
app.use(cors());

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

app.post("/api/address", async (request, response) => {
  const { address } = request.body;
  const pageData = await getPageData(address);
  const dom = cheerio.load(pageData);
  const body = dom("body *");
  const extractedText = await getText(body);
  const summary = await summarize( {text: extractedText[0]}, )
  response.send(summary.extractive);
});

async function getText(elem) {
  let stack = [];
  let visited = [];
  let storage = [];

  stack.push(elem);

  while (stack.length > 0) {
    let current = stack.pop();
    if (current == null) continue;
    if (visited.includes(current)) continue;
    visited.push(current);

    if (current.text()) {
      storage.push(`${current.text()} `);
    }

    for (let i = 0; i < children.length; i++) {
      stack.push(children[i]);
    }
  }
  return storage;
}

async function getPageData(url) {
  const { data } = await axios.get(url);
  return data;
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
