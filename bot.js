const mineflayer = require('mineflayer');
const http = require('http');

// MONITOR WEB PARA EVITAR APAGADOS EN RAILWAY
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('El_Primas777 en linea mediante comandos de chat.\n');
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
  console.log('[MINECRAFT] Conectando bot en modo estatico seguro...');
  
  if (bot) {
    bot.removeAllListeners();
    clearInterval(intervaloChat);
  }

  // Desactivamos completamente las fisicas para que se quede 100% quieto en el suelo
  bot = mineflayer.createBot({
    ...datosMinecraft,
    physicsEnabled: false
  });

  bot.on('spawn', () => {
    console.log('=================================');
    console.log('¡ÉXITO TOTAL! El_Primas777 se ha quedado en el mundo.');
    console.log('Modo estático activo. El bot no se moverá para evitar filtros.');
    console.log('=================================');

    // En lugar de saltar, el bot ejecutará un comando en el chat cada 3 minutos
    // Esto le demuestra al servidor que sigue activo sin activar el anti-cheat de movimiento
    intervaloChat = setInterval(() => {
      if (bot) {
        // Ejecuta el comando /help. Puedes cambiarlo por otro comando si prefieres
        bot.chat('/help'); 
        console.log('[MINECRAFT] Comando anti-AFK enviado al chat de forma segura.');
      }
    }, 180000); // 180000 milisegundos = 3 minutos
  });

  bot.on('error', (err) => {
    console.log(`[ERROR] ${err.message}`);
  });

  bot.on('end', () => {
    console.log('[MINECRAFT] Conexión cerrada. Reintentando en 20 segundos...');
    clearInterval(intervaloChat);
    setTimeout(iniciarNPC, 20000);
  });
}

iniciarNPC();

