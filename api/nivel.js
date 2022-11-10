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
router.post('/nivel', async (req, res) =>{
    console.log(req.body);
    const doc = new GoogleSpreadsheet('1IERSb6NCGMTjX8O20E305NU-F5Zi-5953F3OGk_GdFc');
    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    const pegarinfobd = await rows[req.body.id].nivel.toString().split(',');
    console.log(pegarinfobd)
    const filterItems = (query) => {
        return pegarinfobd?.filter(el => el.toLowerCase().indexOf(query.toLowerCase()) > -1);
    };
    req.body.nivel.split(',').map((valor) => {
        const nivel = valor.split('=')
        const filtro = filterItems(nivel[1])
        console.log(`valor procurado ${nivel[1]}`)
        if(filtro.length > 0){
            const position = pegarinfobd.indexOf(filtro.toString())
            const pegarvalor = pegarinfobd[position].split('=')
            const mudarvalor = Number(pegarvalor[0])+Number(nivel[0])
            pegarinfobd[position] = `${mudarvalor}=${pegarvalor[1]}`
            console.log("existe =(")
            /*console.log(filtro)
            console.log(` ${pegarvalor[1]} + ${nivel[1]} = ${mudarvalor}`)
            console.log(`novo ${pegarvalor[0]}=${mudarvalor}`)*/
        }else{
            console.log("NNNNNN =)")
            pegarinfobd.push(valor)
        }
    })
    console.log(pegarinfobd)
    rows[req.body.id].nivel = pegarinfobd.toString();
    await rows[0].save()
    .then(()=>{
      return res.json({
        mensagem: rows[req.body.id].nivel
      });
    }).catch(()=>{
      return res.json({
        mensagem: "erro"
      });
    });
});

router.post('/historico', async (req, res) =>{
  console.log(req.body);
  var status = "N"
  const doc = new GoogleSpreadsheet('1IERSb6NCGMTjX8O20E305NU-F5Zi-5953F3OGk_GdFc');
  await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  const historicoarraybd = rows[req.body.id].historico.toString().split(',')
  const filterItems = (query) => {
    return historicoarraybd?.filter(el => el.toLowerCase().indexOf(query.toLowerCase()) > -1);
  };
  if(filterItems(req.body.cod).length > 0){
    status = "feito"
  }
  console.log(filterItems(req.body.cod))
  console.log(status)
  return res.json({
    status: status
  });
});
module.exports = router;