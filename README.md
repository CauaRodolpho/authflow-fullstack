# AuthFlow Fullstack

Projeto demonstrativo Full Stack para cadastro e gerenciamento de usuarios ficticios. A aplicacao integra um front-end React com uma API Express, Prisma e MongoDB.

> Todos os dados utilizados neste projeto devem ser ficticios e destinados somente a estudo e demonstracao.

## Tecnologias

- React e Vite
- TypeScript, Tailwind CSS e estrutura shadcn
- Spline 3D, Framer Motion e Lucide Icons
- Axios
- Node.js e Express
- Prisma ORM
- MongoDB
- Zod
- JWT e bcrypt

## Funcionalidades

- Login, criacao de conta e acesso demonstrativo sem cadastro
- Senhas protegidas com hash bcrypt e sessao JWT de 2 horas
- Cadastro, listagem, pesquisa, edicao e exclusao de usuarios ficticios
- Rotas do CRUD protegidas e encerramento automatico de sessao expirada
- Confirmacao personalizada de exclusao e mensagens de sucesso ou erro
- Interface responsiva com Spline 3D, grade interativa e movimento reduzido

## Estrutura

```text
authflow-fullstack/
|-- Front-end/
|-- Backend/
|-- .gitignore
`-- README.md
```

O navegador nunca acessa o banco diretamente:

```text
Front-end -> API Express -> Prisma -> MongoDB
```

## Configuracao

### Instalacao completa pela raiz

O front-end e o back-end ja fazem parte do mesmo projeto. Na pasta principal,
instale o comando que inicia os dois servicos e as dependencias de cada parte:

```bash
npm install
npm run install:all
```

Crie o arquivo `Backend/.env` usando `Backend/.env.example` como modelo e
adicione a sua conexao do MongoDB. Em seguida, prepare o Prisma:

```bash
npm run prisma:generate
npm run prisma:push
```

Para iniciar o front-end e o back-end juntos:

```bash
npm run dev
```

- Front-end: `http://localhost:5173`
- Back-end: `http://localhost:3000`
- Verificacao da API: `http://localhost:3000/health`

O `JWT_SECRET` do arquivo `Backend/.env` deve possuir pelo menos 32 caracteres.

Os comandos separados continuam disponiveis com `npm run dev:frontend` e
`npm run dev:backend`.

### Back-end

Entre na pasta do servidor e instale as dependencias:

```bash
cd Backend
npm install
```

Copie `.env.example` para `.env` e preencha a conexao MongoDB:

```env
DATABASE_URL="sua_conexao_mongodb"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
JWT_SECRET="uma-chave-segura-com-pelo-menos-32-caracteres"
```

Prepare o Prisma e inicie a API:

```bash
npm run prisma:generate
npm run prisma:push
npm run dev
```

A verificacao da API fica disponivel em `http://localhost:3000/health`.

### Front-end

Em outro terminal:

```bash
cd Front-end
npm install
npm run dev
```

Opcionalmente, copie `.env.example` para `.env` se precisar alterar a URL da API.

## Endpoints atuais

| Metodo | Rota | Funcao |
| --- | --- | --- |
| GET | `/health` | Verifica a API |
| POST | `/auth/register` | Cria uma conta e retorna um token |
| POST | `/auth/login` | Autentica e retorna um token |
| POST | `/auth/demo` | Libera o acesso demonstrativo |
| POST | `/usuarios` | Cadastra um usuario ficticio |
| GET | `/usuarios` | Lista ou filtra usuarios |
| GET | `/usuarios/:id` | Busca um usuario |
| PUT | `/usuarios/:id` | Atualiza um usuario |
| DELETE | `/usuarios/:id` | Exclui um usuario |

## Seguranca

- Arquivos `.env` nao devem ser enviados ao GitHub.
- Nunca use senhas, emails ou dados pessoais reais neste projeto demonstrativo.
- As senhas das contas sao armazenadas somente como hash bcrypt.
- As rotas de usuarios exigem um token JWT valido, inclusive no acesso demo.
- Respostas de autenticacao usam `Cache-Control: no-store`.
- O navegador nunca recebe o hash da senha.

## Uso demonstrativo

Na tela inicial, `Acessar demonstracao` cria uma sessao temporaria sem exigir
cadastro. Contas de acesso ficam separadas dos usuarios ficticios gerenciados
no painel.

## Solucao de problemas no Windows

- Use apenas `npm run dev` na raiz; nao use `npm run dev all`.
- O PostCSS deve permanecer em `Front-end/postcss.config.cjs`.
- Se o Brave mantiver CSS antigo, desative o Shields para `localhost:5173` ou
  use `Ctrl + F5`.

## Melhorias futuras opcionais

- Controle de acesso por perfil
- Historico de acessos ficticios
- Recuperacao de senha por email
