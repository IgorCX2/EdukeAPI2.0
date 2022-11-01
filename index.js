const express = require("express");
const app = express();
const userconfig = require("./api/userconfig");
app.use(express.json());

app.use("/api/userconfig", userconfig);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`serve em ${PORT}`));