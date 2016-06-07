/**
 * Created by Gracia on 16/4/18.
 */


//add contact

var contact = [];

function newContact() {
    var newContact = {};
    newContact.firstname = document.getElementById('firstname').value;
    newContact.lastname = document.getElementById('lastname').value;
    newContact.telephone = document.getElementById('telephone').value;
    return newContact;
}

function addContact() {
    if (localStorage.getItem('info') !== null ) {
        contact = JSON.parse(localStorage.getItem('info'));
    }
    contact.push(newContact());
    localStorage.setItem('info',JSON.stringify(contact));
    alert('Your information has been added.');
}

var id = document.getElementById('add');
addEvent(id,'click',addContact);


//discard input
var dis = document.getElementById('discard');
function discardContact() {
    document.getElementById('inputTable').reset();
}
addEvent(dis,'click',discardContact);


//check list
var list = document.getElementById('listView');
addEvent(list,'click',creatTable);


//sort

var list = JSON.parse(localStorage.getItem('info'));

function dynamicSort(property, asc) {
    if (asc) {
        return function (a, b) {
            var A = a[property].toUpperCase();
            var B = b[property].toUpperCase();
            return (A > B) ? 1 : (A < B) ? -1 : 0;
        }
    }
    return function (a, b) {
        var A = a[property].toUpperCase();
        var B = b[property].toUpperCase();
        return (A < B) ? 1 : (A > B) ? -1 : 0;
    }
}

function sortFirstAsc() {
    list.sort(dynamicSort('firstname',true));
    localStorage.setItem('info',JSON.stringify(list));
    creatTable();
}

function sortLastAsc() {
    list.sort(dynamicSort('lastname',true));
    localStorage.setItem('info',JSON.stringify(list));
    creatTable();
}

function sortNumber() {
    list.sort(function(a,b){
        return a.telephone - b.telephone;
    });
    localStorage.setItem('info',JSON.stringify(list));
    creatTable();
}

var sf = document.getElementById('sortFirstName');
addEvent(sf,'click',sortFirstAsc);
var sl = document.getElementById('sortLastName');
addEvent(sl,'click',sortLastAsc);
var st = document.getElementById('sortTel');
addEvent(st,'click',sortNumber);


//creat table

function creatTable() {
    var myTB = document.getElementById('tableData');
    function newTable() {
        var dataTB = JSON.parse(localStorage.getItem('info'));
        for (var i = 0; i < dataTB.length; i++) {
            var newRow = document.createElement('tr');
            var obj = dataTB[i];
            for (var x in obj) {
                var newCell = document.createElement('td');
                var newText = document.createTextNode(obj[x]);
                newCell.appendChild(newText);
                newRow.appendChild(newCell);
            }
            document.getElementById('tableData').appendChild(newRow);
        }
        highLight();
    }
    if (myTB.rows.length === 0) {
        return newTable();
    } else {
        myTB.innerHTML = '';
        return newTable();
     }
}

//highlight rows

var rowIdx;

function highLight() {
    var table = document.getElementById("tableData");
    var rows = table.getElementsByTagName("tr");
    var selectedRow;

    function SelectRow(row) {
        if (selectedRow !== undefined) {
            selectedRow.style.background = "#fbfbfb";
        }
        selectedRow = row;
        selectedRow.style.background = "#44dee0";
    }

    for (var i = 0; i < rows.length; i++) {
        (function (idx) {
            addEvent(rows[idx], "click", function() {
                SelectRow(rows[idx]);
                rowIdx = idx;
            });
        })(i);
    }
}

//delete row

var del = document.getElementById('del');
addEvent(del,'click',delRow);

function delRow() {
    var table = document.getElementById("tableData");
    table.deleteRow(rowIdx);
    list.splice(rowIdx,1);
    localStorage.setItem('info',JSON.stringify(list));
}

//event control

function addEvent(element, evt, callback) {
    if (element.addEventListener) {
        element.addEventListener(evt, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + evt, callback);
    } else {
        element["on" + evt] = callback;
    }
}
