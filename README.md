# Task Management System

## Overview
This is a simple **Task Management System** built using **NestJS**. The application provides CRUD operations for managing tasks, allowing users to create, read, update, and delete tasks. The backend is built with **NestJS**, and the database used is **MongoDB**. The application is deployed on **Heroku**.

## Features
- Create, read, update, and delete tasks
- Task status management
- MongoDB integration
- User association with tasks
- Deployed on Heroku

## Setup Instructions

### 1. Clone the Repository
```sh
git clone https://github.com/janithV/task-management-system-ses-backend
cd <project-directory>
```

### 2. Install Dependencies
Ensure you have **Node.js** (with npm version 10.7) installed.

```sh
npm install
```

### 3. Create a `.env` File
Create a `.env` file in the root directory and add the following environment variables:
```env
PORT=3000
DB_URI=mongodb+srv://<your-mongodb-uri>
ACCESS_SECRET=your_secret_key
ACCESS_EXPIRES=expires_on_time
```

> **Note:** Update the values according to your database credentials and secret keys.

### 4. Run the Application
Start the development server using:
```sh
npm run start:dev
```
The application will run on `http://localhost:3000/` by default.

## Deployment
This application is deployed on **Heroku**. You can access it at:

[**Live Application**](https://task-management-system-backend-69f7343bd7c2.herokuapp.com/)

## Technologies Used
- **NestJS** - Backend framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Heroku** - Deployment platform
- **TypeScript** - Programming language

## License
This project is open-source and available under the **MIT License**.

---
Feel free to contribute or raise issues if you find any! 🚀

