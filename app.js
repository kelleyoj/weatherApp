$(document).ready(function () {

    // needs work
    $('#back').click(function () {
        $('#first-page').toggleClass('isVisible');
        $('#second-page').toggleClass('isVisible');
    });

    // needs work
    $('.btn').click(function () {
        var input = $('input:text').val();
        var key = 'APPID=01a0b9d96cfb7addf958df0aa59a1d37'
        var currentUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + input + ',us&mode=json&' + key;
        var forecastUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=' + input + ',us&mode=json&' + key

        if (input === '') {
            $('.input').toggleClass('isEmpty');
        } else {
            $('#first-page').toggleClass('isVisible');
            $('#second-page').toggleClass('isVisible');
            getData(currentUrl, 'current');
            getData(forecastUrl, 'forecast');
        }
    });

    // needs work
    function getData(url, typeOfCall) {
        $.getJSON(url, {
            format: 'json'
        }).done(function (data) {
            inParse(data, typeOfCall);
            // for testing
            getIcon(data, typeOfCall);
        }).fail(function () {
            alert("Ajax call failed");
        });
    }

    // needs work
    function inParse(data, typeOfCall) {
        var parsedData = {};
        if (typeOfCall === 'current') {
            parsedData.name = data.name;
            parsedData.weather = data.weather[0].description;
            parsedData.wind = data.wind.speed;
            parsedData.humidy = data.main.humidity
            console.log(parsedData);
            return parsedData;
        } else {
            var formatedData = formatForecastData(data);
            // dayOfWeek(formatedData);
        }
    }

    function formatForecastData(data) {
        var formatedData = [];

        for (var i = 7; i <= 31; i += 8) {
            formatedData.push(
                {
                    day: dayOfWeek(getDate(data.list[i].dt_txt)),
                    temp: data.list[i].main.temp,
                    weather: data.list[i].weather[0].description,
                    wind: data.list[i].wind.speed,
                    humidity: data.list[i].main.humidity
                }
            );
        }
        // testing
        console.log(formatedData);
        console.log(data.list[0].weather[0].description);
        return formatedData;
    }

    // parse the date
    function getDate(date) {
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
        var weather = '';
        var icon = '';
        if (typeOfCall === 'current') {
            weather = data.weather[0].description;
            icon = $('#current-icon');
        } else {
            weather = data.list[0].weather[0].description;
            icon = $('#forecast-icon');
        }
        switch (weather) {
            case "clear sky":
            case "mist":
                $(icon).attr('src', 'icon/sunny.png');
                break;
            case "rain":
            case "shower rain":
            case "thunderstorm":
                $(icon).attr('src', 'icon/rain.png');
                break;
            case "snow":
                $(icon).attr('src', 'icon/sunny.png');
                break;
            default:
                $(icon).attr('src', 'icon/cloudy.png');
                break;
        }
        // testing
        console.log(data);
        console.log(weather);

    }
});

