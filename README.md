# School Management API

A production-ready Node.js + Express backend project for a School Management system with MySQL integration. It provides APIs to add new schools and list schools sorted by proximity to a user's location.

## Features
- Add a school with input validation.
- List all schools sorted by nearest proximity using the Haversine formula.
- Global error handling middleware.
- MySQL database integration using prepared statements.
- Automatic database and table creation upon startup (custom script included in `models/db.js`).

## Tech Stack
- Node.js
- Express.js
- MySQL (`mysql2`)
- `dotenv` for environment variables
- `cors` & `body-parser`

## Prerequisites
- Node.js (v14 or higher)
- MySQL Server (running locally or remote)

## Getting Started

1. **Clone or Download** the project repository.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Update the `.env` file in the root directory with your MySQL database credentials (default values are provided).
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=schoolDB
   PORT=3000
   ```
   *Make sure your MySQL server is running and the user `root` has privileges to create a database, or pre-create the `schoolDB` database.*
4. **Start the server**:
   ```bash
   npm start
   ```
   *(The server will automatically try to create the database and table if they don't exist)*

## API Endpoints

### 1. Add School
- **Endpoint**: `POST /api/addSchool`
- **Request Body** (JSON):
  ```json
  {
      "name": "Springfield Elementary",
      "address": "123 Main St, Springfield",
      "latitude": 39.7817,
      "longitude": -89.6501
  }
  ```
- **Response**:
  ```json
  {
      "success": true,
      "message": "School added successfully",
      "schoolId": 1
  }
  ```

### 2. List Schools
- **Endpoint**: `GET /api/listSchools?latitude=39.78&longitude=-89.65`
- **Query Parameters**:
  - `latitude`: User's latitude
  - `longitude`: User's longitude
- **Response**:
  ```json
  {
      "success": true,
      "data": [
          {
              "id": 1,
              "name": "Springfield Elementary",
              "address": "123 Main St, Springfield",
              "latitude": 39.7817,
              "longitude": -89.6501,
              "distance": 0.188
          }
      ]
  }
  ```
