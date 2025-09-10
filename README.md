# 🌌 Star Wars Wiki API

A simple REST API built with **[Node.js](https://nodejs.org/)** and **[TypeScript](https://www.typescriptlang.org/)**, powered by **[Fastify](https://fastify.dev/)**, **[Drizzle ORM](https://orm.drizzle.team/)** (PostgreSQL), and **[Zod](https://zod.dev/)**.  
Includes **[Swagger/OpenAPI](https://swagger.io/)** documentation in development mode.

---

## 🛠 Requirements

- [Node.js](https://nodejs.org/) **22+**
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [pnpm](https://pnpm.io/) or npm

---

## ⚡ Tech Stack

- **Fastify** – fast and low-overhead server
- **TypeScript** – static typing
- **Drizzle ORM** + **PostgreSQL** – relational database
- **Zod** – validation
- **Swagger/OpenAPI** – API documentation
- **@fastify/static** – serve character images

---

## 🚀 Getting Started

Clone the repository and install dependencies:

```bash
pnpm install
```

Start PostgreSQL with Docker:

```bash
docker compose up -d
```

Create a `.env` file at the project root:

```bash
# Database connection
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/starwars_api

# Enable docs at /docs
NODE_ENV=development
```

Run migrations (Drizzle):

```bash
pnpm run db:migrate
```

Seed the database:

```bash
pnpm run db:seed
```

🏃 Running the server

```bash
pnpm run dev
```

- Default port: http://localhost:3333
- Swagger docs (dev): http://localhost:3333/docs
- Pretty logs enabled

## 📡 API Endpoints

Base URL: `http://localhost:3333`

- **GET** `/characters` - Returns all characters with pagination and search
- **GET** `/characters/:id` - Returns a character by ID
- **GET** `/planets` - Returns all planets
- **GET** `/planets/:id` - Returns a planet by ID
- **GET** `/vehicles` - Returns all vehicles
- **GET** `/starships` - Returns all starships
- **GET** `/films` - Returns all films

## 🗄 Database Models

Defined in `src/database/schema.ts`:

### `characters`

| Column         | Type    | Description           |
| -------------- | ------- | --------------------- |
| `id`           | serial  | Primary Key           |
| `name`         | text    | Character name        |
| `height`       | text    | Character height      |
| `mass`         | text    | Character mass        |
| `hair_color`   | text    | Hair color            |
| `skin_color`   | text    | Skin color            |
| `eye_color`    | text    | Eye color             |
| `birth_year`   | text    | Birth year            |
| `gender`       | text    | Gender                |
| `homeworld_id` | integer | Foreign key → planets |
| `image_url`    | text    | Character image path  |

## 💻 Development Workflow

```mermaid
sequenceDiagram
participant C as Client
participant S as Fastify Server
participant V as Zod Validator
participant DB as Drizzle + PostgreSQL

C->>S: GET /characters
S->>DB: SELECT \* FROM characters
DB-->>S: list of characters
S-->>C: 200 {characters: [...]}

C->>S: GET /characters/:id
S->>DB: SELECT \* FROM characters WHERE id=...
alt found
DB-->>S: character object
S-->>C: 200 {character}
else not found
S-->>C: 404
end
```

## 📝 Useful Scripts

- `pnpm run dev` – start server with hot reload
- `pnpm run db:migrate` – apply database migrations
- `pnpm run db:seed` – seed database
- `pnpm run db:studio` – open Drizzle Studio

## ⚠️ Troubleshooting

- Postgres connection refused: make sure `docker compose up -d` is running and port `5432` is available
- `DATABASE_URL` missing: ensure `.env` exists and is correct
- Docs not loading at `/docs`: set `NODE_ENV=development` in `.env` and restart the server

## 🪐 License

[ISC](./package.json)
