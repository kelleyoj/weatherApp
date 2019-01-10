$(document).ready(function () {

    
    $('.btn').click(function () {
        var input = $('input:text').val();
        if(input===''){
            $('.input').toggleClass('isEmpty');
        }else{
            findcity(input)
        }
    });


    function findcity(city) {
        var key = 'APPID=01a0b9d96cfb7addf958df0aa59a1d37'
        var url = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + ',us&mode=json&' + key
        $.getJSON(url, {
            format: 'json'
        }).done(function (data) {
            console.log(data)
        }).fail(function () {
            alert("Ajax call failed");
        });
    }
});

