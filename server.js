const express = require("express");
const app = express();
const cors = require("cors");
const cheerio = require("cheerio");
const axios = require("axios");
const summarize = require("text-summarization");
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
  const extractedText = await getText(dom._root);
  const summary = await summarize({ text: extractedText });
  response.send(summary.extractive);
});

async function getText(elem) {
  let stack = [];
  let visited = [];
  let storage = [];
  const nonWanted = [
    "img",
    "option",
    "script",
    "link",
    "path",
    "svg",
    "g",
    "polygon",
    "meta",
  ];

  stack.push(elem);

  while (stack.length > 0) {
    let current = stack.pop();

    if (current == null) continue;

    if (visited.includes(current)) continue;

    visited.push(current);

    if (current.type === "text" && !nonWanted.includes(current.name)) {
      storage.push(`${current.data} `);
    }



    if (current.children?.length) {
      for (const child of current.children) {
        stack.push(child);
      }
    }
  }

  // console.log(storage.join(' '))
  return storage.join(" ");
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
