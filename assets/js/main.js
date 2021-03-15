let app = new Vue({
    el: '#app',
    data: {
        currentTime: '-- : -- : --',
        currentDate: '-',
    },
    created() {
        this.getTodayInfo();
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
        }
    }
});