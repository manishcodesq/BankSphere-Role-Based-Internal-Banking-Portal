import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
useEffect(() => {
  axios.get("https://banksphere-role-based-internal-banking.onrender.com/health");
}, []);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
