const express = require("express");
const app = express();
const path = require("path");

const cookieSession = require("cookie-session");

const handlebars = require("express-handlebars");
const { engine } = require("express-handlebars");

const authRouter = require("./routes/auth");
const petitionRouter = require("./routes/petition");
const editRouter = require("./routes/edit");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.use(express.urlencoded());

app.use(express.static(path.join(__dirname, "public")));

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(authRouter);
app.use(petitionRouter);
app.use(editRouter);

app.listen(8080);
