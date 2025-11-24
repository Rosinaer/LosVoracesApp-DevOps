document.addEventListener('DOMContentLoaded', () => {
   logEvent("dashboard_loaded");

  const logoutBtn = document.getElementById('logoutBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {

      logEvent("logout_attempt");

      try {
        const res = await fetch(`${BACKEND_URL}/auth/logout`, {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          logEvent("logout_success");
          alert('Sesión cerrada correctamente');
          window.location.href = 'login.html';
        } else {
          alert('Error al cerrar sesión');
        }
      } catch (err) {
        logEvent("logout_failed", { status: res.status });
        console.error('Error cerrando sesión:', err);
        alert('No se pudo cerrar la sesión');
      }
    });
  }
});

