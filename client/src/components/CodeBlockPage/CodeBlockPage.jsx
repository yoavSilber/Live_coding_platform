import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import "./CodeBlockPage.css";
import { Link } from "react-router-dom";

// Initialize socket connection
const socket = io("http://localhost:5000");

function CodeBlockPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [codeBlock, setCodeBlock] = useState(null);
  const [code, setCode] = useState("");
  const [isMentor, setIsMentor] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    // Fetch the code block details
    fetch(`/api/code-blocks/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Code block not found");
        }
        return response.json();
      })
      .then((data) => {
        setCodeBlock(data);
        setCode(data.code);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load code block");
        setLoading(false);
        console.error("Error fetching code block:", error);
      });

    // Join the socket room
    socket.emit("join-room", { roomId: id });

    // Socket event listeners
    socket.on("room-info", (data) => {
      if (data.studentId === socket.id) setIsMentor(data.isMentor);
      setStudentCount(data.studentCount);
    });

    socket.on("code-update", (updatedCode) => {
      setCode(updatedCode);
    });

    socket.on("mentor-left", () => {
      // Redirect to lobby if mentor leaves
      navigate("/");
    });

    socket.on("solution-correct", () => {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
    });

    // Clean up on component unmount
    return () => {
      socket.off("room-info");
      socket.off("code-update");
      socket.off("mentor-left");
      socket.off("solution-correct");

      // Clear any pending debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [id, navigate]);

  // Handle code changes with debounce
  const handleCodeChange = (newCode) => {
    setCode(newCode);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer to emit changes after a short delay
    debounceTimerRef.current = setTimeout(() => {
      socket.emit("code-change", { roomId: id, code: newCode });
      socket.emit("check-solution", { roomId: id, code: newCode });
    }, 300);
  };

  if (loading) return <div className="loading">Loading code block...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="code-block-page">
      <div className="header">
        <h1>{codeBlock.name}</h1>
        <div className="role-badge">{isMentor ? "Mentor" : "Student"}</div>
        <div className="student-count">Students: {studentCount}</div>
        <Link to={`/`} key={"lobby"} className="lobby-btn">
          Lobby
        </Link>
      </div>

      {showSuccess && (
        <div className="success-overlay">
          <span className="emoji">😃</span>
          <p>Great job! Your solution is correct!</p>
        </div>
      )}

      <div className="code-editor-container">
        <CodeMirror
          value={code}
          height="400px"
          theme={vscodeDark}
          extensions={[javascript({ jsx: true })]}
          onChange={handleCodeChange}
          readOnly={isMentor}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            indentOnInput: true,
            tabSize: 2,
          }}
          className="editor"
        />
      </div>
    </div>
  );
}

export default CodeBlockPage;
