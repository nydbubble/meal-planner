const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(express.json({ extended: false }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/recipes", require("./routes/recipes"));
app.use("/api/meals", require("./routes/meals"));

//Serve static assets in production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => console.log("Server started"));
