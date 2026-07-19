# Node Template

A **Node.js** boilerplate generator for building backend applications with **TypeScript**. This template provides a structured, scalable foundation with support for multiple frameworks, allowing you to quickly bootstrap production-ready Node.js projects.

## Features

- **TypeScript** out of the box
- **Multiple Framework Support** — Express & Fastify
- **Modular Architecture** — Organized into configs, cores, interfaces, middlewares, and source directories
- **Auto Route Registration** — Routes are automatically loaded from the `src/routes/` directory
- **Internationalization (i18n)** — Built-in language support with English (`en`) and Indonesian (`id`)
- **Error Handling** — Global error handler with normalized error response format
- **Security** — Helmet for HTTP headers, CORS, cookie parsing, and request compression
- **Database Ready** — PostgreSQL integration via `pg`
- **Environment Configuration** — Environment-based `.env` files (development/production)
- **Hot Reload** — Nodemon + tsx for development

## Project Structure

```
node-template/
├── .gitignore
├── README.md
├── express/                          # Express.js boilerplate
│   ├── .env.development              # Development environment variables
│   ├── .env.example                  # Environment variable example
│   ├── .gitignore
│   ├── package.json
│   ├── server.ts                     # Application entry point
│   ├── tsconfig.json
│   ├── configs/
│   │   ├── db.ts                     # Database configuration
│   │   └── language.ts               # Language configuration
│   ├── cores/
│   │   ├── Controller.ts             # Base controller class
│   │   ├── ErrorHandler.ts           # Global error handler
│   │   ├── Model.ts                  # Base model class
│   │   └── Route.ts                  # Auto route registration
│   ├── interfaces/
│   │   ├── cores/                    # Core interfaces
│   │   └── middlewares/              # Middleware interfaces
│   ├── languages/
│   │   ├── en.js                     # English translations
│   │   └── id.js                     # Indonesian translations
│   ├── middlewares/
│   │   ├── ErrorHandler.ts           # Error handling middleware
│   │   └── I18n.ts                   # Internationalization middleware
│   ├── src/
│   │   ├── controllers/              # Route controllers
│   │   ├── helpers/                  # Helper utilities
│   │   ├── models/                   # Database models
│   │   └── routes/                   # Route definitions (auto-loaded)
│   └── types/                        # TypeScript type definitions
│
└── fastify/                          # Fastify boilerplate
    ├── .env.development              # Development environment variables
    ├── .env.example                  # Environment variable example
    ├── .gitignore
    ├── package.json
    ├── server.ts                     # Application entry point
    ├── tsconfig.json
    ├── configs/
    │   ├── db.ts                     # Database configuration
    │   └── language.ts               # Language configuration
    ├── cores/
    │   ├── Controller.ts             # Base controller class
    │   ├── ErrorHandler.ts           # Global error handler
    │   ├── Model.ts                  # Base model class
    │   └── Route.ts                  # Auto route registration
    ├── interfaces/
    │   ├── cores/                    # Core interfaces
    │   └── middlewares/              # Middleware interfaces
    ├── languages/
    │   ├── en.js                     # English translations
    │   └── id.js                     # Indonesian translations
    ├── middlewares/
    │   ├── ErrorHandler.ts           # Error handling middleware
    │   └── I18n.ts                   # Internationalization middleware
    ├── src/
    │   ├── controllers/              # Route controllers
    │   ├── helpers/                  # Helper utilities
    │   ├── models/                   # Database models
    │   └── routes/                   # Route definitions (auto-loaded)
    └── types/                        # TypeScript type definitions
```

## Available Frameworks

### Express

A minimal and flexible Node.js web application framework. The Express boilerplate includes:

- **Middleware**: Helmet, compression, CORS, cookie-parser, JSON body parser, URL-encoded parser
- **I18n**: Internationalization middleware
- **Error Normalization**: Response payload normalization for consistent error format
- **404 Handler**: Custom not-found handler
- **Global Error Handler**: Centralized error handling

**Dependencies**: `express`, `helmet`, `compression`, `cors`, `cookie-parser`, `pg`, `dotenv`

### Fastify

A fast and low-overhead web framework for Node.js. The Fastify boilerplate includes:

- **Plugins**: `@fastify/cors`, `@fastify/cookie`, `@fastify/jwt`, `@fastify/helmet`, `@fastify/compress`
- **I18n**: Internationalization plugin
- **Error Normalization**: `onSend` hook for consistent error response format
- **404 Handler**: Custom not-found handler via `setNotFoundHandler`
- **Global Error Handler**: Centralized error handling via `setErrorHandler`

**Dependencies**: `fastify`, `@fastify/cors`, `@fastify/cookie`, `@fastify/jwt`, `@fastify/helmet`, `@fastify/compress`, `pg`, `dotenv`

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** / **yarn** / **pnpm** / **bun**

### Installation

Visit [https://www.npmjs.com/package/create-nui](https://www.npmjs.com/package/create-nui) for auto installation based on your selection

### Environment Configuration

Copy the example environment file and adjust the values:

```bash
cp .env.example .env.development
```

## Architecture

### Core Components

| Component      | Description                                                                         |
| -------------- | ----------------------------------------------------------------------------------- |
| `Controller`   | Abstract base class providing pagination, response formatting, and i18n integration |
| `Model`        | Base model class for database interactions                                          |
| `Route`        | Auto-discovers and registers route files from `src/routes/`                         |
| `ErrorHandler` | Global error handler that catches and formats errors                                |

### Auto Route Registration

Routes are automatically loaded from the `src/routes/` directory. Each file (except `index.ts` and `.d.ts` files) is registered as a route at `/{filename}`. For example, a file named `users.ts` will be accessible at `/users`.

### Response Format

All API responses follow a consistent format:

**Success Response:**

```json
{
  "response": 200,
  "page": {
    "display": 10,
    "currentPage": 1,
    "totalPage": 5,
    "rowsTotal": 50
  },
  "result": [...]
}
```

**Error Response:**

```json
{
  "response": 400,
  "message": "Error description"
}
```

**Translation Response:**

```json
{
  "response": 200,
  "code": "success.message",
  "message": "Translated message"
}
```

### Internationalization

The template supports multiple languages. Language files are located in the `languages/` directory. The language is determined by the `language` header in the request.

**Supported Languages:**

- `en` — English
- `id` — Indonesian

## Scripts

| Script  | Description                              |
| ------- | ---------------------------------------- |
| `dev`   | Start development server with hot reload |
| `build` | Compile TypeScript to JavaScript         |
| `start` | Start production server                  |

## Environment Variables

| Variable        | Description             | Default       |
| --------------- | ----------------------- | ------------- |
| `ENV`           | Application environment | `development` |
| `PORT`          | Application port        | `3000`        |
| `APP_PORT`      | Alternative port        | `3000`        |
| `DISPLAY_LIMIT` | Pagination page size    | `10`          |

## License

MIT

## Author

Shindu Samodra

Github: [https://github.com/samodraland/](https://github.com/samodraland/)
<br/>
Portfolio: [https://samodraland.github.io/](https://samodraland.github.io/)
<br/>
LinkedIn: [https://linkedin.com/in/samodra](https://linkedin.com/in/samodra)
