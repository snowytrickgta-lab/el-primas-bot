const mineflayer = require('mineflayer');
const http = require('http');

// 1. MONITOR WEB PARA EVITAR APAGADOS EN RAILWAY
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('El_Primas777 en linea.\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[WEB] Monitoreo activo en puerto ${PORT}`);
});

// 2. CONFIGURACIÓN DEL NPC CON NEGOCIACIÓN AUTOMÁTICA
const datosMinecraft = {
  host: 'ElPuebleteMono.aternos.me',
  port: 24696,
  username: 'El_Primas777',
  // Quitamos la linea 'version' para permitir que Mineflayer y ViaVersion 
  // hablen entre ellos libremente en la entrada del servidor
};

let bot;
let intervaloSalto;

function iniciarNPC() {
  console.log('[MINECRAFT] Conectando mediante negociacion automatica...');
  
  if (bot) {
    bot.removeAllListeners();
    clearInterval(intervaloSalto);
  }

  bot = mineflayer.createBot(datosMinecraft);

  bot.on('spawn', () => {
    console.log('=================================');
    console.log('¡ÉXITO TOTAL! El_Primas777 se ha quedado en el mundo.');
    console.log('=================================');

    // Salta automáticamente cada 5 segundos para burlar el AFK
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
    console.log('[MINECRAFT] Sesión cerrada. Reintentando en 20 segundos...');
    clearInterval(intervaloSalto);
    setTimeout(iniciarNPC, 20000);
  });
}

iniciarNPC();
