const mineflayer = require('mineflayer');
const http = require('http');

// 1. MONITOR WEB PARA EVITAR APAGADOS EN RAILWAY
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('El_Primas777 activo.\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[WEB] Monitoreo activo.`);
});

// 2. CONFIGURACIÓN CON SOCKET PASIVO
const datosMinecraft = {
  host: 'ElPuebleteMono.aternos.me',
  port: 24696,
  username: 'El_Primas777',
  hideErrors: true,
  checkTimeoutInterval: 30 * 1000
};

let bot;
let intervaloSalto;

function iniciarNPC() {
  console.log('[MINECRAFT] Conectando de forma pasiva a la 26.3...');
  
  if (bot) {
    bot.removeAllListeners();
    clearInterval(intervaloSalto);
  }

  // Forzamos al creador a usar la versión nativa más alta que tolera la librería en paralelo
  bot = mineflayer.createBot({
    ...datosMinecraft,
    version: false // Desactiva por completo el validador estricto de hilos
  });

  bot.on('spawn', () => {
    console.log('=================================');
    console.log('¡ÉXITO TOTAL! El_Primas777 se ha quedado en el mundo.');
    console.log('=================================');

    intervaloSalto = setInterval(() => {
      if (bot && bot.entity) {
        bot.setControlState('jump', true);
        setTimeout(() => { if (bot && bot.entity) bot.setControlState('jump', false); }, 500);
      }
    }, 5000);
  });

  bot.on('end', () => {
    console.log('[MINECRAFT] Reintentando tunel de red en 20 segundos...');
    clearInterval(intervaloSalto);
    setTimeout(iniciarNPC, 20000);
  });
}

iniciarNPC();
