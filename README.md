#  Live Coding PlatformTom is a professional JS lecturer who loves his students very much.

Unfortunately, Tom had to move to Thailand with his wife.

A real-time collaborative coding platform designed for programming education, enabling mentors and students to interact in live coding sessions with instant feedback and solution validation.Tom wants to keep following his students' progress in their journey of becoming a JS master just like him!

##  Project OverviewHelp Tom create an online coding web application with the following pages and features:

Lobby page (no need for authentication) :

This full-stack web application creates an interactive learning environment where programming instructors can guide students through coding exercises in real-time. The platform supports multiple concurrent coding sessions with automatic role assignment, live code synchronization, and instant solution validation.The page should contain the title “Choose code block” and a list of at least 4 items that represent code blocks, each item can be represented by a name (for example - “Async case”)

Clicking on an item should redirect users to the corresponding code block page -

##  Key FeaturesCode block page :

Contains the title and a text editor with the code block initial template and a role indicator (student/mentor).

###  **Lobby System**Assume that the first user who opens the code block page is the mentor (Tom), after that, any other client will be counted as a student.

- Clean, intuitive interface displaying available coding challengesIf Tom leaves the code-block page, students should be redirected to the lobby page, and any written code should be deleted.

- Dynamic code block selection with instant navigationThe mentor will see the selected code block in a read-only mode.

- Responsive design for seamless user experienceThe student will see the code block with the ability to change the code

Code changes should be displayed in real-time (Socket)

###  **Mentor/Student Role Management**The code should have syntax highlighting

- **Automatic Role Assignment**: First user becomes mentor, subsequent users are studentsAt any given time, each user can see how many students are in the room

- **Mentor Controls**: Read-only view with session oversight capabilitiesHave a “solution” on a codeblock object (also insert manually), once the student changes the code to be equal to the solution, show a big smiley face on the screen :)

- **Student Interaction**: Full editing capabilities with real-time collaboration
- **Session Management**: Automatic student redirect when mentor leaves

###  **Real-Time Collaboration**

- **Live Code Synchronization**: Instant code sharing using Socket.IO
- **Multi-User Support**: Track and display active student count
- **Session Persistence**: Maintains code state throughout the session
- **Automatic Cleanup**: Clears session data when mentor disconnects

###  **Smart Solution Validation**

- **Automatic Code Checking**: Real-time comparison with predefined solutions
- **Instant Feedback**: Visual success indicators with emoji celebrations
- **Flexible Matching**: Normalized code comparison ignoring formatting differences
- **Multiple Exercise Types**: Support for various JavaScript concepts

###  **Advanced Code Editor**

- **Syntax Highlighting**: Professional JavaScript syntax highlighting
- **VS Code Theme**: Familiar dark theme for comfortable coding
- **Code Intelligence**: Bracket matching, auto-completion, and proper indentation
- **Responsive Design**: Optimized for various screen sizes

## 🛠 Technology Stack

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

##  Architecture

```
├──   Backend (Node.js/Express)
│   ├── REST API endpoints for code blocks
│   ├── Socket.IO real-time communication
│   ├── MongoDB data persistence
│   └── Session and room management
│
├──  Frontend (React/Vite)
│   ├── Lobby component for code block selection
│   ├── CodeBlockPage with real-time editor
│   ├── Role-based UI rendering
│   └── Socket integration for live updates
│
└──  Real-Time Features
    ├── Live code synchronization
    ├── User presence tracking
    ├── Automatic solution validation
    └── Session management
```

##  Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
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

4. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   MONGO_URL=mongodb://localhost:27017/codeblocks
   PORT=5000
   ```

5. **Build the frontend**

   ```bash
   cd client
   npm run build
   cd ..
   ```

6. **Start the application**

   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

7. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

##  Available Code Challenges

The platform comes pre-loaded with JavaScript exercises:

1. **Async Functions** - Promise handling and async/await patterns
2. **Array Methods** - Map, filter, reduce operations
3. **DOM Manipulation** - Element selection and styling
4. **Promise Chains** - Sequential asynchronous operations

##  How to Use

1. **Start a Session**: Navigate to the lobby and select a code challenge
2. **Mentor Role**: First user gets read-only mentor view with session control
3. **Student Role**: Subsequent users can edit code with real-time synchronization
4. **Live Collaboration**: Watch code changes appear instantly across all connected users
5. **Solution Validation**: Receive immediate feedback when code matches the solution
6. **Session End**: Students are automatically redirected when mentor leaves

##  Future Enhancements

- User authentication and session persistence
- Video/audio communication integration
- Advanced code execution and testing
- Multi-language support (Python, Java, etc.)
- Session recording and playback
- Advanced mentor tools and analytics



