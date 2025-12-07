// Test script: POST a message to the backend AI proxy and print response
(async () => {
  try {
    const url = 'http://localhost:5000/api/ai/chat';
    const payload = { message: 'Bonjour, je cherche une petite berline économique pour la ville, budget ~4 000 000 XOF.' };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    console.log('HTTP', res.status);
    console.log('RESPONSE:', text);
  } catch (err) {
    console.error('Request failed:', err.message || err);
    process.exitCode = 1;
  }
})();
