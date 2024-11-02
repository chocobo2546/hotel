let currentTable = '';
let show = true;
let showQ = true;

async function fetchData() {
    const tableName = document.getElementById('table-select').value;
    currentTable = tableName;
    fetch(`/table/${tableName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableHeader = document.getElementById('table-header');
            const dataBody = document.getElementById('data-body');
            dataBody.innerHTML = '';
            tableHeader.innerHTML = '';
            populateColumnSelect(data);

            if (data.length === 0) {
                dataBody.innerHTML = '<tr><td colspan="100%">No data found</td></tr>';
                return;
            }

            const columns = Object.keys(data[0]);
            columns.forEach(col => {
                const th = document.createElement('th');
                th.textContent = col;
                tableHeader.appendChild(th);
            });

            data.forEach(item => {
                const row = document.createElement('tr');
                columns.forEach(col => {
                    const td = document.createElement('td');
                    td.textContent = item[col];
                    row.appendChild(td);
                });
                dataBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

function populateColumnSelect(data) {
    const columnSelect = document.getElementById('column-select');
    columnSelect.innerHTML = '';
    if (data.length > 0) {
        const columns = Object.keys(data[0]);
        columns.forEach(col => {
            const option = document.createElement('option');
            option.value = col;
            option.textContent = col;
            columnSelect.appendChild(option);
        });
    }
}

function fetchFilteredData() {
    const tableName = currentTable;
    const columnName = document.getElementById('column-select').value;
    const value = document.getElementById('value-input').value;

    fetch(`/table/${tableName}?column=${columnName}&value=${encodeURIComponent(value)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableHeader = document.getElementById('table-header');
            const dataBody = document.getElementById('data-body');
            dataBody.innerHTML = '';
            tableHeader.innerHTML = '';

            if (data.length === 0) {
                dataBody.innerHTML = '<tr><td colspan="100%">No data found</td></tr>';
            }

            const columns = Object.keys(data[0]);
            columns.forEach(col => {
                const th = document.createElement('th');
                th.textContent = col; 
                tableHeader.appendChild(th);
            });

            data.forEach(item => {
                const row = document.createElement('tr');
                columns.forEach(col => {
                    const td = document.createElement('td');
                    td.textContent = item[col];
                    row.appendChild(td);
                });
                dataBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

function toggleTable() {
    const dataTable = document.getElementById('data-table');
    show = !show;

    if (show) {
        dataTable.style.display = 'table'; 
        document.getElementById('hide-table').textContent = 'Hide Table';
    } else {
        dataTable.style.display = 'none';
        document.getElementById('hide-table').textContent = 'Show Table'; 
    }
}

document.getElementById('table').addEventListener('click', fetchData);

async function quaryQ1() {
    let response = await fetch('/queryQ1');
    let users = await response.json();
    let userList = document.getElementById('list').getElementsByTagName('tbody')[0];
    userList.innerHTML = '<tr><td>month</td> <td>total_bookings</td> </tr>'; 
    users.forEach(user => {
        userList.innerHTML +=                 
            `<tr> 
                <td>${user.month}</td> 
                <td>${user.total_bookings}</td> 
            </tr>`;
    });
}

async function quaryQ2() {
    let response = await fetch('/queryQ2');
    let users = await response.json();
    let userList = document.getElementById('list').getElementsByTagName('tbody')[0];
    userList.innerHTML = '<tr><td>room_type</td> <td>total_bookings</td> </tr>'; 
    users.forEach(user => {
        userList.innerHTML +=                 
            `<tr> 
                <td>${user.room_type}</td> 
                <td>${user.total_bookings}</td> 
            </tr>`;
    });
}

async function quaryQ3() {
    let response = await fetch('/queryQ3');
    let users = await response.json();
    let userList = document.getElementById('list').getElementsByTagName('tbody')[0];
    userList.innerHTML = '<tr><td>age_group</td> <td>customer_count</td> </tr>'; 
    users.forEach(user => {
        userList.innerHTML +=                 
            `<tr> 
                <td>${user.age_group}</td> 
                <td>${user.customer_count}</td> 
            </tr>`;
    });
}

function toggleQ() {
    const dataTable = document.getElementById('list');
    showQ = !showQ;

    if (showQ) {
        dataTable.style.display = 'table'; 
        document.getElementById('hide-Q').textContent = 'Hide Question';
    } else {
        dataTable.style.display = 'none';
        document.getElementById('hide-Q').textContent = 'Show Question'; 
    }
}

document.getElementById('Q1').addEventListener('click', quaryQ1);
document.getElementById('Q2').addEventListener('click', quaryQ2);
document.getElementById('Q3').addEventListener('click', quaryQ3);