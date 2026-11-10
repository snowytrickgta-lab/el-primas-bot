const mineflayer = require('mineflayer');

const botOptions = {
  host: 'ElPuebleteMono.aternos.me', 
  port: 24696,                       
  username: 'El_Primas777BOT', 
  version: false 
};

let bot;

function iniciarBot() {
  bot = mineflayer.createBot(botOptions);

  bot.on('login', () => {
    console.log(`[${bot.username}] Conectando a Aternos...`);
    if (bot.physics) {
      bot.physics.enabled = false; 
    }

    const antiguoWrite = bot._client.write.bind(bot._client);
    bot._client.write = function (name, params) {
      if (name === 'position' || name === 'position_look' || name === 'look') {
        return; 
      }
      return antiguoWrite(name, params);
    };
  });

  bot.once('spawn', () => {
    console.log(`[${bot.username}] ¡Conectado! Pon una cama a mi lado para que pueda dormir.`);
    if (bot.send_every_tick) {
      bot.send_every_tick = false; 
    }

    process.stdin.removeAllListeners('data'); 
    process.stdin.on('data', (data) => {
      const mensaje = data.toString().trim();
      if (mensaje.length > 0) bot.chat(mensaje);
    });
  });

  // DETECTOR DE TIEMPO: Se activa cada vez que cambia la hora del juego
  bot.on('time', () => {
    // Si es de noche (tiempo entre 13000 y 23000 tics) y el bot no está durmiendo
    if (bot.time.isNight && !bot.isSleeping) {
      // Busca cualquier bloque de cama que esté a menos de 3 bloques de distancia
      const camaBloque = bot.findBlock({
        matching: block => block.name.includes('bed'),
        maxDistance: 3
      });

      if (camaBloque) {
        bot.sleep(camaBloque).catch(err => {
          console.log(`[${bot.username}] No pude dormir: ${err.message}`);
        });
      }
    }
  });

  bot.on('death', () => {
    setTimeout(() => { bot.respawn(); }, 2000);
  });

  bot.on('end', () => { setTimeout(iniciarBot, 5000); });
  bot.on('error', (err) => { console.error('Error:', err); });
}

iniciarBot();
