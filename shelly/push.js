function loop(){
  const mac = Shelly.getDeviceInfo().mac;
  Shelly.call("Shelly.GetStatus", {}, function(result, error_code, error_message) {
    if (error_code === 0) {
      // Extract the relevant power status information
      // Adjust the path based on your specific Shelly device model
      
      //print(result);
      let status = result["switch:0"];
      
      var powerStatus = status.apower;
      var voltage = status.voltage;
      var current = status.current;
      var aenergy = status.aenergy;
      var temp = status.temperature.tC;
      
      var statusJson = {
        deviceId: mac,
        power: powerStatus,
        voltage: voltage,
        current: current,
        energy: aenergy,
        temperature: temp
      };
      
      let pay = JSON.stringify(statusJson);
      
      Shelly.call("HTTP.POST", {"url": "http://g1.carige.xyz/s2s.php", "body": pay, "timeout": 5});
      
      /*
      // Print the power status to the console log
      print("Power: " + powerStatus + " W");
      print("Voltage: " + voltage + " V");
      print("Current: " + current + " A");
      print(aenergy);
      print(temp);
      */
    } else {
      // Print the error message to the console log
      print("Error fetching status: " + error_message);
    }
  });
 }
 
loop()
Timer.set(60 * 1000, true, loop);
