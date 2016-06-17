/**
 * Created by Gracia on 16/4/18.
 */

// common lib
var $ = function(id) {
    return document.getElementById(id.substr(1));
};

function LocalStorageStore() { }

LocalStorageStore.prototype.load = function() {
    return localStorage.getItem('info');
};

LocalStorageStore.prototype.save = function(data) {
    return localStorage.setItem('info',data);
};


//discard input
var dis = document.getElementById('discard');
function discardContact() {
    document.getElementById('inputTable').reset();
}
addEvent(dis,'click',discardContact);


var list = JSON.parse(localStorage.getItem('info'));


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


//form validation

var fn = document.getElementById('firstname');
var ln = document.getElementById('lastname');

function fnameVali() {
    var p1 = document.getElementById('alertP1');
    if (fn.validity.valueMissing){
        p1.innerHTML = '<i class = "err"></i> Your first name should not be empty! ';
    } else if (fn.validity.patternMismatch) {
        p1.innerHTML = '<i class = "err"></i> Your frist name should be characters from a to z! ';
    } else {
        p1.innerHTML = '';
    }
}

function lnameVali() {
    var p2 = document.getElementById('alertP2');
    if (fn.validity.valueMissing){
        p2.innerHTML = '<i class = "err"></i> Your last name should not be empty! ';
    } else if (fn.validity.patternMismatch) {
        p2.innerHTML = '<i class = "err"></i> Your last name should be characters from a to z! ';
    } else {
        p2.innerHTML = '';
    }
}

addEvent(fn,'blur',fnameVali);
addEvent(ln,'blur',lnameVali);


// model
var addressBook = (function(){
    var storage = new LocalStorageStore(),
        contacts = [];

    return {
        load: function() {
            contacts = JSON.parse(storage.load());
            return contacts;
        },

        save: function() {
            return storage.save(JSON.stringify(contacts));
        },

        add: function(contact) {
            contacts.push(contact);
        },
        dynamicSort: function(property, asc) {
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
        },

        sortNum: function (property, asc) {
            if (asc) {
                return function (a, b) {
                    return a[property] > b[property] ? 1 : -1;
                }
            }
            return function (a, b) {
                return a[property] < b[property] ? 1 : -1;
            }
        }


    };

}());



// controller
(function(){
    function creatTable() {
        var myTB = $('#tableData');
        function newTable() {
            var dataTB = addressBook.load();
            for (var i = 0; i < dataTB.length; i++) {
                var newRow = document.createElement('tr');
                var obj = dataTB[i];
                for (var x in obj) {
                    var newCell = document.createElement('td');
                    var newText = document.createTextNode(obj[x]);
                    newCell.appendChild(newText);
                    newRow.appendChild(newCell);
                }
                $('#tableData').appendChild(newRow);
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

    $('#add').addEventListener('click', function() {
        var contact = {
            firstName: $('#firstname').value,
            lastName: $('#lastname').value,
            telephone: $('#telephone').value
        };
        addressBook.load();
        addressBook.add(contact);
        addressBook.save();
        alert('Your information has been added.');
    });

    $('#theadFN').addEventListener('click',function(){
        var lc = $('#theadFN').lastChild;
        var x = lc.classList.contains('sort') || lc.classList.contains('desc');
        $('#theadLN').lastChild.className = 'sort';
        $('#theadTel').lastChild.className = 'sort';
        if (x) {
            addressBook.load().sort(addressBook.dynamicSort('firstname',true));
            addressBook.save();
            creatTable();
            lc.className = 'asc';
        } else {
            addressBook.load().sort(addressBook.dynamicSort('firstname',false));
            addressBook.save();
            creatTable();
            lc.className = 'desc';
        }
    });

    $('#theadLN').addEventListener('click',function(){
        var lc = $('#theadLN').lastChild;
        var x = lc.classList.contains('sort') || lc.classList.contains('desc');
        $('#theadFN').lastChild.className = 'sort';
        $('#theadTel').lastChild.className = 'sort';
        if (x) {
            addressBook.load().sort(addressBook.dynamicSort('lastname',true));
            addressBook.save();
            creatTable();
            lc.className = 'asc';
        } else {
            addressBook.load().sort(addressBook.dynamicSort('lastname',false));
            addressBook.save();
            creatTable();
            lc.className = 'desc';
        }
    });

    $('#theadTel').addEventListener('click',function(){
        var lc = $('#theadTel').lastChild;
        var x = lc.classList.contains('sort') || lc.classList.contains('desc');
        $('#theadLN').lastChild.className = 'sort';
        $('#theadFN').lastChild.className = 'sort';
        if (x) {
            addressBook.load().sort(addressBook.sortNum('telephone',true));
            addressBook.save();
            creatTable();
            lc.className = 'asc';
        } else {
            addressBook.load().sort(addressBook.sortNum('telephone',false));
            addressBook.save();
            creatTable();
            lc.className = 'desc';
        }
    });

    $('#listView').addEventListener('click', function() {
        return creatTable();
    });

}());