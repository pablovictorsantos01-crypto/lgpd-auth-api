const pool = require('../config/db');

const UserModel = {
  async criar({ name, email, passwordHash }) {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, passwordHash]
    );
    return rows[0];
  },

  async buscarPorEmail(email) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL',
      [email]
    );
    return rows[0];
  },

  async buscarPorId(id) {
    const { rows } = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    return rows[0];
  },

  // Direito ao esquecimento (LGPD Art. 18, VI) - soft delete + anonimização
  async excluirConta(id) {
    await pool.query(
      `UPDATE users
       SET deleted_at = NOW(),
           name = 'Usuário excluído',
           email = CONCAT('excluido-', id, '@anonimizado.local'),
           password_hash = ''
       WHERE id = $1`,
      [id]
    );
  },

  // Portabilidade de dados (LGPD Art. 18, V)
  async exportarDados(id) {
    const { rows } = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [id]
    );
    const { rows: consents } = await pool.query(
      'SELECT purpose, accepted, created_at FROM consents WHERE user_id = $1',
      [id]
    );
    return { usuario: rows[0], consentimentos: consents };
  },
};

module.exports = UserModel;
