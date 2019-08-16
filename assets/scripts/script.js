const script = function() {
    // global variable that will be used to store a <tr> template for adding trains
    let _rowTemplate;
    // global variable that stores trains saved to local storage
    let _savedTrains = [];

    // function that will run when the "Add Train" button is clicked
    const _addTrain = function(event) {
        event.preventDefault();
        // build the train object
        let train = {
            name: document.getElementById("name").value,
            destination: document.getElementById("destination").value,
            frequency: document.getElementById("frequency").value,
            time: document.getElementById("time").value
        };
        // figure out if the time entered is in a correct format
        let timeIsValid = false;
        const colonIndex = train.time.indexOf(":");
        if (colonIndex !== -1) {
            let hours = train.time.substring(0, colonIndex);
            let minutes = train.time.substring(colonIndex + 1);
            if (_isNumeric(hours) && _isNumeric(minutes)) {
                train.time = (parseInt(hours)%24 * 60) + parseInt(minutes);
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
        // add the train to local storage
        _savedTrains.push(train);
        localStorage.setItem("trains", JSON.stringify(_savedTrains));
        // empty the form
        document.getElementById("form").reset();
        // show the updated train list
        _displayTrains();
    }

    // calculates "Next Arrival" and "Minutes Away" values
    const _calculateTimes = function(trainsParam) {
        const date = new Date();
        // turn the date object into the number of minutes so far today
        const currentTime = (date.getHours() * 60) + date.getMinutes();
        for (let i = 0; i < trainsParam.length; i++) {
            let train = trainsParam[i];
            // calculate the number of times a train has run so far today
            let loopsRun = Math.ceil((currentTime - train.time)/train.frequency);
            // if the train hasn't run yet today, the loop count would be potentially negative
            if (train.time > currentTime) loopsRun = 0;
            // calculate the next arrival time based on how many times its run today, how often it runs,
            // and when it started running
            const nextArrival = (loopsRun * train.frequency) + train.time;
            trainsParam[i].next_arrival = nextArrival;
            trainsParam[i].mins_away = nextArrival - currentTime;
        }
        return trainsParam;
    }

    // display the train information in a table
    const _displayTrains = function() {
        // clear the table
        document.getElementById("tableBody").innerHTML = "";
        // add the preset trains to the local storage saved trains
        let allTrains = trains.slice();
        for (let i = 0; i < _savedTrains.length; i++) {
            _savedTrains[i].isSaved = true;
            allTrains.push(_savedTrains[i]);
        }
        // calculate the "Next Arrival" and "Minutes Remaining" values
        allTrains = _calculateTimes(allTrains);
        // populate the table
        for (let i = 0; i < allTrains.length; i++) {
            let train = allTrains[i];
            // copy the row template into a new row
            const newRow = _rowTemplate.cloneNode(true);
            const cells = newRow.children;
            // fill the cells out
            cells[0].textContent = train.name;
            cells[1].textContent = train.destination;
            cells[2].textContent = train.frequency;
            cells[3].textContent = _getDisplayTime(train.next_arrival);
            cells[4].textContent = train.mins_away;
            // if the train is saved to local storage, allow the user to remove it
            if (train.isSaved) {
                const button = document.createElement("a");
                button.classList.add("btn-flat", "btn-small", "waves-effect", "waves-light", "red", "lighten-1", "white-text");
                button.textContent = "x";
                button.addEventListener("click", _removeTrain);
                cells[5].append(button);
                // attach the row element to the train object in the global array
                train.rowElement = newRow;
            }
            document.getElementById("tableBody").append(newRow);
        }
    }

    // convert number of minutes since midnight to HH:mm
    const _getDisplayTime = function(time) {
        let hours = Math.floor(time/60);
        let minutes = time - (hours * 60);
        hours = hours%24;
        let isPm = hours >= 12;
        hours = hours - (isPm ? 12 : 0);
        hours = (hours >= 10 ? "" : "0") + hours;
        minutes = (minutes >= 10 ? "" : "0") + minutes;
        return hours + ":" + minutes + (isPm ? "pm" : "am");
    }

    // test if a string is a number
    const _isNumeric = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    // remove a train after the user clicks "x"
    const _removeTrain = function(event) {
        const row = event.target.closest("tr");
        // go through the _savedTrains global array
        for (let i = 0; i < _savedTrains.length; i++) {
            // if the iterated item in the array has this row attached to it, remove it from the array
            if (_savedTrains[i].rowElement === row) {
                _savedTrains.splice(i, 1);
                break;
            }
        }
        // update local storage and redisplay train schedule
        localStorage.setItem("trains", JSON.stringify(_savedTrains));
        _displayTrains();
    }

    // wait til the page is loaded, since we put the script reference in the head tag
    document.addEventListener("DOMContentLoaded", function() {
        // save the blank row template before it gets wiped into a global variable
        _rowTemplate = document.getElementById("tableBody").getElementsByTagName("tr")[0];
        // read the trains saved to local storage into a global variable
        _savedTrains = JSON.parse(localStorage.getItem("trains")) || [];
        // show the train schedule
        _displayTrains();
        // add form submit event listener
        document.getElementById("form").addEventListener("submit", _addTrain);
        // refresh the train schedule every second
        setInterval(_displayTrains, 1000);
    });

    // usually would put this at the top, but let's keep it down here for cleanliness
    const trains = [
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
            time: (60*19)+45
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
}();