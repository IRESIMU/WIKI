from machine import ADC, Pin, Timer
import time
import network
import gc
import ubinascii
import urequests
import json

# Wi-Fi credentials
ssid = 'Warp Gate'
password = 'entaroadun'

url = "http://ds.seisho.us/reading/meterV1"
#url = "http://192.168.178.52/logger.php"
#url = "http://192.168.178.52:8082/reading/meterV1"

mId = machine.unique_id()
mId = ubinascii.hexlify(mId).decode()

name = "PicoMeter"

# Initialize ADC on pin GP26 (ADC0)
adc = ADC(Pin(26))
psupply = ADC(Pin(27))
vref = ADC(Pin(28))

# Conversion factor for ADC reading to voltage
conv = 3.0 / 65535

# Buffer to store samples
sample_buffer = []
max_samples = 400

currentConv = 50 / 1.0

led = machine.Pin("LED", machine.Pin.OUT)

led.value(0)

# Function to connect to Wi-Fi
def connect_to_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)
    count = 0
    while not wlan.isconnected():
        count += 1
        if count > 15:
            return False
            
        led.value(1)
        print('Connecting to network...')
        time.sleep(0.5)
        led.value(0)
        time.sleep(0.1)
    print('Network connected:', wlan.ifconfig())
    network.hostname("demoPico01")
    return True

def disconnect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.disconnect()
    wlan.active(False)
    print('Network disconnected')
    return wlan

def readOnce(pin):
    val = pin.read_u16() * conv
    return val

# Function to handle ADC sampling
def sample_adc(t):
    global sample_buffer
    if len(sample_buffer) < max_samples:
        # Read the analog value (0-65535) and convert to voltage
        analog_value = adc.read_u16() * conv
        sample_buffer.append(analog_value)
    else:
        # Stop the timer
        t.deinit()
        
        #cvref = vref.read_u16() * conv
        #cvref = 0
        # Find the highest value in the buffer
        #max_value = max(
        
        #print(sample_buffer)
        
        rms = RMS(sample_buffer)
        
        #print("Cvref:" , cvref)
        
        print(f"Vrms Value: {rms}")
        sendData(rms)
        
        #print("current: " , current)
        #print("power", current * 230)


        # Clear the buffer for the next round of sampling
        sample_buffer = []

def sendData(rms):
    if not connect_to_wifi():
        return False
    
    #we have a 1MOhm tension split, so we have to compensate for impedance of ADC with is 10M
    vsupply = (readOnce(psupply) * 2) * 1.06
    
    current = currentConv * rms

    data = {
        "type": "Meter",
        "decoder": "meterV1",
        "name": name,
        "serial": mId,
        "power": current * 230,
        "voltage": 230,
        "current": current,
        "battery": vsupply,
      };
    json_data = json.dumps(data)
    
    response = urequests.post(url, data=json_data, timeout=5)

    gc.collect()
        
    disconnect_wifi()

def RMS(signal):
    # Step 1: Calculate the average value (DC component)
    average_value = sum(signal) / len(signal)
    # Step 2: Subtract the average value from the signal to remove the DC component
    signal_without_dc = [x - average_value for x in signal]
    #print(f"Dc {average_value}" )
    mean_square = sum(x**2 for x in signal_without_dc) / len(signal_without_dc)
    rms2 = mean_square ** 0.5
    
    return rms2

def extended_lightsleep(seconds):
    milliseconds = seconds * 1000
    chunk = 1000  # 1 second chunks
    for _ in range(milliseconds // chunk):
        machine.lightsleep(chunk)
    remaining = milliseconds % chunk
    if remaining > 0:
        machine.lightsleep(remaining)

#first time we start we delay a bit so we have time to pause in case we want to debug, else the lightsleep will break thonny
led.value(1)
time.sleep(0.1)
led.value(0)
time.sleep(0.4)
led.value(1)
time.sleep(0.1)
led.value(0)
time.sleep(5)
# Keep the script running
while True:
    
    # Initialize a Timer
    timer = Timer()
    led.value(1)
    
    # Set the timer to call the sample_adc function at 20 kHz (50 microseconds)
    timer.init(freq=50000, mode=Timer.PERIODIC, callback=sample_adc)
    led.value(0)
    # Sleep to reduce CPU usage
    #If before of lightsleep I do not normal sleep it wil hang!!!
    time.sleep(1)
    extended_lightsleep(120)


