$(document).ready(function () {
    var isNight = true;
    // needs work
    $('#back').click(function () {
        $('#first-page').toggleClass('isVisible');
        $('#second-page').toggleClass('isVisible');
    });

    // needs work

    // (function () {

    //     var input = '10469';
    //     // "$('input:text').val();"
    //     var key = 'APPID=01a0b9d96cfb7addf958df0aa59a1d37'
    //     var currentUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=' + input + ',us&mode=json&' + key;
    //     var forecastUrl = 'http://api.openweathermap.org/data/2.5/forecast?zip=' + input + ',us&mode=json&' + key

    //     if (input === '') {
    //         $('.input').toggleClass('isEmpty');
    //     } else {
    //         $('#first-page').toggleClass('isVisible');
    //         $('#second-page').toggleClass('isVisible');
    //         getData(currentUrl, 'current');
    //         getData(forecastUrl, 'forecast');
    //     }


    // })();

    // needs work
    function getData(url, typeOfCall) {
        $.getJSON(url, {
            format: 'json'
        }).done(function (data) {
            console.log("HHH");
            console.log(data);
            stylePage(dataInParse(data, typeOfCall), typeOfCall);

        }).fail(function () {
            alert("Ajax call failed");
        });
    }

    // needs work
    function dataInParse(data, typeOfCall) {
        var currentParsedData = {};
        var formatedParseData = [];
        console.log('DATA ' + data);
        if (typeOfCall === 'current') {
            currentParsedData.name = data.name;
            currentParsedData.time = data.dt;
            currentParsedData.sunset = data.sys.sunset;
            currentParsedData.sunrise = data.sys.sunrise;
            currentParsedData.temp = tempConverter(data.main.temp);
            currentParsedData.weather = data.weather[0].description;
            currentParsedData.wind = data.wind.speed;
            currentParsedData.humidy = data.main.humidity
            // testing
            console.log('FROM DATAPARSE ' + currentParsedData.sunset + " " + currentParsedData.time + " " + currentParsedData.sunrise);
            console.log(currentParsedData);
            // displaying the correct icon
            getIcon(currentParsedData, typeOfCall);
            return currentParsedData;
        } else {
            for (var i = 1; i <= 38; i++) {
                formatedParseData.push(
                    {
                        day: dayOfWeek(parseDate(data.list[i].dt_txt)),
                        temp: tempConverter(data.list[i].main.temp),
                        weather: data.list[i].weather[0].description,
                        wind: data.list[i].wind.speed,
                        humidity: data.list[i].main.humidity
                    }
                );
            }
            //testing
            console.log(formatedParseData);
            console.log(data.list[0].weather[0].description);
            getIcon(formatedParseData, typeOfCall);
            return formatedParseData;
        }
    }

    function tempConverter(temp) {
        var fahrenheit = 9 / 5 * (temp - 273) + 32;
        return Math.floor(fahrenheit);
    }

    function getCurrentTime() {
        // testing
        var day = new Date();
        var hours = day.getHours();
        var min = day.getMinutes();
        if (min <= 9) {
            min = '0' + min;
        }
        var time = '';
        if (hours > 12) {
            hours -= 12;
            time = hours + ':' + min + 'pm';
        } else if (hours === 12) {
            time = hours + ':' + 00 + 'pm';
        } else if (hours === 0) {
            hours = 12;
            time = hours + ':' + min + 'pm';
        } else {
            time = hours + ':' + min + 'am';
        }
        console.log(time);
        return time;
    }

    function stylePage(arr, typeOfCall) {
        $('#city-name').text(arr.name);
        $('#time').text(getCurrentTime());
        if (typeOfCall === 'current') {
            $('#temperature').html(arr.temp + ' <span>&#176</span>' + 'F');
            $('#climate').text(arr.weather);
            $('#wind').text('Wind: ' + arr.wind + ' mph');
            $('#humidy').text('Humidity: ' + arr.humidy + '%');
        } else {
            $('#forecastTemp').html(arr[0].temp + ' <span>&#176</span>' + 'F');
            $('#forecast-climate').text(arr[0].weather);
            $('#forecast-Wind').text('Wind: ' + arr[0].wind + ' mph');
            $('#forecast-Humidy').text('Humidity: ' + arr[0].humidity + '%');

            for (var i = 0; i <= 3; i++) {
                $('#day' + i).text(arr[i].day);
                $('#day' + i + '-Temp').html(arr[i].temp + ' <span>&#176</span>' + 'F');
                $('#day-' + i + '-Climate').text(arr[i].weather);
            }
        }
    }

    // parse the date
    function parseDate(date) {
        var temp = '';
        for (var i = 0; i < date.length; i++) {
            temp += date.charAt(i);
            if (date.charAt(i) === ' ')
                break;
        }
        return temp.trim();
    }

    // parse day of the week
    function dayOfWeek(formatedDate) {
        var date = new Date(formatedDate);
        var temp = date.getDay();
        var day = '';
        switch (temp) {
            case 0:
                day = 'SUNDAY';
                break;
            case 1:
                day = 'MONDAY';
                break;
            case 2:
                day = 'TUESDAY';
                break;
            case 3:
                day = 'WEDNESDAY';
                break;
            case 4:
                day = 'THURSDAY';
                break;
            case 5:
                day = 'FRIDAY';
                break;
            case 6:
                day = 'SATURDAY';
                break;
            default:
                day = "BEAUTIFUL"
                break;
        };
        // test
        console.log(temp);
        console.log(date);
        console.log(day);
        return day;
    }

    // Link correct icon to weather
    function getIcon(data, typeOfCall) {
        if (typeOfCall === 'current') {
            console.log("GETicon " + data.time);
            switchIcon(data.weather, '#current-icon');
            // if (data.time > data.sunset) {
            //     isNight = true;
            // } else if (data.time < data.sunrise) {
            //     isNight = false;
            // }
            // console.log("isNIGHT " + isNight);
        } else {
            switchIcon(data[0].weather, '#forecast-icon');
            // isNight = false;
            for (var i = 0; i <= 3; i++) {
                switchIcon(data[i].weather, '#icon' + i);
            }
        }
        console.log("GETicon " + data.time);
    }

    function switchIcon(weather, icon) {
        // testing
        console.log('SWITCHICON ' + weather, icon);
        switch (weather) {
            case "clear sky":
            case "mist":
                // if (isNight == true) {
                //     $(icon).attr('src', 'icon/moon.png');
                // } else {
                //     $(icon).attr('src', 'icon/sunny.png');
                // }
                break;
            case "rain":
            case "shower rain":
            case "thunderstorm":
                $(icon).attr('src', 'icon/rain.png');
                break;
            case "snow":
            case "light snow":
                $(icon).attr('src', 'icon/snow2.png');
                break;
            default:
                $(icon).attr('src', 'icon/cloudy.png');
                break;
        }
    }
});

