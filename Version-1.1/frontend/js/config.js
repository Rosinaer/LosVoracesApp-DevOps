const BACKEND_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:3000" 
  : "https://losvoracesapp-devops.onrender.com";

  window.BACKEND_URL = BACKEND_URL;