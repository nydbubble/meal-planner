const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const connectCloudinary = require("./config/cloudinary");

const app = express();

connectDB();
connectCloudinary();

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
