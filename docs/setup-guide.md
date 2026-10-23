# Setup guide

## Local development

1. Install Java 21 and Docker.
2. Copy `.env.example` to `.env` and update the values.
3. Run `docker compose up --build`.

The application imports `.env` automatically, so direct starts with `mvnw.cmd spring-boot:run`
also use the configured database credentials. Environment variables supplied by the shell or
IDE take precedence over values in `.env`.

For a host-installed PostgreSQL instance, set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` before starting the application.
