$(document).ready(function () {
    $('#fileInput').change(function (event) {
        let file = event.target.files[0];
        if (!file) return;

        let reader = new FileReader();
        reader.onload = function (e) {
            let data = new Uint8Array(e.target.result);
            let workbook = XLSX.read(data, { type: 'array' });

            // 第一個工作表
            let sheetName = workbook.SheetNames[0];
            let sheet = workbook.Sheets[sheetName];

            // 轉換為 JSON 陣列
            let jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            console.log(jsonData);
            // 顯示表格
            displayTable(jsonData);
        };
        reader.readAsArrayBuffer(file);
    });

    function displayTable(data) {
        if (data.length === 0) return;

        let tableHead = $('#tableHead');
        let tableBody = $('#tableBody');
        tableHead.empty();
        tableBody.empty();

        // 表頭
        let headerRow = $('<tr></tr>');
        data[0].forEach(col => {
            headerRow.append(`<th>${col}</th>`);
        });
        tableHead.append(headerRow);

        // 內容
        for (let i = 1; i < data.length; i++) {
            let row = $('<tr></tr>');
            for (let j = 0; j < data[0].length; j++) {
                let cell = data[i][j];
                row.append(`<td>${cell !== undefined && cell !== null && cell !== '' ? cell : ''}</td>`);
            }
            tableBody.append(row);
        }

        // 顯示表格到HTML
        $('#tableContainer').show();
    }

    // 清除按鈕
    $('#clearButton').click(function () {
        $('#fileInput').val('');
        $('#tableContainer').Clear();
    });
});
