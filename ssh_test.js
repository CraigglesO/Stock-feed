var exec = require('ssh-exec')

// using ~/.ssh/id_rsa as the private key
var llama = [{
  "name": "Test9",
  "function": "add",
  "timeStamp": true,
  "type": "alert",
  "repeat": false,
  "frequency": "00 21 02 * * *",
  "content": "This is a test on a new server!",
  "comments":"Nada"
}];

//exec('ls -lh', 'root@45.55.226.76').pipe(process.stdout)
exec(`cd node-app && echo "${JSON.stringify(llama)}" >> update.json`, 'root@45.55.226.76').pipe(process.stdout)
exec('cd node-app && ls -lh', 'root@45.55.226.76').pipe(process.stdout)



//echo "Hello you!" >> myfile.txt
