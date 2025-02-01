import React, { useState, useEffect } from "react";

const Preloader: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Ensure the preloader is only mounted on the client side
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) {
    // Prevent rendering on the server side to avoid hydration mismatch
    return null;
  }

  // Styles for the preloader container
  const preloaderStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(148,83,186,1) 29%, rgba(252,70,107,1) 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    color: "white",
    textAlign: "center",
  };

  const spinnerStyle: React.CSSProperties = {
    border: "4px solid rgba(255, 255, 255, 0.3)", // Semi-transparent white
    borderTop: "4px solid #ffffff", // Solid white
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
  };

  const textStyle: React.CSSProperties = {
    marginTop: "15px", // Space between spinner and text
    fontSize: "18px",
    fontWeight: "500",
  };

  return (
    <div style={preloaderStyle} aria-label="Loading, please wait...">
      <div style={spinnerStyle}></div>
      <div style={textStyle}>Welcome to the page, please wait for loading...</div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Preloader;
