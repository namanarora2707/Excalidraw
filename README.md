# Excalidraw Clone

A lightweight Excalidraw-like sketch drawing web application with real-time collaboration capabilities.

## Overview

This project is a feature-rich drawing application similar to Excalidraw, built with modern web technologies. It includes both frontend and backend components, allowing users to create, edit, and collaborate on drawings in real-time.

## Technologies Used

### Frontend
- **React**: UI framework for building components
- **Zustand**: Lightweight state management solution
- **Rough.js**: Hand-drawn style rendering library
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Nano ID**: Unique ID generator

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data persistence
- **Mongoose**: MongoDB object modeling tool
- **Socket.IO**: Real-time communication library
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt.js**: Password hashing library

## Project Structure

```
.
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── store/          # State management
│   │   ├── tools/          # Drawing tools
│   │   ├── utils/          # Utility functions
│   │   ├── services/       # API and WebSocket services
│   │   ├── context/        # React context providers
│   │   └── hooks/          # Custom hooks
│   └── ...
├── server/                 # Backend application
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── config/             # Configuration files
│   └── services/           # Business logic
└── ...
```

## Key Features

### Drawing Tools
- Rectangle, Ellipse, Rhombus, Arrow tools
- Freehand drawing tool
- Text tool with font selection
- Image insertion tool
- Selection and manipulation tool
- Eraser tool

### Collaboration Features
- Real-time drawing updates using WebSocket
- Multi-user canvas collaboration
- Live cursor positions
- Instant element synchronization

### User Management
- User registration and authentication
- Secure password storage with bcrypt
- JWT-based session management
- Protected API routes

### Data Persistence
- Canvas data stored in MongoDB
- User account management
- Canvas history and versioning
- Automatic saving and synchronization

### UI/UX Features
- Responsive design with Tailwind CSS
- Dark mode support
- Keyboard shortcuts
- Undo/redo functionality
- Export to PNG/SVG formats
- Auto-save functionality

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Frontend Setup
1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

### Backend Setup
1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/excalidraw
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:3000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Running Both Services
To run both frontend and backend simultaneously, you can use separate terminal windows or a process manager like concurrently.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires authentication)

### Canvas Management
- `GET /api/canvas` - Get all canvases for the user (requires authentication)
- `GET /api/canvas/:id` - Get a specific canvas by ID (requires authentication)
- `POST /api/canvas` - Create a new canvas (requires authentication)
- `PUT /api/canvas/:id` - Update a canvas (requires authentication)
- `DELETE /api/canvas/:id` - Delete a canvas (requires authentication)

## WebSocket Events

The application uses Socket.IO for real-time communication:

- `joinCanvas` - Join a canvas room for collaboration
- `drawingUpdate` - Broadcast drawing updates to other users
- `addElement` - Broadcast element additions to other users
- `updateElement` - Broadcast element updates to other users
- `deleteElement` - Broadcast element deletions to other users
- `canvasUpdate` - Broadcast canvas updates to other users

## Development

### Frontend Development
The frontend is built with React and Vite, providing a fast development experience with hot module replacement.

### Backend Development
The backend uses Express.js with MongoDB for data persistence and Socket.IO for real-time communication.

### Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License
This project is licensed under the MIT License - see the LICENSE file for details.