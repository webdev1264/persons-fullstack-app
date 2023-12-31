require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan"); //morgan is used to log the HTTP request data
const Person = require("./models/person");
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

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

app.get("/api/persons", (req, res) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((e) => {
      res.json({ error: e.message });
    });
});

app.get("/info", (req, res) => {
  Person.find({})
    .then((persons) => {
      const htmlFragment = `<div><p>Phonebook has info for ${
        persons.length
      } people</p><p>${new Date().toString()}</p></div>`;
      res.send(htmlFragment);
    })
    .catch((e) => {
      res.json({ error: e.message });
    });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        return res.json(person);
      }
      return res.status(404).end();
    })
    .catch((e) => {
      next(e);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((deletedPerson) => {
      res.json(deletedPerson);
    })
    .catch((e) => {
      next(e);
    });
});

app.post("/api/persons/", (req, res, next) => {
  const { name, number } = req.body;
  // if (!name || !number) {
  //   return res
  //     .status(400)
  //     .json({ error: "Input name and number in correct format." });
  // }
  const person = new Person({
    name,
    number,
  });
  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((e) => {
      next(e);
    });
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  Person.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((e) => {
      next(e);
    });
});

app.use((req, res) => {
  res.status(404).json({ error: "Unknown endpoint" });
});

app.use((error, req, res, next) => {
  console.log(error.message, error.name);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
