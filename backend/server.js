const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const testRoutes = require("./routes/testRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/test", testRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

mongoose
.connect(process.env.MONGO_URI)
.then(() => {

    console.log("MongoDB Connected");

    app.listen(process.env.PORT, () => {

        console.log("====================================");
        console.log("🚀 Quizonix Server Running");
        console.log("Port :", process.env.PORT);
        console.log("====================================");

    });

})
.catch(err => console.log(err));

app.get("/", (req,res)=>{

    res.json({

        project:"Quizonix",

        status:"Running"

    });

});