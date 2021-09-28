/* Constants */
const URL =
  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

/* Functions */
const buildEventsTable = (data) => {
  const eventsTable = document.getElementById("events-table");
  const eventsTableBody = eventsTable.tBodies[0];

  for (let i = 0; i < data.length; i++) {
    // Insert row and cells
    const row = eventsTableBody.insertRow(i);
    let indexCell = document.createElement("th");
    row.appendChild(indexCell);
    const eventsCell = row.insertCell(1);
    const squirrelCell = row.insertCell(2);

    // Set cells
    indexCell.innerHTML = i + 1;
    eventsCell.innerHTML = data[i].events.join(", ");
    squirrelCell.innerHTML = data[i].squirrel;

    // Highlight row if squirrel is true
    if (data[i].squirrel) row.classList.add("table-danger");
  }
};

/* Instructions */
fetch(URL)
  .then((res) => res.json())
  .then((data) => {
    buildEventsTable(data);
  });
