# Database design

The PostgreSQL schema is versioned with Flyway migrations under `src/main/resources/db/migration`.

Migration ownership is split by workflow:

- `V1` creates users and roles.
- `V2` creates suppliers, product catalog, and stock data.
- `V3` creates customer and employee records.
- `V4` creates sales, purchases, and their line items.
- `V5` creates brands, categories, category_brands join table, and product foreign keys.
- `V6` creates expenses tracking records.
