const bcrypt = require('bcryptjs');
const { z } = require('zod');
const UserModel = require('../models/userModel');
const ConsentModel = require('../models/consentModel');
const { gerarToken } = require('../utils/token');

const registerSchema = z.object({
  name: z.string().min(2, 'Nome muito curto.'),
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.'),
  aceitaTermos: z.literal(true, {
    errorMap: () => ({ message: 'É necessário aceitar os termos de uso e a política de privacidade (LGPD).' }),
  }),
});

const loginSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(1, 'Informe a senha.'),
});

async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ erro: parsed.error.issues[0].message });
  }

  const { name, email, password } = parsed.data;

  const existente = await UserModel.buscarPorEmail(email);
  if (existente) {
    return res.status(409).json({ erro: 'E-mail já cadastrado.' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await UserModel.criar({ name, email, passwordHash });

  // Registro formal do consentimento do titular (LGPD Art. 8º, §1º)
  await ConsentModel.registrar({
    userId: user.id,
    purpose: 'cadastro_termos_privacidade',
    accepted: true,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  const token = gerarToken({ id: user.id });
  return res.status(201).json({ usuario: user, token });
}

async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ erro: parsed.error.issues[0].message });
  }

  const { email, password } = parsed.data;
  const user = await UserModel.buscarPorEmail(email);

  // Mensagem genérica de propósito para não revelar se o e-mail existe (mitiga enumeração de usuários)
  if (!user) {
    return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
  }

  const senhaValida = await bcrypt.compare(password, user.password_hash);
  if (!senhaValida) {
    return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
  }

  const token = gerarToken({ id: user.id });
  return res.json({
    usuario: { id: user.id, name: user.name, email: user.email },
    token,
  });
}

module.exports = { register, login };
