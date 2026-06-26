import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,OPTIONS,DELETE");
    next();
});

app.use((req, res, next) => {
    if (req.path !== "/" && !req.path.endsWith("/")) {
        const query = req.url.includes("?")
            ? req.url.slice(req.url.indexOf("?"))
            : "";
        return res.redirect(301, req.path + "/" + query);
    }
    next();
});

app.get("/login/", (req, res) => {
    res.type("text/plain").send("ayham");
});

app.post("/insert/", async (req, res) => {
    const client = new MongoClient(process.env.MONGO_URL);

    try {
        await client.connect();

        await client
            .db()
            .collection("users")
            .insertOne({
                login: req.body.login,
                password: req.body.password
            });

        res.sendStatus(200);
    } finally {
        await client.close();
    }
});

const port = process.env.PORT || 3000;

app.listen(port);
