const { response } = require("express");

let db;

const request = indexedDB.open('budget_tracker', 1)

// check for database version changes
request.onupgradeneeded = function (event) {
    // save a reference to the databse
    const db = event.target.result;
    // create a table called `new_budget`, with auto incrementing primary key
    db.createObjectStore(`new_budget`, { autoIncrement: true });
};

// upon success
request.onsuccess = function (event) {
    // when db is successfully created with its object store
    db = event.target.result;
    if (navigator.onLine) {
        uploadBudget()
    }
}

request.onerror = function (event) {
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

function uploadBudget() {
    // open a transaction on your db
    const transaction = db.transaction(['new_budget'], 'readwrite');

    // access your object store
    const budgetObjectStore = transaction.objectStore('new_budget');

    // get all records from store and set to a variable
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {
        // if there was data in indexedDb's store, send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message){
                    throw new Error(serverResponse);
                }
                // open another transaction
                const transaction = db.transaction(['new_budget'], 'readwrite');
                // access the new_budget object store
                const budgetObjectStore = transaction.objectStore('new_budget');
                // clear items in store
                budgetObjectStore.clear();

                alert('All saved expenses/deposits have been submitted!');
            })
            .catch(err => {
                console.log(err);
            })
        }
    }
}