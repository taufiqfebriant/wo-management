# Work Order Management System

## Tech Stack

- Laravel 12
- Inertia
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- MySQL
- Laravel Sail

## Requirements

- PHP >= 8.2
- Composer
- Node.js >= 22
- Docker

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/taufiqfebriant/wo-management.git
   ```

2. Navigate to project directory

   ```bash
   cd wo-management
   ```

3. Create environment file from example

   ```bash
   cp .env.example .env
   ```

4. Install PHP dependencies

   ```bash
   composer install
   ```

5. Start Docker containers

   ```bash
   ./vendor/bin/sail up -d
   ```

6. Install Node.js dependencies

   ```bash
   ./vendor/bin/sail npm i --legacy-peer-deps
   ```

7. Build frontend assets for production

   ```bash
   ./vendor/bin/sail npm run build
   ```

8. Generate application encryption key

   ```bash
   ./vendor/bin/sail artisan key:generate
   ```

9. Run database migrations

   ```bash
   ./vendor/bin/sail artisan migrate
   ```

10. Start Vite development server

    ```bash
    ./vendor/bin/sail npm run dev
    ```

11. Visit [http://localhost](http://localhost) to view the application

## Stopping and Removing Docker Containers

To stop Docker containers, run the following command:

```bash
./vendor/bin/sail stop
```

To remove Docker containers and volumes, run the following command:

```bash
./vendor/bin/sail down -v
```

## Default user credentials

### Production Manager:

- Email: manager@example.com
- Password: password

### Operator:

- Email: operator@example.com
- Password: password

---

- Email: operator2@example.com
- Password: password
