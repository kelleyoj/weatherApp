$(document).ready(function () {
    var isNight = true;
    var isDisplay=false;
    
    $('#back').click(function () {
        $('#first-page').toggleClass('isVisible');
        $('#second-page').toggleClass('isVisible');
    });
    $('.btn').click(function () {
        var input = $('input:text').val();
        var key = 'APPID=01a0b9d96cfb7addf958df0aa59a1d37'
        var currentUrl = 'https://api.openweathermap.org/data/2.5/weather?zip=' + input + ',us&mode=json&' + key;
        var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?zip=' + input + ',us&mode=json&' + key

        if (input === '') {
            $('.input').toggleClass('isEmpty');
        } else {
            getData(currentUrl, 'current');
            getData(forecastUrl, 'forecast');
            setTimeout(function(){
                if(isDisplay===true){
                    $('#first-page').toggleClass('isVisible');
                    $('#second-page').toggleClass('isVisible');
                }else {
                    alert("Please Try Again, The Zip Code Could Be Found");
                }
            },0600);
        }
    });
    $('input:text').keypress(function(e){
        if(e.which == 13){
            $('.btn').click();
        }
    });
    
    function getData(url, typeOfCall) {
        $.getJSON(url, {
            format: 'json'
        }).done(function (data) {
            stylePage(dataInParse(data, typeOfCall), typeOfCall);
            isDisplay = true;
        }).fail(function () {
            isDisplay = false;
        });
    }

    function dataInParse(data, typeOfCall) {
        var currentParsedData = {};
        var formatedParseData = [];

        if (typeOfCall === 'current') {
            currentParsedData.name = data.name;
            currentParsedData.time = data.dt;
            currentParsedData.sunset = data.sys.sunset;
            currentParsedData.sunrise = data.sys.sunrise;
            currentParsedData.temp = tempConverter(data.main.temp);
            currentParsedData.weather = data.weather[0].description;
            currentParsedData.wind = data.wind.speed;
            currentParsedData.humidy = data.main.humidity
        
            // displaying the correct icon
            getIcon(currentParsedData, typeOfCall);
            return currentParsedData;
        } else {
            for (var i = 0; i <= data.list.length-1; i++) {
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
            getIcon(formatedParseData, typeOfCall);
            return formatedParseData;
        }
    }

    function tempConverter(temp) {
        var fahrenheit = 9 / 5 * (temp - 273) + 32;
        return Math.floor(fahrenheit);
    }

    function getCurrentTime() {
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
        return time;
    }

    function stylePage(arr, typeOfCall) {
        $('#city-name').text(arr.name);
        $('#time').text(getCurrentTime());
        var count = 1;
        if (typeOfCall === 'current') {
            $('#temperature').html(arr.temp + ' <span>&#176</span>' + 'F');
            $('#climate').text(arr.weather);
            $('#wind').text('Wind: ' + arr.wind + ' mph');
            $('#humidy').text('Humidity: ' + arr.humidy + '%');
        } else {
            $('#forecastTemp').html(arr[7].temp + ' <span>&#176</span>' + 'F');
            $('#forecast-climate').text(arr[7].weather);
            $('#forecast-Wind').text('Wind: ' + arr[7].wind + ' mph');
            $('#forecast-Humidy').text('Humidity: ' + arr[7].humidity + '%');

            for (var i = 14; i <= arr.length-1; i+=7) {
                $('#day' + count).text(arr[i].day);
                $('#day' + count + '-Temp').html(arr[i].temp + ' <span>&#176</span>' + 'F');
                $('#day-' + count + '-Climate').text(arr[i].weather);
                count++;
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
        return day;
    }

    // Link correct icon to weather
    function getIcon(data, typeOfCall) {
        var count =1;
        if (typeOfCall === 'current') {
            switchIcon(data.weather, '#current-icon');
            if (data.time > data.sunset) {
                isNight = true;
            } else if (data.time < data.sunrise) {
                isNight = false;
            }
        } else {
            switchIcon(data[7].weather, '#forecast-icon');
            isNight = false;
            for (var i = 14; i <= data.length-1; i+=7) {
                switchIcon(data[i].weather, '#icon' + count);
                count++;
            }
        }
    }

    function switchIcon(weather, icon) {
        switch (weather) {
            case "clear sky":
            case "mist":
                if (isNight == true) {
                    $(icon).attr('src', 'icon/moon.png');
                } else {
                    $(icon).attr('src', 'icon/sunny.png');
                }
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

