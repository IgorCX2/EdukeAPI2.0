const express = require("express");
const app = express();
const userconfig = require("./api/userconfig");
const slugcontent = require("./api/slugcontent");
const questao = require("./api/questao");
const nivel = require("./api/nivel");
const planodeestudo = require("./api/planodeestudo");
app.use(express.json());

app.use("/api/questao", questao);
app.use("/api/userconfig", userconfig);
app.use("/api/slugcontent", slugcontent);
app.use("/api/nivel", nivel);
app.use("/api/planodeestudo", planodeestudo);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`serve em ${PORT}`));