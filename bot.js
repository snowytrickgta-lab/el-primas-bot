const mineflayer = require('mineflayer');
const http = require('http');

// 1. SERVIDOR WEB INTERNO (OBLIGATORIO PARA RAILWAY)
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('El_Primas777 en linea.\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[WEB] Servidor de monitoreo activo.`);
});

// 2. CONFIGURACIÓN LIMPIA SIN FORZADOS RÍGIDOS
const datosMinecraft = {
  host: 'ElPuebleteMono.aternos.me',
  port: 24696,
  username: 'El_Primas777',
  // Eliminamos 'version' y 'overrideUsingBundledVersion' para que la librería 
  // use de forma nativa el protocolo de enlace dinámico compatible con ViaVersion
};

let bot;
let intervaloSalto;

function iniciarNPC() {
  console.log('[MINECRAFT] Conectando de forma limpia...');
  
  if (bot) {
    bot.removeAllListeners();
    clearInterval(intervaloSalto);
  }

  bot = mineflayer.createBot(datosMinecraft);

  bot.on('spawn', () => {
    console.log('=================================');
    console.log('¡ÉXITO REAL! El_Primas777 se ha quedado en el mundo.');
    console.log('=================================');

    // Rutina de salto básica anti-AFK cada 5 segundos
    intervaloSalto = setInterval(() => {
      if (bot && bot.entity) {
        bot.setControlState('jump', true);
        setTimeout(() => { if (bot && bot.entity) bot.setControlState('jump', false); }, 500);
      }
    }, 5000);
  });

  bot.on('error', (err) => {
    console.log(`[ERROR] ${err.message}`);
  });

  bot.on('end', () => {
    console.log('[MINECRAFT] Conexión cerrada. Reintentando en 20 segundos...');
    clearInterval(intervaloSalto);
    setTimeout(iniciarNPC, 20000);
  });
}

iniciarNPC();
