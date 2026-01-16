# MyApp Project

Full-stack application with React frontend and Django backend.

## Build Commands

```bash
# Backend (Django)
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend (React)
cd frontend
npm install
npm start

# Run all tests
./scripts/test-all.sh
```

## Project Structure

- `backend/` - Django REST API
- `frontend/` - React SPA
- `shared/` - Shared types and utilities
- `docs/` - Documentation
- `scripts/` - Build and deployment scripts

## Code Conventions

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints for all function signatures
- Maximum line length: 88 characters (Black formatter)
- Run `black .` and `flake8` before committing
- Write docstrings for all public functions (Google style)

### JavaScript/TypeScript (Frontend)

- Use TypeScript for all new code
- Follow Airbnb style guide
- Prefer functional components with hooks
- Use Prettier for formatting (already configured)
- File naming: PascalCase for components, camelCase for utilities

### Testing

- Backend: Use pytest, aim for >80% coverage
- Frontend: Use Jest and React Testing Library
- Write integration tests for API endpoints
- Test error cases, not just happy paths

## Git Workflow

- `main` - Production branch, protected
- `develop` - Development branch
- Feature branches: `feature/short-description`
- Bug fix branches: `fix/short-description`
- Always create PR to `develop`, never push directly
- Squash commits when merging

## Database

- PostgreSQL 14+
- Migrations in `backend/migrations/`
- Never commit database credentials
- Use environment variables (see `.env.example`)

## Environment Variables

Copy `.env.example` to `.env` and fill in:

- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - Django secret key
- `API_KEY` - External API key
- `DEBUG` - Set to False in production

## Common Tasks

### Adding a new API endpoint

1. Create view in `backend/api/views/`
2. Add URL pattern in `backend/api/urls.py`
3. Write tests in `backend/api/tests/`
4. Update API documentation

### Adding a new React component

1. Create component in `frontend/src/components/`
2. Write tests in same directory (ComponentName.test.tsx)
3. Export from `index.ts` if it's a shared component
4. Update Storybook if applicable
