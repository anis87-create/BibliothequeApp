const app = require('./app');
const db = require('./config/db');
const PORT = process.env.PORT || 5000;

async function start() {
   try {
      await db.query('SELECT 1');
   } catch (err) {
      console.error('Impossible de se connecter à PostgreSQL au démarrage:', err.message || err);
      process.exit(1);
   }

   app.listen(PORT, (err) => {
      if (err) {
         console.error('Échec du démarrage du serveur :', err.message || err);
         process.exit(1);
      }
      console.log(`server is running on port ${PORT}...`);
   });
}

start();



