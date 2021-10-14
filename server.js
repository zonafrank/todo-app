require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const buildHtmlTemplate = require("./template");

const app = express();
const dbName = "todo-app";
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

const uri = `mongodb+srv://echezona:${process.env.DB_PASS}@cluster0.xhujs.mongodb.net/${dbName}?retryWrites=true&w=majority`;

async function main() {
  try {
    await mongoose.connect(uri);
    console.log("Successfully connected to database.");
    app.listen(PORT, () => {
      console.log("Server running on port:", PORT);
    });
  } catch (error) {
    throw error;
  }
}

const todoSchema = new mongoose.Schema({ text: String });
const Todo = mongoose.model("Todo", todoSchema);

app.get("/", async (req, res) => {
  const todos = await Todo.find({});
  const markup = buildHtmlTemplate(todos);
  res.send(markup);
});

app.post("/create-item", async (req, res) => {
  try {
    const todo = new Todo({ text: req.body.text });
    const dbResponse = await todo.save();
    res.json(dbResponse);
  } catch (error) {
    console.log(error);
  }
});

app.post("/update-item", async (req, res) => {
  console.log("from update route");
  const { id, text } = req.body;
  const uppdatedTodo = await Todo.findByIdAndUpdate(
    id,
    { text },
    { new: true }
  );
  res.json({ success: true });
});

app.post("/delete-item", async (req, res) => {
  try {
    console.log("from update route");
    const { id } = req.body;
    const uppdatedTodo = await Todo.findByIdAndRemove(id);
    res.json({ success: true });
  } catch (error) {
    throw error;
  }
});

process.on("exit", (code) => {
  console.log("Process exit event with code: ", code);
  mongoose.connection.close(() => {
    console.log("Database connection closed.");
  });
});

main();
