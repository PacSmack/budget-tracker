let db;

const request = indexedDB.open('budget_tracker', 1)

// check for database version changes
request.onupgradeneeded = function(event) {
    // save a reference to the databse
    const db = event.target.result;
    // create a table called `new_budget`, with auto incrementing primary key
    db.createObjectStore(`new_budget`, { autoIncrement: true });
};

// upon success
request.onsuccess = function(event) {
    // when db is successfully created with its object store
    db = event.target.result;
    if (navigator.onLine) {
        //sendTransaction()
    }
}

request.onerror = function(event) {
    console.log(event.target.errorCode)
};

// function if we attempt to submit new budget w/o internet connection
function saveRecord(record) {
    // open a new transaction with read and write permission
    const transaction = db.transaction(['new_budget'], 'readwrite');

    // access the object store for `new_pizza`
    const budgetObjectStore = transaction.objectStore('new_budget');

    // add record to store
    budgetObjectStore.add(record)
}