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

        delete: function(row) {
            contacts.splice(row,1);
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

    $('#firstname').addEventListener('blur', function() {
        var p1 = $('#alertP1');
        var fn = $('#firstname');
        if (fn.validity.valueMissing){
            p1.innerHTML = '<i class = "err"></i> Your first name should not be empty! ';
        } else if (fn.validity.patternMismatch) {
            p1.innerHTML = '<i class = "err"></i> Your frist name should be characters from a to z! ';
        } else {
            p1.innerHTML = '';
        }
    });

    $('#lastname').addEventListener('blur', function() {
        var p2 = $('#alertP2');
        var ln = $('#lastname');
        if (ln.validity.valueMissing){
            p2.innerHTML = '<i class = "err"></i> Your last name should not be empty! ';
        } else if (ln.validity.patternMismatch) {
            p2.innerHTML = '<i class = "err"></i> Your last name should be characters from a to z! ';
        } else {
            p2.innerHTML = '';
        }
    });

    $('#listView').addEventListener('click', function() {
        return creatTable();
    });

    $('#discard').addEventListener('click', function() {
        $('#inputTable').reset();
    });

    var rowIdx;
    var selectedRow;

    function selectRow(row) {
        if (selectedRow !== undefined) {
            selectedRow.style.background = "#fbfbfb";
        }
        selectedRow = row;
        selectedRow.style.background = "#44dee0";
    }

    function highLight() {
        var rows = $('#tableData').getElementsByTagName("tr");
        for (var i = 0; i < rows.length; i++) {
            (function (idx) {
                rows[idx].addEventListener('click', function() {
                    selectRow(rows[idx]);
                    rowIdx = idx;
                });
            })(i);
        }
    }

    $('#del').addEventListener('click', function() {
        $('#tableData').deleteRow(rowIdx);
        addressBook.delete(rowIdx);
        addressBook.save();
    });

}());