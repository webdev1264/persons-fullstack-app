require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan"); //morgan is used to log the HTTP request data
const app = express();

let persons = require("./data/persons");

app.use(express.json());
app.use(cors());
app.use(express.static());

//configuring morgan to add body data to the log
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// //Middleware that logs some request's data
// const requestLogger = (req, res, next) => {
//   console.log("Method:", req.method);
//   console.log("Path:  ", req.path);
//   console.log("Body:  ", req.body);
//   console.log("---");
//   next();
// };

// app.use(requestLogger);

const getRandomNum = (range) => {
  return Math.round(Math.random() * range);
};

const generateId = () => {
  const randomId = getRandomNum(1000);
  const ids = persons.map((person) => person.id);
  if (ids.includes(randomId)) {
    return generateId();
  }
  return randomId;
};

app.get("/api/persons", (req, res) => {
  try {
    res.send(persons);
  } catch (e) {
    console.log(e);
  }
});

app.get("/info", (req, res) => {
  try {
    const htmlFragment = `<div><p>Phonebook has info for ${
      persons.length
    } people</p><p>${new Date().toString()}</p></div>`;
    res.send(htmlFragment);
  } catch (e) {
    console.log(e);
  }
});

app.get("/api/persons/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const person = persons.find((person) => person.id === id);
    if (person) {
      return res.json(person);
    }
    return res.status(404).end();
  } catch (e) {
    console.log(e);
  }
});

app.delete("/api/persons/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    persons = persons.filter((person) => person.id !== id);
    return res.status(204).end();
  } catch (e) {
    console.log(e);
  }
});

app.post("/api/persons/", (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.number) {
      return res
        .status(400)
        .json({ error: "Input name and number in correct format." });
    }
    const isNameUnique = persons.find((person) => person.name === body.name)
      ? false
      : true;
    if (!isNameUnique) {
      return res.status(400).json({ error: "Name must be unique" });
    }
    const person = { id: generateId(), name: body.name, number: body.number };
    persons.push(person);
    res.json(person);
  } catch (e) {
    console.log(e);
  }
});

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "Unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
