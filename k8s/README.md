# ☸️ Deploy no Kubernetes

Esta pasta contém os manifests para rodar o **lgpd-auth-api** e o **PostgreSQL** em um cluster Kubernetes (local ou em nuvem).

## Arquivos

| Arquivo | O que faz |
|---|---|
| `00-namespace.yaml` | Cria o namespace `lgpd-auth-api`, isolando os recursos do cluster |
| `01-configmap.yaml` | Variáveis de ambiente não sensíveis (porta, nome do banco, etc.) |
| `02-secret.yaml` | Senha do banco, `JWT_SECRET` e `DATABASE_URL` (valores de **exemplo** — troque em produção) |
| `03-postgres-pvc.yaml` | Armazenamento persistente para os dados do banco |
| `04-postgres-init-configmap.yaml` | Schema SQL executado automaticamente na primeira inicialização do banco |
| `05-postgres-deployment.yaml` | Deployment + Service do PostgreSQL |
| `06-api-deployment.yaml` | Deployment (2 réplicas) + Service da API |

## Pré-requisitos

- Um cluster local: [Minikube](https://minikube.sigs.k8s.io/docs/start/) ou [Kind](https://kind.sigs.k8s.io/)
- `kubectl` instalado e configurado
- Docker (para construir a imagem da API)

## Passo a passo

### 1. Construir a imagem da API

```bash
docker build -t lgpd-auth-api:local .
```

Se estiver usando **Minikube**, carregue a imagem no cluster:

```bash
minikube image load lgpd-auth-api:local
```

Se estiver usando **Kind**:

```bash
kind load docker-image lgpd-auth-api:local
```

### 2. Aplicar os manifests

A ordem importa (por isso os arquivos são numerados):

```bash
kubectl apply -f k8s/
```

### 3. Acompanhar o rollout

```bash
kubectl get pods -n lgpd-auth-api -w
```

Espere os pods `postgres` e `lgpd-auth-api` ficarem com status `Running` e `READY 1/1`.

### 4. Acessar a API

Com Minikube:

```bash
minikube service lgpd-auth-api -n lgpd-auth-api --url
```

Com Kind ou qualquer cluster, usando port-forward:

```bash
kubectl port-forward -n lgpd-auth-api svc/lgpd-auth-api 3000:3000
```

A API estará disponível em `http://localhost:3000`.

### 5. Testar

```bash
curl http://localhost:3000/health
```

## Escalando a API

```bash
kubectl scale deployment lgpd-auth-api -n lgpd-auth-api --replicas=4
```

## Limpando tudo

```bash
kubectl delete namespace lgpd-auth-api
```

## ⚠️ Sobre o Secret

O arquivo `02-secret.yaml` está versionado apenas para fins **didáticos**, com valores de exemplo. Em um cenário real:

- Nunca commite secrets reais no Git
- Use ferramentas como [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets), [External Secrets Operator](https://external-secrets.io/) ou o gerenciador de secrets do seu provedor de nuvem
- Gere valores novos com `echo -n 'sua-senha' | base64`
