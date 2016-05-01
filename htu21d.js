var mraa = require('mraa');
var Blynk = require('blynk-library');
var htu21d = require('htu21d');
var sleep = require('sleep');
var device = "/dev/i2c-1";
var address = 0x40;
var AUTH = 'e070566054ff4025924ffe5618cde13a';

var pin45 = new mraa.Gpio(45);
pin45.dir(mraa.DIR_OUT);

var blynk = new Blynk.Blynk(AUTH, options = {
  connector : new Blynk.TcpClient()
});

var sensor = new htu21d.Htu21d(device, address);
var temp = sensor.temperature();
var humidity = sensor.humidity();
sensor.setHeater(true);
var check_temp = sensor.temperature();
var check_humidity = sensor.humidity();
sensor.setHeater(false);
sensor.setMode(1);

var v9 = new blynk.VirtualPin(9);
var v8 = new blynk.VirtualPin(8);

v9.on('read', function() {
  var temp_lowres = sensor.temperature();
  v9.write(temp_lowres);
});

v8.on('read', function() {
  var hum_lowres = sensor.humidity();
  v8.write(hum_lowres);
});

blynk.on('connect', function() { console.log("Blynk ready.");pin45.write(1); });
blynk.on('disconnect', function() { console.log("DISCONNECT");pin45.write(0); });


/*var five = require("johnny-five");
var Edison = require("galileo-io");
var board = new five.Board({
  io: new Edison()
});

board.on("ready", function() {
  var hygrometer = new five.Hygrometer({
    controller: "HTU21D",
    freq:25
  });

  hygrometer.on("change", function() {
    console.log(this.relativeHumidity + " %");
  });
});*/