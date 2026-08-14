const pool = require('../config/db');

const ConsentModel = {
  async registrar({ userId, purpose, accepted, ip, userAgent }) {
    const { rows } = await pool.query(
      `INSERT INTO consents (user_id, purpose, accepted, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, purpose, accepted, ip, userAgent]
    );
    return rows[0];
  },

  async listarPorUsuario(userId) {
    const { rows } = await pool.query(
      'SELECT * FROM consents WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  },
};

module.exports = ConsentModel;
