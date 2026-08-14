const express = require('express');
const autenticar = require('../middlewares/auth');
const logAcesso = require('../middlewares/logAcesso');
const {
  perfil,
  exportarDados,
  excluirConta,
  listarConsentimentos,
} = require('../controllers/userController');

const router = express.Router();

router.use(autenticar);

router.get('/me', perfil);
router.get('/me/exportar', logAcesso('export_data'), exportarDados);
router.delete('/me', logAcesso('delete_account'), excluirConta);
router.get('/me/consentimentos', listarConsentimentos);

module.exports = router;
