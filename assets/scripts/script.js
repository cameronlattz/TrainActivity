const script = function() {
    let _rowTemplate;

    const _addTrain = function(event) {
        event.preventDefault();
        let train = _getForm();
        let timeIsValid = false;
        const colonIndex = train.time.indexOf(":");
        if (colonIndex !== -1) {
            let hours = train.time.substring(0, colonIndex);
            let minutes = train.time.substring(colonIndex + 1);
            if (_isNumeric(hours) && _isNumeric(minutes)) {
                train.time = (parseInt(hours) * 60)%24 + parseInt(minutes);
                timeIsValid = true;
            }
        }
        if (!timeIsValid) {
            alert("Please input a time in HH:mm format.");
            return false;
        }
        if (!_isNumeric(train.frequency)) {
            alert("Please input an integer in the Frequency field.");
            return false;
        }
        trains.push(train);
        document.getElementById("form").reset();
        _displayTrains();
    }

    const _calculateTimes = function(trainsParam) {
        for (let i = 0; i < trainsParam.length; i++) {
            let train = trainsParam[i];
            const date = new Date();
            const currentTime = (date.getHours() * 60) + date.getMinutes();
            const timeLeft = (currentTime - train.time)%train.frequency;
            trainsParam[i].next_arrival = _displayTime(currentTime + timeLeft);
            trainsParam[i].mins_away = timeLeft;
        }
        return trainsParam;
    }

    const _displayTime = function(time) {
        let hours = Math.floor(time/60);
        let minutes = time - (hours * 60);
        hours = hours%24;
        let isPm = hours >= 12;
        hours = hours - (isPm ? 12 : 0);
        hours = (hours >= 10 ? "" : "0") + hours;
        minutes = (minutes >= 10 ? "" : "0") +minutes;
        return hours + ":" + minutes + (isPm ? "pm" : "am");
    }

    const _displayTrains = function() {
        document.getElementById("tableBody").innerHTML = "";
        trains = _calculateTimes(trains);
        for (let i = 0; i < trains.length; i++) {
            let train = trains[i];
            const newRow = _rowTemplate.cloneNode(true);
            const cells = newRow.children;
            cells[0].textContent = train.name;
            cells[1].textContent = train.destination;
            cells[2].textContent = train.frequency;
            cells[3].textContent = train.next_arrival;
            cells[4].textContent = train.mins_away;
            document.getElementById("tableBody").append(newRow);
        }
    }

    const _getForm = function() {
        return {
            name: document.getElementById("name").value,
            destination: document.getElementById("destination").value,
            frequency: document.getElementById("frequency").value,
            time: document.getElementById("time").value
        }
    }

    const _isNumeric = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    document.addEventListener("DOMContentLoaded", function() {
        _rowTemplate = document.getElementById("tableBody").getElementsByTagName("tr")[0];
        _displayTrains();
        document.getElementById("form").addEventListener("submit", _addTrain);
    });
}();

let trains = [
    {
        name: "Trenton Express",
        destination: "Trenton",
        frequency: 25,
        time: (60*17)+35
    },
    {
        name: "Oregon Trail",
        destination: "Salem, Oregon",
        frequency: 3600,
        time: (60*13)+39
    },
    {
        name: "Midnight Carriage",
        destination: "Philadelphia",
        frequency: 720,
        time: (60*0)+0
    },
    {
        name: "Sing Sing Caravan",
        destination: "Atlanta",
        frequency: 60,
        time: (60*18)+6
    },
    {
        name: "Boston Bus",
        destination: "Boston",
        frequency: 5,
        time: (60*18)+50
    },
    {
        name: "California Caravan",
        destination: "San Fransisco",
        frequency: 6000,
        time: (1*14)+25
    },
    {
        name: "Analben's Tram",
        destination: "Florida",
        frequency: 25,
        time: (60*17)+28
    }
];