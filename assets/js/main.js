let app = new Vue({
    el: '#app',
    data: {
        loadingData: false,
        currentTime: '-- : -- : --',
        currentDate: '-',
        currentTemperature: '-',
        currentTemperatureIcon: '',
        currentTemperatureType: '-',
        sunrise: '-- : -- : --',
        sunset: '-- : -- : --',
    },
    created() {
        this.getTodayInfo();
        this.getCurrentTemperature();

        // Fetch data every hour
        setInterval(() => {
            this.getCurrentTemperature();
        }, 1000 * 60 * 10);
    },
    methods: {
        getTodayInfo: function() {
            setInterval(() => {
                const today = new Date();
                const day = moment(today).format('ddd');
                const date = moment(today).format('MMM Do YYYY');
                const time = moment(today).format('hh : mm A');

                this.currentDate = day + ', ' + date;
                this.currentTime = time;
            }, 1000);
        },
        getCurrentTemperature: function() {
            const API_KEY = document.querySelector('meta[name=weather-api-key]').getAttribute('content');
            const CITY = document.querySelector('meta[name=location-city]').getAttribute('content');
            const STATE = document.querySelector('meta[name=location-state]').getAttribute('content');
            const COUNTRY = document.querySelector('meta[name=location-country]').getAttribute('content');

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${STATE},${COUNTRY}&appid=${API_KEY}`;
            const weatherIconUrl = `https://openweathermap.org/img/wn/`;

            fetch(weatherUrl)
                .then(data => data.json())
                .then(response => {
                    console.log(moment().format('hh : mm A'));

                    this.currentTemperature = response.main.temp - 273.15;
                    this.currentTemperatureIcon = weatherIconUrl + response.weather[0].icon + '@2x.png';
                    this.currentTemperatureType = response.weather[0].main;
                    this.sunrise = moment(new Date(response.sys.sunrise * 1000)).format('hh : mm A');
                    this.sunset = moment(new Date(response.sys.sunset * 1000)).format('hh : mm A');
                });
        },
        refreshData: function() {
            this.loadingData = true;
            this.getTodayInfo();
            this.getCurrentTemperature();

            setTimeout(() => {
                this.loadingData = false;
            }, 1100)
        }
    }
});