/**
 * Created by kuoa on 1/20/17.
 */

const weatherUrl = 'https://darksky.net/forecast/56.4887,84.9523/si12/en';
const skycons = new Skycons({"color": "white"});

var weather = require('weather-js');

// Options:
// search:     location name or zipcode
// degreeType: F or C

weather.find({search: 'Томск', degreeType: 'C'}, function(err, result) {
  if(err) console.log(err);

  console.log(JSON.stringify(result, null, 2));

  // $('#temperature').fadeOut(fadeValue, function () {
  //     "2281337"
  // });
  //
  // $('#hour-summary').fadeOut(fadeValue, function () {
  //     "$(this).text(hourSummary).fadeIn(fadeValue);"
  // });
  //
  // $('#day-summary').fadeOut(fadeValue, function () {
  //     "$(this).text(daySummary).fadeIn(fadeValue);"
  // });

});

/*milli seconds*/
const fadeValue = 600;

/* hours */
const updateInterval = 1;

skycons.add("weather-icon", Skycons.PARTLY_CLOUDY_NIGHT);
skycons.play();

function displayWeatherIcon(name) {

    var icon;

    switch (name) {
        case 'clear-day':
            icon = Skycons.CLEAR_DAY;
            break;

        case 'clear-night':
            icon = Skycons.CLEAR_NIGHT;
            break;

        case 'rain':
            icon = Skycons.RAIN;
            break;

        case 'snow':
            icon = Skycons.SNOW;
            break;

        case 'sleet':
            icon = Skycons.SLEET;
            break;

        case 'wind':
            icon = Skycons.WIND;
            break;

        case 'fog':
            icon = Skycons.FOG;
            break;

        case 'cloudy':
            icon = Skycons.FOG;
            break;

        case 'partly-cloudy-day':
            icon = Skycons.PARTLY_CLOUDY_DAY;
            break;

        case 'partly-cloudy-night':
            icon = Skycons.PARTLY_CLOUDY_NIGHT;
            break;

        default :
            icon = Skycons.CLEAR_DAY;
    }

    $('#weather-icon').fadeOut(fadeValue, function () {
        skycons.set("weather-icon", icon);
        $(this).fadeIn(fadeValue);
    });
}

function displayWeather(html){

    var jHtml = $.parseHTML(html),
        data = $(jHtml).find('#title'),
        icon = $(data).find('canvas').attr('class'),
        temp = $(data).find('.temp').text(),
        hourSummary = $(data).find('.summary').text(),
        daySummary = $(data).find('.next').text().trim();

    displayWeatherIcon(icon);

    $('#temperature').fadeOut(fadeValue, function () {
        $(this).text(temp).fadeIn(fadeValue);
    });

    $('#hour-summary').fadeOut(fadeValue, function () {
        $(this).text(hourSummary).fadeIn(fadeValue);
    });

    $('#day-summary').fadeOut(fadeValue, function () {
        $(this).text(daySummary).fadeIn(fadeValue);
    });
}

function getWeatherStatus(successHandler, errorHandler){

    $.ajax({
        url: weatherUrl,
        type: 'GET',
        success: function(html){

            /* remove images to avoid net::ERR_FILE_NOT_FOUND */
            html = html.replace(/<img\b[^>]*>/ig, '');
            successHandler(html);
        },
        error: errorHandler
    });
}

/* get current weather */
getWeatherStatus(displayWeather);


/* update  */
// setInterval(function(){
//     getWeatherStatus(displayWeather);
// }, updateInterval * 60 * 60 * 1000);
