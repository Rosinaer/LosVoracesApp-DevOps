const isProduction = !window.location.hostname.includes("localhost");

async function logEvent(event, details = {}) {
  try {
    await fetch(`${window.BACKEND_URL}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, details })
    });
  } catch (err) {
    //console.error("No se pudo enviar log:", err);
    debugError(err, `Error enviando log: ${event}`);
  }
}

function debugError(err, context = "") {
  if (!isProduction) {
    console.error(context, err);
  }
}
