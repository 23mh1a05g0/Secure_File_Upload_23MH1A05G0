require("dotenv").config(); // ✅ MUST BE FIRST LINE

const express = require("express");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth_route");
const fileRoutes = require("./routes/file_routes");
const dashboardRoutes = require("./routes/dashboard");


connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use(dashboardRoutes);

app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/dashboard", (req, res) => {res.render("dashboard");});
app.get("/otp", (req, res) => {res.render("otp");});



app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
