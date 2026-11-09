const mineflayer = require('mineflayer');
const http = require('http');

// 1. SERVIDOR WEB INTERNO (OBLIGATORIO PARA RAILWAY)
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('El_Primas777 activo con parche de paquetes 26.3.\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[WEB] Servidor de monitoreo activo.`);
});

// 2. CONFIGURACIÓN DEL NPC
const datosMinecraft = {
  host: 'ElPuebleteMono.aternos.me',
  port: 24696,
  username: 'El_Primas777',
  version: '1.20.4', // Mantenemos la base que activó el login con ViaVersion
  overrideUsingBundledVersion: true
};

let bot;
let intervaloSalto;

function iniciarNPC() {
  console.log('[MINECRAFT] Conectando con parche anti-kick de la 26.3...');
  
  if (bot) {
    bot.removeAllListeners();
    clearInterval(intervaloSalto);
  }

  bot = mineflayer.createBot(datosMinecraft);

  // --- SOLUCIÓN DE PAQUETES PARA LA 26.3 ---
  // Obliga al bot a mandar el cierre de tick al servidor en cada movimiento
  bot.on('move', () => {
    if (bot && bot._client) {
      try {
        bot._client.write('client_tick_end', {});
      } catch (e) {
        // Ignorar errores si el cliente aún se está construyendo
      }
    }
  });

  bot.on('spawn', () => {
    console.log('=================================');
    console.log('¡ÉXITO CONFIRMADO! El_Primas777 se ha quedado en el mundo.');
    console.log('=================================');

    // Rutina de salto básica anti-AFK cada 4 segundos
    intervaloSalto = setInterval(() => {
      if (bot && bot.entity) {
        bot.setControlState('jump', true);
        setTimeout(() => { if (bot && bot.entity) bot.setControlState('jump', false); }, 500);
      }
    }, 4000);
  });

  bot.on('error', (err) => {
    console.log(`[ERROR] ${err.message}`);
  });

  bot.on('end', () => {
    console.log('[MINECRAFT] Conexión cerrada por el servidor. Reintentando en 20 segundos...');
    clearInterval(intervaloSalto);
    setTimeout(iniciarNPC, 20000);
  });
}

iniciarNPC();

