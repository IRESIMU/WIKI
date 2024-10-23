var lastAenergy = 0;
function loop(){
Shelly.call("Shelly.GetStatus", {}, function(result, error_code, error_message) { 
  
  let status = result["switch:0"];
  //print(status);
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
  
  print(aenergy);
   });
}

loop()
Timer.set(1000, true, loop);
