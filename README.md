# AllStar API

AllStar API is the backend service for the Anime Mash project, inspired by Facemash. It provides the necessary endpoints to support the Angular frontend application, manages data in a MySQL database, and handles image storage using Firebase.

## Features

- User authentication and management
- Image upload and retrieval
- Voting system for anime characters
- Ranking system based on user votes
- Integration with Firebase for image storage

## Technologies Used

- Node.js
- Express.js
- MySQL
- Firebase Storage
- TypeScript

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MySQL database
- Firebase account and project set up

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/MaouStan/AllStar-API.git
   cd AllStar-API
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   FIREBASE_API_KEY=your_firebase_api_key
   JWT_SECRET=your_jwt_secret
   ```

4. Build the project:
   ```
   npm run build
   ```

5. Start the server:
   ```
   npm start
   ```

## API Endpoints

- `/api/auth`: User authentication endpoints
- `/api/user`: User management endpoints
- `/api/image`: Image upload and retrieval endpoints
- `/api/vote`: Voting system endpoints
- `/api/settings`: Application settings endpoints

For detailed API documentation, please refer to the API documentation file.

## Database Schema

The project uses a MySQL database with the following main tables:

- `allstarUsers`: Stores user information
- `allstarImages`: Stores image metadata
- `allstarVoting`: Stores voting data

## Deployment

The API is configured for deployment on Vercel. The `vercel.json` file in the root directory contains the necessary configuration for deployment.

## Frontend Repository

The frontend Angular project can be found at [AllStar-WebSite](https://github.com/MaouStan/AllStar-WebSite).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

Copyright (c) 2023 MaouStan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
