document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/auth/logout`, {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          alert('Sesión cerrada correctamente');
          window.location.href = 'login.html';
        } else {
          alert('Error al cerrar sesión');
        }
      } catch (err) {
        console.error('Error cerrando sesión:', err);
        alert('No se pudo cerrar la sesión');
      }
    });
  }
});

