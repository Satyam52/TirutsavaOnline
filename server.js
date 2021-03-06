require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 80;
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieSession({
	maxAge: 3 * 24 * 60 * 60 * 1000,
	keys: [process.env.COOKIEKEY]
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose
	.connect(process.env.DBURL, { useNewUrlParser: true, useCreateIndex: true })
	.then(() => console.log("Database is Connected..."))
	.catch(err => console.log(err));

//Auth

require('./services/auth_passport.js');

app.use('/auth', require('./routes/auth.js'));

//Routes

app.get('/jsonfail', (req, res) => {
	res.send({ valid: false });
});

app.use("/api/events" ,require("./routes/events.js"));
app.use("/api/queries", require("./routes/queries.js"));
app.use("/api/seeder", require("./routes/seeder.js"));
app.use('/c3', require("./routes/c3"));
app.use('/user', require("./routes/user"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.static(path.join(__dirname, "c3/build")));

app.use("/liveevents/gettime", (req, res) => {
	const t = new Date();
	const date = t.getDate();
	const min = t.getMinutes();
	const hour = t.getHours();
	const sec = t.getSeconds();
	const time = {
		date: date,
		hour: hour,
		min: min,
		sec:sec
	}
	res.send({ time: time });
});

app.use("/liveevents/c3", (req, res) => {
	res.sendFile(path.join(__dirname, "c3", "build", "index.html"));
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(PORT, function () {
	console.log("Server is running on Port: ", PORT);
});
