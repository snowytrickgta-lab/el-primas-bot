const mineflayer = require('mineflayer');
const http = require('http');

// 1. MONITOR WEB PARA EVITAR APAGADOS EN RAILWAY
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('El_Primas777 activo con correccion de Yaw/Pitch.\n');
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
  console.log('[MINECRAFT] Conectando con correccion de paquetes de cabeza...');
  
  if (bot) {
    bot.removeAllListeners();
    clearInterval(intervaloSalto);
  }

  // Desactivamos la física estricta interna e inyectamos datos de mirada iniciales
  bot = mineflayer.createBot({
    ...datosMinecraft,
    physicsEnabled: false,
    viewDistance: 'tiny' // Reduce la carga de chunks recibidos que aturden al bot al entrar
  });

  // PARCHE CRÍTICO ANTI-KICK
  // Forzamos al cliente de red a escribir datos perfectos si el servidor pide actualizaciones antes del spawn
  bot.on('login', () => {
    if (bot && bot._client) {
      bot._client.on('position', (packet) => {
        // Le devolvemos un paquete de confirmación idéntico al servidor para que no piense que nos movimos de forma ilegal
        try {
          bot._client.write('position', {
            x: packet.x,
            y: packet.y,
            z: packet.z,
            yaw: 0,
            pitch: 0,
            flags: 0,
            teleportId: packet.teleportId
          });
        } catch (err) {}
      });
    }
  });

  bot.on('spawn', () => {
    console.log('=================================');
    console.log('¡El_Primas777 validado! Esperando estabilizacion...');
    console.log('=================================');

    // Esperamos 4 segundos en posición segura y fija
    setTimeout(() => {
      if (bot) {
        bot.physicsEnabled = true; // Activamos físicas de forma controlada
        console.log('[MINECRAFT] Iniciando saltos AFK.');

        // Salto básico anti-AFK cada 6 segundos
        intervaloSalto = setInterval(() => {
          if (bot && bot.entity) {
            bot.setControlState('jump', true);
            setTimeout(() => { if (bot && bot.entity) bot.setControlState('jump', false); }, 400);
          }
        }, 6000);
      }
    }, 4000);
  });

  bot.on('end', () => {
    console.log('[MINECRAFT] Conexion perdida. Reintentando en 20 segundos...');
    clearInterval(intervaloSalto);
    setTimeout(iniciarNPC, 20000);
  });
}

iniciarNPC();
