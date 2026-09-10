# Coffee Shop ☕

A coffee shop web application for browsing and ordering premium coffee beans.

Built with **AdonisJS** for the backend and **React** for the frontend, with **MySQL** as the database.

## Tech Stack

* [AdonisJS](https://adonisjs.com/) — Backend
* [React](https://react.dev/) — Frontend
* MySQL — Database

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repository.git
```

Navigate to the project directory:

```bash
cd your-repository
```

### 2. Install Dependencies

Install the project dependencies:

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then update the `.env` file with your MySQL database configuration.

Example:

```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=coffee_shop
```

### 4. Create the Database

Make sure MySQL is running, then create a database:

```sql
CREATE DATABASE coffee_shop;
```

Make sure the database name matches the value in your `.env` file.

### 5. Run Database Migrations

Run the migrations to create the required database tables:

```bash
node ace migration:run
```

### 6. Start the Development Server

Run the application:

```bash
npm run dev
```

The application should now be running locally.

## Available Commands

### Run Development Server

```bash
npm run dev
```

### Run Database Migrations

```bash
node ace migration:run
```

### Rollback Migrations

```bash
node ace migration:rollback
```

## Features

* Browse available coffee beans
* View coffee bean details
* Order coffee beans online
* Manage products and orders
* MySQL database integration

## License

This project is open-source and available for learning and development purposes.
