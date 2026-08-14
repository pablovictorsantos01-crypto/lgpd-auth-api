const pool = require('../config/db');

/**
 * Registra em log toda ação sensível envolvendo dados pessoais,
 * atendendo ao princípio da rastreabilidade previsto na LGPD (Art. 6º, X).
 */
function logAcesso(action) {
  return async (req, res, next) => {
    try {
      await pool.query(
        'INSERT INTO data_access_logs (user_id, action, ip_address) VALUES ($1, $2, $3)',
        [req.userId || null, action, req.ip]
      );
    } catch (err) {
      console.error('Falha ao registrar log de acesso:', err.message);
    }
    next();
  };
}

module.exports = logAcesso;
