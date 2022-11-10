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
router.post('/ativo', async (req, res) =>{
    console.log(req.body);
    var sresposta = "N"
    var spagina = "N"
    const doc = new GoogleSpreadsheet('1f8YQMrCehLWPz-99P0mkQm2_WfwpOzjkdW24aZYro0Y');
    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    const arrResposta = rows[req.body.id].resposta.toString().split(',')
    const arrVisu = rows[req.body.id].visualizado.toString().split(',')
    const filterItemsRes = (query) => {
      return arrResposta?.filter(el => el.toLowerCase().indexOf(query.toLowerCase()) > -1);
    };
    const filterVisu = (query) => {
        return arrVisu?.filter(el => el.toLowerCase().indexOf(query.toLowerCase()) > -1);
    };
    if(filterItemsRes(req.body.cod).length > 0){
        sresposta = filterItemsRes(req.body.cod)
    }
    if(filterVisu(req.body.cod).length > 0){
        spagina = filterVisu(req.body.cod)
    }
    return res.json({
      resposta: sresposta,
      pagina: spagina
    });
});

router.post('/remov-ativo', async (req, res) =>{
  console.log(req.body);
  var sresposta = []
  var spagina = []
  const doc = new GoogleSpreadsheet('1f8YQMrCehLWPz-99P0mkQm2_WfwpOzjkdW24aZYro0Y');
  await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  const arrResposta = rows[req.body.id].resposta.toString().split(',')
  const arrVisu = rows[req.body.id].visualizado.toString().split(',')
  const filterItemsRes = (query) => {
    return arrResposta?.filter(el => el.toLowerCase().indexOf(query.toLowerCase()) > -1);
  };
  const filterVisu = (query) => {
      return arrVisu?.filter(el => el.toLowerCase().indexOf(query.toLowerCase()) > -1);
  };
  sresposta = filterItemsRes(req.body.cod)

  spagina = filterVisu(req.body.cod)

  sresposta.map((trocarres) => {
    arrResposta.splice(arrResposta.indexOf(trocarres), 1)
  })
  spagina.map((trocarvis) => {
    arrVisu.splice(arrVisu.indexOf(trocarvis), 1)
  })
  rows[req.body.id].resposta = arrResposta.toString()
  rows[req.body.id].visualizado = arrVisu.toString()
  await rows[req.body.id].save();

  return res.json({
    resposta: sresposta,
    pagina: spagina
  });
});

router.post('/add-ativo', async (req, res) =>{
  console.log(req.body);
  const doc = new GoogleSpreadsheet('1f8YQMrCehLWPz-99P0mkQm2_WfwpOzjkdW24aZYro0Y');
  await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  rows[req.body.id].visualizado = req.body.visu;
  rows[req.body.id].resposta = req.body.res;
  await rows[req.body.id].save();
  return res.json({
    resposta: req.body.visu,
    pagina: req.body.res
  });
});

router.post('/add-historico', async (req, res) =>{
  console.log(req.body);
  const doc = new GoogleSpreadsheet('1IERSb6NCGMTjX8O20E305NU-F5Zi-5953F3OGk_GdFc');
  await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  rows[req.body.id].historico = `${rows[req.body.id].historico},${req.body.cod}`;
  await rows[req.body.id].save();
  return res.json({
    res:  rows[req.body.id].historico,
  });
});
module.exports = router;