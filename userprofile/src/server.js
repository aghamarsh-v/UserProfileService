const express = require("express");
const connectDB = require("./db/db");
const cookieParser = require("cookie-parser");
const {userAuth} = require("./middleware/auth");

// middleware
const app = express()
app.use(express.json())
app.use(cookieParser());

connectDB();
const PORT = 5000
const server = app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`))

// registerUser end point (user authentication)
app.use("/api/", require("./Auth/Route"));

// user authorization
app.get("/basic", userAuth, (req, res) => { res.send("User Route") });
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" })
})

// Handling Error
process.on("unhandledRejection", err => {
  console.log(`An error occurred: ${err.message}`)
  server.close(() => process.exit(1))
})
