# Live Coding Platform

A real-time collaborative coding platform designed for programming education, enabling mentors and students to interact in live coding sessions with instant feedback and solution validation.

## Project Overview

This full-stack web application creates an interactive learning environment where programming instructors can guide students through coding exercises in real-time. The platform supports multiple concurrent coding sessions with automatic role assignment, live code synchronization, and instant solution validation.

## Key Features

### **Lobby System**
- Clean, intuitive interface displaying available coding challenges
- Dynamic code block selection with instant navigation
- Responsive design for seamless user experience

### **Mentor/Student Role Management**
- **Automatic Role Assignment**: First user becomes mentor, subsequent users are students
- **Mentor Controls**: Read-only view with session oversight capabilities
- **Student Interaction**: Full editing capabilities with real-time collaboration
- **Session Management**: Automatic student redirect when mentor leaves

### **Real-Time Collaboration**
- **Live Code Synchronization**: Instant code sharing using Socket.IO
- **Multi-User Support**: Track and display active student count
- **Session Persistence**: Maintains code state throughout the session
- **Automatic Cleanup**: Clears session data when mentor disconnects

### **Smart Solution Validation**
- **Automatic Code Checking**: Real-time comparison with predefined solutions
- **Instant Feedback**: Visual success indicators with celebrations
- **Flexible Matching**: Normalized code comparison ignoring formatting differences
- **Multiple Exercise Types**: Support for various JavaScript concepts

### **Advanced Code Editor**
- **Syntax Highlighting**: Professional JavaScript syntax highlighting
- **VS Code Theme**: Familiar dark theme for comfortable coding
- **Code Intelligence**: Bracket matching, auto-completion, and proper indentation
- **Responsive Design**: Optimized for various screen sizes

## Technology Stack

### **Backend**
- **Node.js** - Server runtime environment
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB** - NoSQL database for data persistence
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing

### **Frontend**
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **CodeMirror 6** - Professional code editor component
- **Socket.IO Client** - Real-time client communication

### **Development Tools**
- **ESLint** - Code linting and quality assurance
- **Nodemon** - Development server auto-restart
- **dotenv** - Environment configuration management

## Configuration

### **Local-First Setup**
This application is configured for local development and runs entirely on your machine:

- **Backend Server**: Fixed on `localhost:3001`
- **Database**: Local MongoDB instance at `mongodb://localhost:27017/codeblocks`
- **Frontend Dev Server**: Runs on `localhost:5173` with proxy to backend
- **No Environment Variables Required**: All configurations are set for local development

### **Key Features**
- No cloud dependencies required
- Consistent port configuration (3001)
- Local MongoDB integration
- Hot reload for development
- Real-time WebSocket communication

## Architecture

```
├── Backend (Node.js/Express)
│   ├── REST API endpoints for code blocks
│   ├── Socket.IO real-time communication
│   ├── MongoDB data persistence
│   └── Session and room management
│
├── Frontend (React/Vite)
│   ├── Lobby component for code block selection
│   ├── CodeBlockPage with real-time editor
│   ├── Role-based UI rendering
│   └── Socket integration for live updates
│
└── Real-Time Features
    ├── Live code synchronization
    ├── User presence tracking
    ├── Automatic solution validation
    └── Session management
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation required)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yoavSilber/Live_coding_platform.git
   cd Live_coding_platform
   ```

2. **Install backend dependencies**

   ```bash
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Start MongoDB locally**
   Make sure MongoDB is running on your local machine:

   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # Or start manually
   mongod
   ```

5. **Build the frontend**

   ```bash
   cd client
   npm run build
   cd ..
   ```

6. **Start the application**

   ```bash
   # Production mode
   npm start
   
   # Development mode with auto-restart
   npm run dev
   ```

7. **Access the application**
   Open your browser and navigate to `http://localhost:3001`

### **Development Mode**

For development with hot reload on the frontend:

1. **Start the backend** (in one terminal):
   ```bash
   npm start
   ```

2. **Start the frontend dev server** (in another terminal):
   ```bash
   cd client
   npm run dev
   ```

3. **Access the development version** at `http://localhost:5173`
   - Frontend development server with hot reload
   - Automatically proxies API calls to backend at port 3001

## Available Code Challenges

The platform comes pre-loaded with JavaScript exercises:

1. **Async Functions** - Promise handling and async/await patterns
2. **Array Methods** - Map, filter, reduce operations
3. **DOM Manipulation** - Element selection and styling
4. **Promise Chains** - Sequential asynchronous operations

## How to Use

1. **Start a Session**: Navigate to the lobby and select a code challenge
2. **Mentor Role**: First user gets read-only mentor view with session control
3. **Student Role**: Subsequent users can edit code with real-time synchronization
4. **Live Collaboration**: Watch code changes appear instantly across all connected users
5. **Solution Validation**: Receive immediate feedback when code matches the solution
6. **Session End**: Students are automatically redirected when mentor leaves

## Future Enhancements

- User authentication and session persistence
- Video/audio communication integration
- Advanced code execution and testing
- Multi-language support (Python, Java, etc.)
- Session recording and playback
- Advanced mentor tools and analytics

## Developer

**Yoav Silber**
- Experienced full-stack developer
- Passionate about educational technology
- Skilled in real-time web applications and collaborative tools

## License

This project is available for educational and portfolio purposes.

---

*Built with care for the programming education community*