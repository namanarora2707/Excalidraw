# Excalidraw Clone Backend

This is the backend server for the Excalidraw Clone application. It provides user authentication, canvas management, and real-time collaboration features.

## Features

- User authentication (register/login)
- Canvas management (create, read, update, delete)
- Real-time collaboration using WebSocket
- MongoDB integration for data persistence

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- Socket.IO for real-time communication
- Bcrypt.js for password hashing

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Make sure MongoDB is running on your system

3. Start the development server:
   ```
   npm run dev
   ```

4. The server will start on port 5000 by default

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires authentication)

### Canvas
- `GET /api/canvas` - Get all canvases for the user (requires authentication)
- `GET /api/canvas/:id` - Get a specific canvas by ID (requires authentication)
- `POST /api/canvas` - Create a new canvas (requires authentication)
- `PUT /api/canvas/:id` - Update a canvas (requires authentication)
- `DELETE /api/canvas/:id` - Delete a canvas (requires authentication)

## WebSocket Events

The server uses Socket.IO for real-time communication:

- `joinCanvas` - Join a canvas room for collaboration
- `drawingUpdate` - Broadcast drawing updates to other users
- `addElement` - Broadcast element additions to other users
- `updateElement` - Broadcast element updates to other users
- `deleteElement` - Broadcast element deletions to other users
- `canvasUpdate` - Broadcast canvas updates to other users

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/excalidraw
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```