document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

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
      alert('Login exitoso');
      window.location.href = 'dashboard.html';
    } else {
      alert(data.error || 'Error al iniciar sesión');
    }
  } catch (error) {
    console.error('Error en login:', error);
    alert('Error en el servidor');
  }
});
