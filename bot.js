const mineflayer = require('mineflayer');
const http = require('http');

// MONITOR WEB PARA EVITAR APAGADOS EN RAILWAY
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('El_Primas777 activo en Spigot.\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[WEB] Monitoreo activo.`);
});

// CONFIGURACIÓN DEL NPC
const datosMinecraft = {
  host: 'ElPuebleteMono.aternos.me',
  port: 24696,
  username: 'El_Primas777'
};

let bot;
let intervaloSalto;

function iniciarNPC() {
  console.log('[MINECRAFT] Conectando con sincronizacion automatica para Spigot...');
  
  if (bot) {
    bot.removeAllListeners();
    clearInterval(intervaloSalto);
  }

  // Iniciamos desactivando las fisicas de calculo para que Spigot no asuma caida libre
  bot = mineflayer.createBot({
    ...datosMinecraft,
    physicsEnabled: false
  });

  bot.on('spawn', () => {
    console.log('=================================');
    console.log('¡El_Primas777 aparecido! Sincronizando con Spigot...');
    console.log('=================================');

    // Forzamos al bot a reportarse firmemente sobre el bloque en el spawn
    if (bot.entity) {
      bot.entity.onGround = true;
    }

    // Le damos 4 segundos de gracia flotando quieto
    setTimeout(() => {
      if (bot) {
        bot.physicsEnabled = true; // Activamos fisicas normales
        console.log('[MINECRAFT] Bot estabilizado. Iniciando saltos.');

        // Salto anti-AFK cada 5 segundos
        intervaloSalto = setInterval(() => {
          if (bot && bot.entity) {
            bot.setControlState('jump', true);
            setTimeout(() => { if (bot && bot.entity) bot.setControlState('jump', false); }, 500);
          }
        }, 5000);
      }
    }, 4000);
  });

  bot.on('end', () => {
    console.log('[MINECRAFT] Conexion cerrada. Reintentando en 20 segundos...');
    clearInterval(intervaloSalto);
    setTimeout(iniciarNPC, 20000);
  });
}

iniciarNPC();
