const mineflayer = require('mineflayer');
const http = require('http');

// 1. MONITOR WEB PARA EVITAR APAGADOS EN RAILWAY
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('El_Primas777 activo con parche de movimiento.\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[WEB] Monitoreo activo.`);
});

// 2. CONFIGURACIÓN DEL NPC
const datosMinecraft = {
  host: 'ElPuebleteMono.aternos.me',
  port: 24696,
  username: 'El_Primas777'
};

let bot;
let intervaloSalto;

function iniciarNPC() {
  console.log('[MINECRAFT] Conectando con estabilizador de gravedad...');
  
  if (bot) {
    bot.removeAllListeners();
    clearInterval(intervaloSalto);
  }

  // Desactivamos la física estricta interna temporalmente durante el login
  bot = mineflayer.createBot({
    ...datosMinecraft,
    physicsEnabled: false // El bot entra flotando para no enviar paquetes de caída inválidos
  });

  bot.on('spawn', () => {
    console.log('=================================');
    console.log('¡El_Primas777 aparecido! Estabilizando posicion...');
    console.log('=================================');

    // Esperamos 3 segundos en el aire de forma segura para sincronizar con Aternos
    setTimeout(() => {
      if (bot) {
        bot.physicsEnabled = true; // Activamos la física de forma segura una vez dentro
        console.log('[MINECRAFT] Fisica activada. Iniciando saltos anti-AFK.');

        // Iniciar los saltos cada 5 segundos de forma segura
        intervaloSalto = setInterval(() => {
          if (bot && bot.entity) {
            bot.setControlState('jump', true);
            setTimeout(() => { if (bot && bot.entity) bot.setControlState('jump', false); }, 500);
          }
        }, 5000);
      }
    }, 3000);
  });

  bot.on('end', () => {
    console.log('[MINECRAFT] Conexion perdida. Reintentando en 20 segundos...');
    clearInterval(intervaloSalto);
    setTimeout(iniciarNPC, 20000);
  });
}

iniciarNPC();
