const UserModel = require('../models/userModel');
const ConsentModel = require('../models/consentModel');

async function perfil(req, res) {
  const user = await UserModel.buscarPorId(req.userId);
  if (!user) return res.status(404).json({ erro: 'Usuário não encontrado.' });
  return res.json(user);
}

// LGPD Art. 18, V - direito de portabilidade dos dados
async function exportarDados(req, res) {
  const dados = await UserModel.exportarDados(req.userId);
  res.setHeader('Content-Disposition', 'attachment; filename="meus-dados.json"');
  return res.json(dados);
}

// LGPD Art. 18, VI - direito à eliminação dos dados pessoais
async function excluirConta(req, res) {
  await UserModel.excluirConta(req.userId);
  return res.json({ mensagem: 'Conta e dados pessoais excluídos/anonimizados com sucesso.' });
}

async function listarConsentimentos(req, res) {
  const consents = await ConsentModel.listarPorUsuario(req.userId);
  return res.json(consents);
}

module.exports = { perfil, exportarDados, excluirConta, listarConsentimentos };
