const script = function() {
    let _rowTemplate;

    const _addTrain = function(event) {
        event.preventDefault();
        const newRow = _rowTemplate.cloneNode(true);
        const cells = newRow.children;
        for (let i = 0; i < cells.length; i++) {
            cells[i].textContent = "tesT";
        }
        document.getElementById("tableBody").append(newRow);
    }

    const _init = function() {
        document.getElementById("form").addEventListener("submit", _addTrain);
        _rowTemplate = document.getElementById("tableBody").getElementsByTagName("tr")[0];
    }
    document.addEventListener("DOMContentLoaded", _init);
}();