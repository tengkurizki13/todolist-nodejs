require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const db = require("./db");

const port = process.env.PORT || 3030;
const host = process.env.HOST || "localhost";

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes

// get all todos
app.get("/activity-groups", async (req, res) => {
  try {
    const data = await db.find();
    res.json({
      status: "Success",
      message: "Success",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});

// get one todo
app.get("/activity-groups/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let validateData = await db.findOne(id);
    if (!validateData) {
      return res.json({
        status: "Not Found",
        message: `Activity with ID ${id} Not Found`,
      });
    }
    const data = await db.findOne(id);
    res.json({
      status: "Success",
      message: "Success",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});

// create todo
app.post("/activity-groups", async (req, res) => {
  try {
    const body = req.body;

    if (body.title === "" || !body.title) {
      return res.json({
        status: "Bad Request",
        message: "title cannot be null",
      });
    }

    const data = await db.create(body);

    res.json({
      status: "Success",
      message: "Success",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});

// delete todo
app.delete("/activity-groups/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let validateData = await db.findOne(id);
    if (!validateData) {
      return res.json({
        status: "Not Found",
        message: `Activity with ID ${id} Not Found`,
      });
    }

    await db.destroy(id);

    res.json({
      status: "Success",
      message: "Success",
      data: {},
    });
  } catch (error) {
    console.log(error);
  }
});

// // update todo
app.put("/activity-groups/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    let validateData = await db.findOne(id);
    if (!validateData) {
      return res.json({
        status: "Not Found",
        message: `Activity with ID ${id} Not Found`,
      });
    }

    if (body.title === "" || !body.title || body.email === "" || !body.email) {
      return res.json({
        status: "Bad Request",
        message: "title cannot be null",
      });
    }

    const data = await db.update(id, body);

    res.json({
      status: "Success",
      message: "Success",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});

// 404 endpoint middleware
app.all("*", (req, res) => {
  res.status(404).json({ message: `${req.originalUrl} not found!` });
});

// error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message || "An error occurred.",
  });
});

const run = async () => {
  await db.migration(); // 👈 running migration before server
  app.listen(port); // running server
  console.log(`Server run on http://${host}:${port}/`);
};

run();
