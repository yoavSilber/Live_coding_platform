import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Lobby.css";

function Lobby() {
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch code blocks from the server
    fetch("http://localhost:5000/api/code-blocks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCodeBlocks(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch code blocks");
        setLoading(false);
        console.error("Error fetching code blocks:", error);
      });
  }, []);

  if (loading) return <div className="loading">Loading code blocks...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="lobby-container">
      <h1>Choose Code Block</h1>
      <div className="code-block-list">
        {codeBlocks.map((block) => (
          <Link to={`/codeblock/${block._id}`} key={block._id} className="code-block-item">
            {block.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Lobby;
