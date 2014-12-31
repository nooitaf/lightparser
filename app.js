// -------------- netcat
var nc = require("node-cat");

var client = nc.createClient('vinculum', 4444);
var ncc;
client.start(
  function(cl) {
    ncc = cl;
  }
);

// ------------- express
var express = require('express');
var app = express();

ranColor = function(){
  return parseInt(Math.random()*16)*16;
}

doColors = function(list, options){
  var colors = {};
  if (list) {
    var pairs = list.split('-').forEach(function(item){
      var key = item.split(':')[0];
      var val = item.split(':')[1];
      colors[key] = parseInt(val);
    });
  } else {
    colors = { 
      "32":parseInt(ranColor()),
      "33":parseInt(ranColor()),
      "34":parseInt(ranColor()),
      "35":parseInt(ranColor()),
      "36":parseInt(ranColor()),
      "37":parseInt(ranColor()),
      "38":parseInt(ranColor()),
      "39":parseInt(ranColor()),
      "40":parseInt(ranColor()),
      "41":parseInt(ranColor()),
      "42":parseInt(ranColor()),
      "43":parseInt(ranColor()),
      "44":parseInt(ranColor()),
      "45":parseInt(ranColor()),
      "46":parseInt(ranColor()),
      "47":parseInt(ranColor()),
      "48":parseInt(ranColor()),
      "49":parseInt(ranColor())
    }
  }

  var cmd = {
    "jsonrpc":"2.0",
    "id":1,
    "method" : options && options.method || "setChannels",
    "params" : [colors]
  }

  var output = '' + JSON.stringify(cmd);
  
  if (ncc) {
    ncc.write(output + '\n');
  }
  return '' + JSON.stringify(cmd);
}

app.get('/random/', function(req, res){
  res.send(doColors());
});

app.get('/random/quiet/', function(req, res){
  doColors()
});

app.get('/random/fade/', function(req, res){
  var colors = JSON.parse(doColors(undefined,{method:"fadeTo"}));
  var p = colors.params[0];
  res.send(
    '<style>.c{width:50px;height:50px;display:inline-block;padding:5px;}</style>'+
    '<div class="c" style="background:rgb('+p["32"]+','+p["33"]+','+p["34"]+')"></div>'+
    '<div class="c" style="background:rgb('+p["35"]+','+p["36"]+','+p["37"]+')"></div>'+
    '<div class="c" style="background:rgb('+p["38"]+','+p["39"]+','+p["40"]+')"></div>'+
    '<div class="c" style="background:rgb('+p["41"]+','+p["42"]+','+p["43"]+')"></div>'+
    '<div class="c" style="background:rgb('+p["44"]+','+p["45"]+','+p["46"]+')"></div>'+
    '<div class="c" style="background:rgb('+p["47"]+','+p["48"]+','+p["49"]+')"></div>'
    );
});

app.get('/lights/:list/', function(req, res){
  res.send(doColors(req.params.list));
});

app.listen(3000);
