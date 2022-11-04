const { GoogleSpreadsheet } = require('google-spreadsheet');
const credentials = require('../credentials/google-api.json');
const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: true}))
router.use(express.json());
const cors = require('cors');
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");
  router.use(cors());
  next();
});
router.post('/planodeestudo', async (req, res) =>{
    console.log(req.body);
    const doc = new GoogleSpreadsheet('1bKwvjQFonomN5aaHymVBMuyWMpB-Wk2IAqFhPItkHj0');
    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[req.body.materia];
    const rows = await sheet.getRows();
    return res.json({
      plainstudy: rows[req.body.conteudo].plano_de_estudo
    });
});
module.exports = router;