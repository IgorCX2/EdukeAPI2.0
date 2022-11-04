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
router.post('/questao', async (req, res) =>{
    console.log(req.body);
    const doc = new GoogleSpreadsheet('1iu7naOdg9MrEcXJPmZLrA6xKHeEyrMojyeRM9tfHFt0');
    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    });
    await doc.loadInfo();
    const pegarinfobd = await req.body.nivel.toString().split(',');
    const filterItems = (query) => {
        return pegarinfobd?.filter(el => el.toLowerCase().indexOf(query.toLowerCase()) > -1);
    };
    var materia = Math.floor(Math.random() * 2)
    var conteudo = Math.floor(Math.random() * 2)
    console.log(`1sorteio ${materia}:${conteudo}`)
    var contador = 0
    console.log(filterItems(`${materia}:${conteudo}`).length)
    while(filterItems(`${materia}:${conteudo}`).length > 0 && contador == 0){
        const valor = filterItems(`${materia}:${conteudo}`).toString().split('=')
        if(Number(valor[0]) > 9 || Number(valor[0]) < -3){
            materia = Math.floor(Math.random() * 2)
            conteudo = Math.floor(Math.random() * 2)
            console.log(`novamente ${materia}:${conteudo}`)
        }else{
            console.log(`existe mas ta dentro ${materia}:${conteudo}`)
            contador++
        }
    }

    console.log('final')
    console.log(`${materia}:${conteudo}`)
    const sheet = doc.sheetsByIndex[materia];
    const rows = await sheet.getRows();
    console.log(rows[conteudo].questao)
    return res.json({
      questao: rows[conteudo].questao
    });
});
module.exports = router;