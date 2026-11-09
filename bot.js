const mineflayer = require('mineflayer');
const http = require('http');

// 1. SERVIDOR WEB INTERNO (OBLIGATORIO PARA RAILWAY)
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('El_Primas777 activo en la version 26.3.\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[WEB] Servidor de monitoreo encendido en el puerto ${PORT}`);
});

// 2. CONFIGURACIÓN DEL NPC CON INYECCIÓN DE DATOS NATIVOS
const datosMinecraft = {
  host: 'ElPuebleteMono.aternos.me',
  port: 24696,
  username: 'El_Primas777',
  version: '26.3' // Ahora sí lo reconocerá gracias al nuevo paquete de datos
};

let bot;
let intervaloSalto;

function iniciarNPC() {
  console.log('[MINECRAFT] Iniciando conexion nativa en la version 26.3...');
  
  if (bot) {
    bot.removeAllListeners();
    clearInterval(intervaloSalto);
  }

  bot = mineflayer.createBot(datosMinecraft);

  // Evento: Entró al servidor correctamente
  bot.on('spawn', () => {
    console.log('=================================');
    console.log('¡ÉXITO TOTAL! El_Primas777 entró al mundo en la 26.3.');
    console.log('Activando sistema anti-AFK (Saltando)...');
    console.log('=================================');

    // Hace que el bot salte automáticamente cada 4 segundos
    intervaloSalto = setInterval(() => {
      if (bot && bot.entity) {
        bot.setControlState('jump', true);
        
        setTimeout(() => {
          if (bot && bot.entity) bot.setControlState('jump', false);
        }, 500);
      }
    }, 4000); 
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
    clearInterval(intervaloSalto);
    setTimeout(iniciarNPC, 30000);
  });
}

// Arrancar el ciclo de conexión
iniciarNPC();
