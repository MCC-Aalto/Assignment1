var express = require('express');
var app = express();

app.get('/butterfly', function(req, res) {
  res.type('text/plain');
  res.send('i am a beautiful butterfly');
});

console.log("Node.js is working and now listening.");
app.listen(process.env.PORT || 4730);