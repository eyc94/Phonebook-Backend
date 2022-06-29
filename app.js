const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const personsRouter = require("./controllers/persons");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

morgan.token("data", (req) => {
    return JSON.stringify(req.body);
});

logger.info("Connecting to", config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info("Connected to MongoDB");
    })
    .catch((error) => {
        logger.error("Error connecting to MongoDB:", error.message);
    });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"));

app.use("/api/persons", personsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
