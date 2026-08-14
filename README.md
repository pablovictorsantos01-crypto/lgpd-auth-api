# 🔐 LGPD Auth API

API REST de autenticação (cadastro e login) construída em **Node.js + Express + PostgreSQL**, com autenticação via **JWT** e conformidade com a **LGPD (Lei Geral de Proteção de Dados — Lei nº 13.709/2018)**.

Projeto criado como portfólio, demonstrando boas práticas de backend: autenticação segura, containerização com Docker, CI no GitHub Actions e tratamento de dados pessoais.

![CI](https://github.com/pablovictorsantos01-crypto/lgpd-auth-api/actions/workflows/ci.yml/badge.svg)
![Node](https://img.shields.io/badge/node-20.x-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Funcionalidades

- Cadastro de usuário com senha criptografada (`bcrypt`)
- Login com emissão de token JWT
- Rota protegida de perfil (`/users/me`)
- **Conformidade LGPD**:
  - Registro formal de consentimento no cadastro (Art. 8º)
  - Exportação dos dados pessoais do titular — portabilidade (Art. 18, V)
  - Exclusão/anonimização de conta — direito ao esquecimento (Art. 18, VI)
  - Log de acesso a dados sensíveis — rastreabilidade (Art. 6º, X)
- Rate limiting no login (proteção contra força bruta)
- Cabeçalhos de segurança com `helmet`
- Validação de entrada com `zod`
- Testes automatizados com `jest` + `supertest`
- Pipeline de CI no GitHub Actions
- Ambiente containerizado com Docker e docker-compose

---

## 🗂️ Estrutura do projeto

```
lgpd-auth-api/
├── src/
│   ├── config/         # conexão com banco e schema.sql
│   ├── controllers/     # regras de negócio das rotas
│   ├── middlewares/      # autenticação e log de acesso (LGPD)
│   ├── models/           # acesso ao banco de dados
│   ├── routes/            # definição das rotas
│   ├── utils/              # geração/validação de token JWT
│   ├── app.js               # configuração do Express
│   └── server.js             # ponto de entrada da aplicação
├── tests/                       # testes automatizados
├── .github/workflows/ci.yml       # pipeline de CI
├── docker-compose.yml
├── Dockerfile
└── .env.example
```

---

## 🚀 Como rodar o projeto

### Opção 1 — com Docker (recomendado)

```bash
git clone https://github.com/pablovictorsantos01-crypto/lgpd-auth-api.git
cd lgpd-auth-api
docker compose up --build
```

A API sobe em `http://localhost:3000` já com o banco PostgreSQL configurado e o schema criado automaticamente.

### Opção 2 — localmente

Pré-requisitos: Node.js 20+ e PostgreSQL rodando.

```bash
npm install
cp .env.example .env   # ajuste as variáveis, principalmente DATABASE_URL e JWT_SECRET
psql -U postgres -d lgpd_auth -f src/config/schema.sql
npm run dev
```

---

## 📮 Endpoints principais

| Método | Rota                     | Autenticação | Descrição                                   |
|--------|---------------------------|:---:|----------------------------------------------|
| POST   | `/auth/register`          | não | Cria usuário (exige `aceitaTermos: true`)     |
| POST   | `/auth/login`              | não | Autentica e retorna token JWT                 |
| GET    | `/users/me`                  | sim | Retorna dados do usuário logado                |
| GET    | `/users/me/exportar`          | sim | Exporta todos os dados pessoais (LGPD)          |
| DELETE | `/users/me`                    | sim | Exclui/anonimiza a conta (LGPD)                  |
| GET    | `/users/me/consentimentos`        | sim | Lista o histórico de consentimentos do usuário    |

**Exemplo de cadastro:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@example.com",
    "password": "senhaSegura123",
    "aceitaTermos": true
  }'
```

Rotas protegidas exigem o header:
```
Authorization: Bearer <token>
```

---

## 🛡️ Sobre a conformidade com a LGPD

Este projeto foi pensado para demonstrar, na prática, alguns dos princípios e direitos previstos na LGPD:

- **Consentimento explícito** (Art. 8º): o cadastro só é concluído se o usuário aceitar os termos, e esse consentimento é registrado com data, IP e finalidade.
- **Direito de acesso e portabilidade** (Art. 18, incisos II e V): o usuário pode exportar todos os seus dados a qualquer momento.
- **Direito à eliminação** (Art. 18, inciso VI): o usuário pode excluir sua conta; os dados são anonimizados em vez de simplesmente apagados, preservando a integridade de registros relacionados.
- **Rastreabilidade** (Art. 6º, X): ações sensíveis (exportação, exclusão) ficam registradas em log.

> ⚠️ Este é um projeto educacional/portfólio. Para uso em produção, é necessário revisão jurídica, política de privacidade completa, criptografia de dados em repouso e um DPO (encarregado de dados) formalmente designado.

---

## 🧪 Testes

```bash
npm test
```

---

## 🛠️ Tecnologias

Node.js · Express · PostgreSQL · JWT · bcrypt · zod · Docker · GitHub Actions · Jest

---

## 📄 Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.
