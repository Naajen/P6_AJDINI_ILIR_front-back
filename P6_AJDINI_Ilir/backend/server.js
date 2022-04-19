//Faire les require à l'app & le http
const http = require('http'); //module http pour createServer
const app = require('./app');


//fonction normalizePort renvoie un port valide, fourni sous forme d'un numéro ou d'une chaîne
const normalizePort = val => {
  const port = parseInt(val, 10);
  
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//fonction errorHandler recherche les différentes erreurs et les gère de manière appropriée. Elle est enreg dans le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  //code prédifini privilège
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//Création d'un port d'écoute consignant le port ou le canal sur lequel le serveur va s'executer, ici le port 3000 max 65535
const port = normalizePort(process.env.PORT || '1337' || '3001');
app.set('port', port);

//Creation du serveur createServer()
const server = http.createServer(app);

server.on('error', errorHandler);
//Si la liaison est bonne alors on envoi un message pour dire qu'il est sur écoute
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

//Le serveur écoute le port 3000 ou 1337 ou 3001 en fonction de la disponnibilité
server.listen(port);


/*
MODULES NODEMON
dans le backend faire un "npm install -g nodemon"

If nodemon.ps1 script ne fonctionne pas ouvrir powershell en admin

1)Get-ExecutionPolicy
# You should get 'Restricted'
 
2)Set-ExecutionPolicy Unrestricted

3) Get-ExecutionPolicy
# You should get 'Unrestricted'

4) Try nodemon server
*/