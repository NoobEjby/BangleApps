var DEBUG = false;
const filename = "park.js";
var drawTimeout;

var waypoints = require("waypoints").load();

function main() {
  Bangle.setGPSPower(true, filename);
  log(Bangle.isGPSOn());
  getGPSData(30, 0);
  if (drawTimeout) {
    clearTimeout(drawTimeout);
  }
}


function getGPSData(time, passes) {
  log(Bangle.isGPSOn());
  var fix = Bangle.getGPSFix();
  time = time * 1000;
  if (drawTimeout) {
    clearTimeout(drawTimeout);
  }
  if (fix != undefined){
    Bangle.setGPSPower(false, filename);
    log("GPS found saving location");
    saveParking(fix);
    return;
  }
  if (passes < 4){
    log(Bangle.isGPSOn());
    log("GPS not found trying agin");
    log("Pass: " + passes);
    drawTimeout = setTimeout(function() {
      getGPSData(time+30,passes+1);
    }, time - (Date.now() % time));
  } else {
    log("GPS not found all passes used shuting down");
    Bangle.setGPSPower(false, filename);
    log(Bangle.isGPSOn());
  }
}

function saveParking(fix) {
  log(fix);
  let n = {};
  n.name = "Parking";
  n.lat = fix.lat;
  n.lon = fix.lon;
  if (fix.alt != -9999)
    n.alt = fix.alt;
  waypoints[0] = n;
  log(waypoints);
  require('Storage').writeJSON("waypoints.json", waypoints);
  log("Saved");
  Bangle.buzz(200, 1);

}

var log = (message) => {
  if (DEBUG) {
    console.log(JSON.stringify(message));
  }
};

main();