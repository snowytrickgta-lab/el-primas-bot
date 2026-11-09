const mineflayer = require('mineflayer');
const http = require('http');

// MONITOR WEB PARA EVITAR APAGADOS EN RAILWAY
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('El_Primas777 en linea con parche real tick_end.\n');
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
let intervaloChat;

function iniciarNPC() {
  console.log('[MINECRAFT] Conectando con parche oficial de ciclo physicsTick...');
  
  if (bot) {
    bot.removeAllListeners();
    clearInterval(intervaloChat);
  }

  // Dejamos las físicas encendidas para que el bucle de ticks funcione de forma nativa
  bot = mineflayer.createBot({
    ...datosMinecraft,
    physicsEnabled: true 
  });

  // --- EL PARCHE REAL DE GITHUB ---
  // Ejecuta una escritura directa de 'client_tick_end' en cada ciclo físico del juego
  bot.on('physicsTick', () => {
    if (bot && bot._client) {
      try {
        bot._client.write('client_tick_end', {});
      } catch (err) {
        // Evita crasheos durante el proceso de desconexión
      }
    }
  });

  bot.on('spawn', () => {
    console.log('=================================');
    console.log('¡ÉXITO REAL! El_Primas777 está enviando paquetes en especificación.');
    console.log('=================================');

    // Rutina complementaria de chat para evitar el AFK de Aternos
    intervaloChat = setInterval(() => {
      if (bot) {
        bot.chat('/help'); 
        console.log('[MINECRAFT] Comando anti-AFK enviado.');
      }
    }, 120000);
  });

  bot.on('error', (err) => {
    console.log(`[ERROR] ${err.message}`);
  });

  bot.on('end', () => {
    console.log('[MINECRAFT] Conexión finalizada. Reintentando en 20 segundos...');
    clearInterval(intervaloChat);
    setTimeout(iniciarNPC, 20000);
  });
}

iniciarNPC();
