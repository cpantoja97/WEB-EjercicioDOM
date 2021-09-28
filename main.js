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

const buildCorrelationsTable = (data) => {
  const correlationsTable = document.getElementById("correlations-table");
  const correlationsTableBody = correlationsTable.tBodies[0];

  for (let i = 0; i < data.length; i++) {
    // Insert row and cells
    const row = correlationsTableBody.insertRow(i);
    let indexCell = document.createElement("th");
    row.appendChild(indexCell);
    const eventCell = row.insertCell(1);
    const correlationCell = row.insertCell(2);

    // Set cells
    indexCell.innerHTML = i + 1;
    eventCell.innerHTML = data[i].event;
    correlationCell.innerHTML = data[i].correlation;
  }
};

const calculateMCC = (TN, FN, FP, TP) => {
  let ans = TP * TN - FP * FN;
  ans = ans / Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN));
  return ans;
};

function compareCorrelationObjects(a, b) {
  if (a.correlation > b.correlation) {
    return -1;
  }
  if (a.correlation < b.correlation) {
    return 1;
  }
  return 0;
}

/* Instructions */
fetch(URL)
  .then((res) => res.json())
  .then((data) => {
    // Fills in table that displays events
    buildEventsTable(data);

    // Variables to count occurences
    const eventsCount = {};
    let totalTrues = 0;
    let totalFalses = 0;

    // Counts occurrences:
    // eventsCount will hold dictionary with events and their FN & TP
    data.forEach((day) => {
      if (day.squirrel) totalTrues++;
      else totalFalses++;

      day.events.forEach((event) => {
        // Adds event entry to dictionary if unexisting event
        if (!eventsCount[event]) eventsCount[event] = {FN: 0, TP: 0};

        // Increases true or false count for each event occurrence
        if (day.squirrel) eventsCount[event].TP += 1;
        else eventsCount[event].FN += 1;
      });
    });

    // Obtains TN & FP from the totals and FN & TP info
    // Calculates MCC
    const correlations = Object.keys(eventsCount).map((event) => {
      const {FN, TP} = eventsCount[event];
      const TN = totalFalses - FN;
      const FP = totalTrues - TP;
      return {
        event,
        correlation: calculateMCC(TN, FN, FP, TP),
      };
    });

    // Sorts correlations array based on correlation score
    correlations.sort(compareCorrelationObjects);

    // Fills in table that displays correlations for each event
    buildCorrelationsTable(correlations);
  });
