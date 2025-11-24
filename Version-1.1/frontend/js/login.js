document.addEventListener("DOMContentLoaded", () => {
  logEvent("login_screen_opened");
});

document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  logEvent("login_attempt", { username });

  try {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', 
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      logEvent("login_success", { userId: data.user?.id, username });
      alert('Login exitoso');
      window.location.href = 'dashboard.html';
    } else {
      logEvent("login_failed", { username, status: res.status });
      alert(data.error || 'Error al iniciar sesión');
    }
  } catch (error) {
    logEvent("login_error_exception", { error: error.message });
    debugError(err, 'login.js - submit');
    //console.error('Error en login:', error);
    alert('Error en el servidor');
  }
});
