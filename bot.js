console.log('Running.')

// WU API key is f11a0af5612e1400
var Twit = require('twit')
var config = require('./config')
var http = require('http');

var laststatus, lasthours = [0,0,0], lastday = 0;

//Run tweetConditions every 60 minutes
setInterval(tweetConditions, 1000*60*120);

var T = new Twit(config);
var stream = T.stream('user');

stream.on('follow', followed);

function followed(event) {
	var name = event.source.name;
	var screenname = event.source.screen_name;
	followThem(screenname);
	tweetIt('@' + screenname + ' thanks for following Code Brown Casco Bay.')
}

function tweetIt(s) {
	var tweet = {status: s}

	T.post('statuses/update', tweet, tweeted)

	function tweeted(err, data, response) {
		laststatus = status;
		if (err) {console.log(err);}
		else {console.log("success!");}
	}
}

function followThem(a) {
	console.log(a);

	T.post('friendships/create', {screen_name: a}, followed)

	function followed(err, data, response) {
		if (err) {console.log(err);}
		else {console.log("successfully followed user!");}
	}
}

function status(day_rain, hour_rain) {
	var status;
	if ( (day_rain<0.5) && (hour_rain < 0.1) && (hour_rain > 0)) { 
		status = "Light rain recorded in #PortlandME (" + hour_rain + "\" in the past hour). Localized sewer overflows are possible if precipitation increases, but so far remain unlikely." 
	}
	else if ( (day_rain<0.5) && (hour_rain > 0.1) && (hour_rain < 0.2)) {
		status = "Moderate rain recorded in #PortlandME (" + hour_rain + "\" in the past hour). Sewer overflows into Casco Bay are possible, based on past experience." 	
	}
	else if ( (day_rain<0.5) && (hour_rain >= 0.2)) {
		status = "Heavy rain recorded in #PortlandME (" + hour_rain + "\" in the past hour). Sewer overflows into Casco Bay are likely, based on past experience." 	
	}
	else if (day_rain>0.5) {
		status = "24-rainfall in #PortlandME: " + day_rain + "inches." +
		" Sewer overflows into Casco Bay are very likely, based on past experience." 	
	}
	else {status = null;} 

	(status && (status != laststatus)) ? tweetIt(status) : console.log('No updates.');

	console.log('24-hour rain: ' + day_rain + '. Hourly rain: ' + hour_rain);
}

function tweetConditions() {

	http.get("http://api.wunderground.com/api/" + config.wu_key + "/geolookup/conditions/q/ME/KPWM.json", function(res) {
		
		console.log("WU API response: " + res.statusCode);

		var day_rain = 0, hour_rain = 0;

		res.setEncoding('utf8');

		var body = '';

		res.on('data', function (chunk) {
			body += chunk;
		});

		res.on('end', function() {
			var jsonObject = JSON.parse(body);
			var currentTemp = +jsonObject.current_observation.temp_f;
			day_rain = +jsonObject.current_observation.precip_today_in;
			hour_rain = +jsonObject.current_observation.precip_1hr_in;
			// add the last hour's total to the lasthours array
			lasthours.pop(); lasthours.unshift(hour_rain);
			var checksum = lasthours.reduce(function(init,d) {
				return init + d;
			});
			if ( (currentTemp > 34) && (checksum <= day_rain + hour_rain) ) {
				status(day_rain,hour_rain);
			}
			else if ( (currentTemp <= 34) && (checksum <= day_rain + hour_rain) ) {
				console.log("Precipitation recorded but temperatures are near/below freezing.");
			}
			else {
				console.log('Something seems wrong. Last hours array: ' 
					+ lasthours 
					+ '; reported 24-hour total: ' + day_rain);
			}
		});

	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});

}