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
router.post('/cad-user', async (req, res) =>{
  console.log(req.body);
  const doc = new GoogleSpreadsheet('1FJK-uyJ2gUQSH--XNAjrAdWihmS7zdJ_gvo7TQzgrhA');
  await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  rows[0].primarykey = Number(rows[0].primarykey) + 1;
  await rows[0].save();
  const larryRow = await sheet.addRow({id_user: rows[0].primarykey, nick:req.body.usuario, email:req.body.email, senha:req.body.senha, tema:'W', pontos:'0', perfil:'0', tempoderesposta:'0', nivel:req.body.escolaridade, estado: '0'});
  await larryRow.save()
  .then(()=>{
    return res.json({
      mensagem: "cadastrado"
    });
  }).catch(()=>{
    return res.json({
      mensagem: "erro"
    });
  });
});
router.post('/cad-nivel', async (req, res) =>{
  console.log(req.body);
  const doc = new GoogleSpreadsheet('1IERSb6NCGMTjX8O20E305NU-F5Zi-5953F3OGk_GdFc');
  await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const larryRow = await sheet.addRow({nivel: "0=0:0"});
  await larryRow.save()
  return res.json({
    mgs: "cadastrado"
  });
});
router.post('/user-id', async (req, res) =>{
  console.log(req.body);
  const doc = new GoogleSpreadsheet('1FJK-uyJ2gUQSH--XNAjrAdWihmS7zdJ_gvo7TQzgrhA');
  await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  return res.json({
    estado: rows[req.body.id].estado
  });
});
router.post('/mudar-status', async (req, res) =>{
  console.log(req.body);
  const doc = new GoogleSpreadsheet('1FJK-uyJ2gUQSH--XNAjrAdWihmS7zdJ_gvo7TQzgrhA');
  await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key,
  });
  await doc.loadInfo();
  console.log
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  var newstatus = []
  const statusantigo = rows[req.body.id].estado.toString().split(',')
  const filterItemsRes = (query) => {
    return statusantigo?.filter(el => el.toLowerCase().indexOf(query.toLowerCase()) > -1);
  };
  newstatus = filterItemsRes(req.body.newstatus)
  statusantigo.splice(statusantigo.indexOf(newstatus), 1)
  rows[req.body.id].estado = statusantigo.toString()
  console.log(rows[req.body.id].estado)
  await rows[req.body.id].save();
  return res.json({
    status: rows[req.body.id].estado
  });
});

router.post('/add-plain', async (req, res) =>{
  console.log(req.body);
  const doc = new GoogleSpreadsheet('1FJK-uyJ2gUQSH--XNAjrAdWihmS7zdJ_gvo7TQzgrhA');
  await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  rows[req.body.id].estado = `${rows[req.body.id].estado},${req.body.estado}`;
  await rows[req.body.id].save();
  return res.json({
    status: rows[req.body.id].estado
  });
});

router.get('/list-user', async (req, res) =>{
  const doc = new GoogleSpreadsheet('1FJK-uyJ2gUQSH--XNAjrAdWihmS7zdJ_gvo7TQzgrhA');
  await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  const users = rows.map(({id_user, nick, email, senha, tema, pontos, perfil, tempoderesposta, estado}) => {
    return{
      id_user, 
      nick, 
      email, 
      senha, 
      tema, 
      pontos, 
      perfil, 
      tempoderesposta,
      estado
    }
  })
  res.send({
    users,
    primarykey: Number(rows[0].primarykey)
  })
});
module.exports = router;