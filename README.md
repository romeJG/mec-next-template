# Mec-Template

### How to get started

1. Clone the repository

```bash
git clone <repo-link> <project-name/folder-name>
```

```bash
#example
git clone https://github.com/user-name/repo-name.git my-new-project
```

2. install Node Modules

```bash
cd frontend
npm install
```

3. install Composer Packages

```bash
cd ../backend
composer install
```

4. Create a copy of the `.env` file

```bash
cp .env.example .env
```

5. edit the .env change the FF:

-   `APP_NAME`
-   `DB_DATABASE`
-   `MAIL_MAILER`
-   `MAIL_SCHEME`
-   `MAIL_HOST`
-   `MAIL_PORT`
-   `MAIL_USERNAME`
-   `MAIL_PASSWORD`
-   `MAIL_FROM_ADDRESS`
-   `MAIL_FROM_NAME`
-   `MAIL_MAILER`

6. Generate the application key

```bash
php artisan key:generate
```

7. modify the seeders located in `backend/database/seeders/AdminUserSeeder.php` change it to your email, lines 38 and 43.

8. Run the migrations and seed the database

```bash
php artisan migrate --seed
```

9. Start the development server

```bash
php artisan serve
```

10. Start the next JS development server

```bash
cd ../frontend
npm run dev
```
