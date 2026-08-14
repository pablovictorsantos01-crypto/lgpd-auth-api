const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
  it('deve retornar status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('POST /auth/register', () => {
  it('deve rejeitar cadastro sem aceite dos termos (LGPD)', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Maria Silva',
      email: 'maria@example.com',
      password: 'senhaSegura123',
    });
    expect(res.statusCode).toBe(400);
  });

  it('deve rejeitar senha curta', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Maria Silva',
      email: 'maria@example.com',
      password: '123',
      aceitaTermos: true,
    });
    expect(res.statusCode).toBe(400);
  });
});
