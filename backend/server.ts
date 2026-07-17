const app = require('./app');
const db = require('./config/db');
const PORT = process.env.PORT || 5000;

async function start() {
   try {
      await db.query('SELECT 1');
   } catch (err) {
      if(err instanceof Error){
         console.error('Impossible de se connecter à PostgreSQL au démarrage:', err.message || err);
         process.exit(1);
      } else {
         console.log("Erreur inattendue :", String(err));
      }
   }

   app.listen(PORT, (err: Error) => {
      if (err) {
         if(err instanceof Error){
             console.error('Échec du démarrage du serveur :', err.message || err);
            process.exit(1);
         } else {
            console.log("Erreur inattendue :", String(err));
         }
         
      }
      console.log(`server is running on port ${PORT}...`);
   });
}

start();



