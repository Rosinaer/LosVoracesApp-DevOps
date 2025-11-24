document.addEventListener('DOMContentLoaded', () => {

   logEvent("register_screen_opened");

  const form = document.getElementById('registerForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const roleSelect = document.getElementById('role');

  if (!form || !usernameInput || !passwordInput || !roleSelect) {
    console.error('Uno o más elementos del formulario no se encontraron en el DOM.');
    return;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;
    const role = roleSelect.value;

    logEvent("register_attempt", { username, role });

    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        logEvent("register_success", { username, role });
        alert('Registro exitoso. Iniciá sesión.');
        window.location.href = 'login.html';
      } else {
        logEvent("register_failed", {
          username,
          status: res.status,
          backendMessage: data.error
        });
        alert(data.error || 'Error al registrarse');
      }
    } catch (error) {
      logEvent("register_error_exception", { error: error.message });
      console.error('Error en registro:', error);
      alert('Error en el servidor');
    }
  });
});

