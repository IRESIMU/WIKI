var lastAenergy = 0;
var minPower = 0;
var maxPower = 0;

function loop(){
  const devInfo = Shelly.getDeviceInfo();
  const mac = devInfo.mac;
  const name = devInfo.name
  Shelly.call("Shelly.GetStatus", {}, function(result, error_code, error_message) {
    if (error_code === 0) {
      // Extract the relevant power status information
      // Adjust the path based on your specific Shelly device model
      
      //print(result);
      let status = result["switch:0"];
      
      let aenergy = 0;
      let curEnergy = status.aenergy.total;
      //if device was restarted
      if(lastAenergy == 0){
        //we will skip this increment
        aenergy = 0;
      }else{
        aenergy = curEnergy - lastAenergy;
      }
      lastAenergy = curEnergy;
      
      var powerStatus = status.apower;
      maxPower = Math.max(maxPower,powerStatus);
      minPower = Math.min(minPower,powerStatus);
      
      var voltage = status.voltage;
      var current = status.current;
      var temp = status.temperature.tC;
      
      var statusJson = {
        type: "SmartPlug",
        decoder: "shellyV1",
        name: name,
        serial: mac,
        power: powerStatus,
        voltage: voltage,
        current: current,
        energy: aenergy,
        minPower: minPower,
        maxPower: maxPower,
        temperature: temp
      };
      //set current value, this is a form of reset, as putting 0 will make invalid the min
      minPower = powerStatus;
      maxPower = powerStatus;
      
      let pay = JSON.stringify(statusJson);
      
      //Shelly.call("HTTP.POST", {"url": "http://g1.carige.xyz/s2s.php", "body": pay, "timeout": 5});
      Shelly.call("HTTP.POST", {"url": "http://ds.seisho.us/reading/V1", "body": pay, "timeout": 5});
     

      // Print the power status to the console log
      //print(statusJson);

    } else {
      // Print the error message to the console log
      print("Error fetching status: " + error_message);
    }
  });
 }
 
 
 function sampler(){
    Shelly.call("Shelly.GetStatus", {}, function(result, error_code, error_message) {
    if (error_code != 0) {
      return;
    }
    let status = result["switch:0"];
    var power = status.apower;
    maxPower = Math.max(maxPower,power);
    minPower = Math.min(minPower,power);
});
}

function init(){
    Shelly.call("Shelly.GetStatus", {}, function(result, error_code, error_message) {
    if (error_code != 0) {
      return;
    }
    let status = result["switch:0"];
    var power = status.apower;
    maxPower = power;
    minPower = power;
});
}

init();
loop();      


Timer.set(1000, true, sampler);
Timer.set(60 * 1 * 1000, true, loop);
