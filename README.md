# AuthFlow — Autenticação e Gestão de Usuários

![Status](https://img.shields.io/badge/status-concluído-22c55e)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Prisma-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-blue)

Aplicação Full Stack para autenticação e gerenciamento de usuários fictícios. O projeto combina uma interface cyber inspirada em ambientes virtuais com uma API REST protegida, persistência de dados e um painel CRUD completo.

> Projeto educacional desenvolvido para estudo e portfólio. Todos os dados utilizados na demonstração devem ser fictícios.

## Demonstração

A aplicação oferece duas formas de acesso:

- **Criar conta:** registra uma conta com senha protegida.
- **Acessar demonstração:** abre uma sessão temporária sem necessidade de cadastro.

Depois do acesso, o usuário encontra um painel para cadastrar, pesquisar, editar e excluir registros fictícios.

## Funcionalidades

### Autenticação

- Criação de conta
- Login com e-mail e senha
- Acesso demonstrativo sem cadastro
- Senhas protegidas com `bcrypt`
- Autenticação utilizando JWT
- Sessão com duração de 2 horas
- Encerramento automático de sessão expirada
- Logout seguro
- Mensagens de erro e sucesso

### Gerenciamento de usuários

- Cadastro de usuários
- Listagem dos registros
- Pesquisa por nome, e-mail ou idade
- Edição de informações
- Exclusão com confirmação personalizada
- Validação dos dados no front-end e no back-end
- Indicadores com total de usuários e média de idade
- Estados de carregamento e lista vazia

### Interface

- Design cyber inspirado em ambientes virtuais
- Cena 3D interativa com Spline
- Grade de fundo com interação suave pelo mouse
- Animações com Framer Motion
- Layout responsivo
- Interface adaptada para dispositivos móveis
- Suporte a `prefers-reduced-motion`
- Ícones com Lucide React

## Tecnologias

### Front-end

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Spline 3D
- Axios
- Lucide React
- Estrutura de componentes inspirada em shadcn/ui

### Back-end

- Node.js
- Express
- Prisma ORM
- MongoDB
- Zod
- JSON Web Token
- bcrypt

## Arquitetura

```mermaid
flowchart LR
    A[React + TypeScript] -->|Axios| B[API Express]
    B -->|Prisma ORM| C[(MongoDB)]
    B --> D[JWT]
    B --> E[bcrypt]
```

O navegador nunca acessa o banco diretamente:

```text
Front-end → API Express → Prisma → MongoDB
```

## Estrutura do projeto

```text
authflow-fullstack/
├── Backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── lib/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── Front-end/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/
│   │   ├── lib/
│   │   ├── service/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

## Modelos do banco

O projeto separa contas de acesso dos usuários administrados pelo CRUD.

### `Account`

Armazena as contas autorizadas a entrar no sistema:

- Nome
- E-mail
- Hash da senha
- Data de criação
- Data de atualização

### `User`

Armazena os usuários fictícios cadastrados no painel:

- Nome
- E-mail
- Idade
- Data de criação
- Data de atualização

O acesso demonstrativo gera uma sessão temporária e não cria um registro em `Account`.

## Como executar

### Requisitos

Antes de começar, tenha instalado:

- Node.js 20 ou superior
- npm
- Uma conexão com MongoDB
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/CauaRodolpho/authflow-fullstack.git
cd authflow-fullstack
```

### 2. Instale as dependências

Na pasta principal:

```bash
npm install
npm run install:all
```

### 3. Configure o back-end

Copie o arquivo de exemplo:

#### Windows

```bash
copy Backend\.env.example Backend\.env
```

#### Linux ou macOS

```bash
cp Backend/.env.example Backend/.env
```

Abra `Backend/.env` e configure:

```env
DATABASE_URL="mongodb+srv://USUARIO:SENHA@CLUSTER.mongodb.net/authflow?retryWrites=true&w=majority"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
JWT_SECRET="adicione-uma-chave-secreta-com-pelo-menos-32-caracteres"
```

O `JWT_SECRET` pode ser gerado com:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> Nunca envie o arquivo `.env` ao GitHub.

### 4. Prepare o Prisma

```bash
npm run prisma:generate
npm run prisma:push
```

### 5. Inicie o projeto

```bash
npm run dev
```

Endereços locais:

- Front-end: `http://localhost:5173`
- API: `http://localhost:3000`
- Verificação da API: `http://localhost:3000/health`

## Comandos disponíveis

| Comando | Função |
| --- | --- |
| `npm run dev` | Inicia front-end e back-end |
| `npm run dev:frontend` | Inicia somente o front-end |
| `npm run dev:backend` | Inicia somente o back-end |
| `npm run build` | Gera o build do front-end |
| `npm run lint` | Executa a análise do front-end |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run prisma:push` | Sincroniza o schema com o banco |
| `npm run prisma:studio` | Abre o Prisma Studio |

## Endpoints

### Autenticação

| Método | Rota | Função |
| --- | --- | --- |
| `POST` | `/auth/register` | Cria uma conta |
| `POST` | `/auth/login` | Autentica uma conta |
| `POST` | `/auth/demo` | Gera uma sessão demonstrativa |

### Usuários

As rotas abaixo exigem um token JWT:

| Método | Rota | Função |
| --- | --- | --- |
| `POST` | `/usuarios` | Cadastra um usuário |
| `GET` | `/usuarios` | Lista ou pesquisa usuários |
| `GET` | `/usuarios/:id` | Busca um usuário |
| `PUT` | `/usuarios/:id` | Atualiza um usuário |
| `DELETE` | `/usuarios/:id` | Exclui um usuário |

### Sistema

| Método | Rota | Função |
| --- | --- | --- |
| `GET` | `/health` | Verifica o funcionamento da API |

## Segurança

- Senhas armazenadas somente como hash bcrypt
- Tokens JWT assinados no back-end
- Rotas do CRUD protegidas
- Validação de entrada com Zod
- Hashes de senha nunca são enviados ao navegador
- Respostas de autenticação utilizam `Cache-Control: no-store`
- CORS configurável por variável de ambiente
- Arquivos `.env` ignorados pelo Git
- Cabeçalho `x-powered-by` desabilitado

Este projeto apresenta fundamentos de segurança para fins educacionais. Antes de utilizá-lo em produção, seriam necessárias medidas adicionais, como rate limiting, cookies `httpOnly`, recuperação de senha e testes automatizados.

## Solução de problemas no Windows

### Tailwind sem estilização

O PostCSS deve permanecer neste caminho:

```text
Front-end/postcss.config.cjs
```

Se o Vite mantiver um cache antigo:

```bash
cd Front-end
rmdir /s /q node_modules\.vite
npm run dev -- --force
```

### CSS antigo no Brave

Desative o Brave Shields para:

```text
localhost:5173
```

Ou atualize com:

```text
Ctrl + F5
```

### Prisma não encontra `DATABASE_URL`

Confirme que o arquivo existe em:

```text
Backend/.env
```

Depois execute novamente:

```bash
npm run prisma:generate
npm run prisma:push
```

## Melhorias futuras

- Controle de acesso por perfil
- Recuperação de senha
- Histórico de acessos
- Paginação de usuários
- Testes automatizados
- Autenticação por cookies `httpOnly`
- Rate limiting no back-end

## Autor

Desenvolvido por **Cauã Rodolpho**.

- [GitHub](https://github.com/CauaRodolpho)
- [LinkedIn](https://www.linkedin.com/in/cau%C3%A3-rodolpho/)

## Licença

Este projeto utiliza a licença ISC.