var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '55be73ee-ba3d-4207-94ba-638120de24ac',
    appPassword: 'BhFvqX7WbD2GTGNe0AYRhA6'
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    var char = session.message.text;
    if(hasGotChar(char))
    {
      var client = restify.createJsonClient({
        url:  'https://got-quotes.herokuapp.com'
      });
      console.log("Char = " + char);
      client.get('/quotes?char=' + char, function(err, req, res, obj){
        console.log("Quote " + obj.quote);
        session.send(obj.quote);
      });
    }else{
      session.send("Nenhum personagem de Game Of Thrones");
    }
});

function hasGotChar(char){
  char = char.toUpperCase();
  var chars = ['tyrion', 'cersei', 'bronn', 'brynden', 'hound', 'jaime', 'littlefinger', 'olenna', 'renly', 'varys'];
  var ind = char.indexOf(char)
  return ind != -1;
};
