<?php
// Set the folder where logs will be stored
$logDir = '/var/www/html/sd/tryLog';

// Ensure the log directory exists
if (!file_exists($logDir)) {
    mkdir($logDir, 0755, true);
}

$date = new DateTime();

// Get the current date and time for the log filename
$logFile = $logDir . '/' . $date->format('Y-m-d_H-i-s.u') . '.log';

// Function to format array data as a string
function arrayToString($array) {
    $output = "";
    foreach ($array as $key => $value) {
        if (is_array($value)) {
            $output .= "$key = " . print_r($value, true) . "\n";
        } else {
            $output .= "$key = $value\n";
        }
    }
    return $output;
}

$raw = file_get_contents('php://input');
$json = json_decode($raw);
$json_pretty = json_encode($json, JSON_PRETTY_PRINT);
// Gather input parameters
$data = "GET parameters:\n" . arrayToString($_GET) . "\n";
$data .= "POST parameters:\n" . arrayToString($_POST) . "\n";
$data .= "FILES parameters:\n" . arrayToString($_FILES) . "\n";
$data .= "Raw parameters:\n" . $json_pretty . "\n";

// Write the data to the log file
file_put_contents($logFile, $data);

if(!isset($json->request->intent->name)){
		echo <<<EOD
{
    "version": "1.0",
    "response": {
        "outputSpeech": {
            "type": "PlainText",
            "text": "Invalid Request."
        },
        "shouldEndSession": true
    }
}
EOD;
	return;
}
	
$intent = $json->request->intent->name;

function batteryChecker(){
	echo <<<EOD
{
    "version": "1.0",
    "response": {
        "outputSpeech": {
            "type": "PlainText",
            "text": "The battery charge level is 75 percent."
        },
        "shouldEndSession": true
    }
}
EOD;
}

function greenEnergy(){
		echo <<<EOD
{
    "version": "1.0",
    "response": {
        "outputSpeech": {
            "type": "PlainText",
            "text": "Sorry but is raining so no photovoltaic energy for you."
        },
        "shouldEndSession": true
    }
}
EOD;
}

function AMAZON_FallbackIntent(){
			echo <<<EOD
{
    "version": "1.0",
    "response": {
        "outputSpeech": {
            "type": "PlainText",
            "text": "Invalid command, please review the list of supported utterances"
        },
        "shouldEndSession": true
    }
}
EOD;
}


function baseText(string $string){
				echo <<<EOD
{
    "version": "1.0",
    "response": {
        "outputSpeech": {
            "type": "PlainText",
            "text": "{$string}"
        },
        "shouldEndSession": true
    }
}
EOD;
}

function carBatteryTimeToCharge(){
	baseText("The car is not even connected!");
}

function carBatteryChecker(){
	baseText("I think is enought to go buy milk in Lidl");
}

switch($intent){
	case "batteryChecker":
		return batteryChecker();
		
	case "AMAZON.FallbackIntent":
		return AMAZON_FallbackIntent();
	
	case "carBatteryTimeToCharge":
		return carBatteryTimeToCharge();
		
	case "carBatteryChecker":
		return carBatteryChecker();
		
	case "greenEnergy":
		return greenEnergy();
}



