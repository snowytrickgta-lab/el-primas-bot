const mineflayer = require('mineflayer');
const http = require('http');

// 1. SERVIDOR WEB INTERNO (OBLIGATORIO PARA HOSTINGS)
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('El_Primas777 se encuentra activo.\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[WEB] Servidor de monitoreo encendido en el puerto ${PORT}`);
});

// 2. CONFIGURACIÓN DEL NPC (DATOS DE TU SERVIDOR DE ATERNOS)
const datosMinecraft = {
  host: 'ElPuebleteMono.aternos.me',
  port: 24696,
  username: 'El_Primas777',
};

let bot;

function iniciarNPC() {
  console.log('[MINECRAFT] Buscando el servidor ElPuebleteMono.aternos.me...');
  
  if (bot) {
    bot.removeAllListeners();
  }

  bot = mineflayer.createBot(datosMinecraft);

  // Evento: Entró al servidor correctamente
  bot.on('spawn', () => {
    console.log('=================================');
    console.log('¡ÉXITO TOTAL! El_Primas777 entró al mundo.');
    console.log('=================================');
  });

  // Evento: Falló al intentar entrar
  bot.on('error', (err) => {
    console.log('--- ERROR DE CONEXIÓN ---');
    console.log(`Mensaje: ${err.message}`);
    console.log('-------------------------');
  });

  // Evento: Se cerró la sesión o el server de Aternos se apagó
  bot.on('end', () => {
    console.log('[MINECRAFT] Desconectado. Reintentando conectar automáticamente en 30 segundos...');
    setTimeout(iniciarNPC, 30000);
  });
}

// Arrancar el ciclo de conexión
iniciarNPC();
