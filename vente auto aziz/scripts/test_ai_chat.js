// Simple test script to verify demo-mode reply for the AI chat in index.html
(async () => {
  // Simulate window object
  global.window = {};
  // Reproduce the demo branch logic from sendMessageToAI
  async function sendMessageToAI(message) {
    const API_KEY = window.AI_API_KEY || null;
    if (!API_KEY || API_KEY === 'TON_API_KEY') {
      return `Mode démo — l'assistant n'est pas connecté. Décrivez le type de voiture que vous cherchez (marque, budget, usage) et je vous donnerai des conseils.`;
    }
    return 'this path requires a real API key';
  }

  const input = 'Bonjour, je cherche une petite berline économique pour la ville, budget ~4 000 000 XOF.';
  console.log('Input:', input);
  const reply = await sendMessageToAI(input);
  console.log('Reply:', reply);
})();
