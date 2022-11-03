const express = require("express");
const app = express();
const userconfig = require("./api/userconfig");
const questao = require("./api/questao");
const nivel = require("./api/nivel");
app.use(express.json());

app.use("/api/questao", questao);
app.use("/api/userconfig", userconfig);
app.use("/api/nivel", nivel);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`serve em ${PORT}`));