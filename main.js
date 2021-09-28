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

const calculateMCC = (TN, FN, FP, TP) => {
  let ans = TP * TN - FP * FN;
  ans = ans / Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN));
  return ans;
};

/* Instructions */
fetch(URL)
  .then((res) => res.json())
  .then((data) => {
    buildEventsTable(data);

    const correlations = {};
    let totalTrues = 0;
    let totalFalses = 0;

    data.forEach((day) => {
      if (day.squirrel) totalTrues++;
      else totalFalses++;

      day.events.forEach((event) => {
        if (!correlations[event]) correlations[event] = [0, 0, 0, 0];
        if (day.squirrel) correlations[event][3] += 1;
        else correlations[event][1] += 1;
      });
    });

    const res = Object.keys(correlations).map((event) => {
      const matrix = correlations[event];
      const TN = totalFalses - matrix[1];
      const TP = totalTrues - matrix[3];
      return {
        event: event,
        correlation: calculateMCC(TN, matrix[1], TP, matrix[3]),
      };
    });

    console.log(res);
  });
