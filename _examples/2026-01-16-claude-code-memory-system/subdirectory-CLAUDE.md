# API Gateway Service

Part of the MyCompany monorepo. See root CLAUDE.md for general conventions.

## Service-Specific Setup

```bash
# From repository root
pnpm --filter api-gateway install
pnpm --filter api-gateway dev
```

## Architecture

This service uses:

- Express.js for routing
- Redis for rate limiting and caching
- OpenAPI 3.0 for API documentation
- Winston for logging

## Local Development

```bash
# Start dependencies (Redis)
docker-compose up -d redis

# Start in development mode with hot reload
pnpm dev

# Run tests with coverage
pnpm test:coverage

# Generate OpenAPI docs
pnpm docs:generate
```

## Service-Specific Conventions

### Rate Limiting

All endpoints should include rate limiting headers:

```typescript
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
```

### Error Handling

Use the centralized error handler in `src/middleware/errorHandler.ts`:

```typescript
throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid input");
```

### Logging

Use Winston logger from `src/utils/logger.ts`:

```typescript
import logger from "../utils/logger";

logger.info("Request received", { userId, endpoint });
logger.error("Database error", { error, query });
```

## Testing

- Unit tests: `src/**/*.test.ts`
- Integration tests: `tests/integration/**/*.test.ts`
- Use supertest for API endpoint testing
- Mock external service calls

## Configuration

Environment variables (see `.env.example`):

- `PORT` - Service port (default: 3000)
- `REDIS_URL` - Redis connection string
- `LOG_LEVEL` - Logging level (debug, info, warn, error)
- `SERVICE_*` - URLs for downstream services

## Common Issues

### Redis Connection

If Redis fails to connect, ensure Docker is running:

```bash
docker-compose ps
docker-compose up -d redis
```

### Port Already in Use

Change PORT in `.env` or kill the process:

```bash
lsof -ti:3000 | xargs kill -9
```
