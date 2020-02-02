document.getElementById('table').addEventListener('click', function () {
  var wopts = {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  };

  var workbook = {SheetNames: [], Sheets: {}};

  document.querySelectorAll('table.table-to-export').forEach(function (currentValue, index) {
    // sheet_to_workbook()の実装を参考に記述
    var n = currentValue.getAttribute('data-sheet-name');
    if (!n) {
      n = 'Sheet' + index;
    }
    workbook.SheetNames.push(n);
    workbook.Sheets[n] = XLSX.utils.table_to_sheet(currentValue, wopts);
  });

  var wbout = XLSX.write(workbook, wopts);

  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }

  saveAs(new Blob([s2ab(wbout)], {type: 'application/octet-stream'}), 'test.xlsx');
}, false);