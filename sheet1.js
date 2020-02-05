
        var X = XLSX;

        // ファイル選択時のメイン処理
        function handleFile(e) {
            var files = e.target.files;
            var f = files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                var wb;
                var arr = fixdata(data);

                wb = X.read(btoa(arr), {
                    type: 'base64',
                    cellDates: true,
                });

                var output = "";
                output = to_json(wb);

                //データを取り出す
                makeData(output);
            };
            reader.readAsArrayBuffer(f);
        }

        // ファイルの読み込み
        function fixdata(data) {
            var o = "",
                l = 0,
                w = 10240;
            for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w,
                l * w + w)));
            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
            return o;
        }

        // ワークブックのデータをjsonに変換
        function to_json(workbook) {
            var result = {};

            console.log(result);


            workbook.SheetNames.forEach(function (sheetName) {
                var roa = X.utils.sheet_to_json(
                    workbook.Sheets[sheetName],
                    {
                        raw: true,
                    });
                    
                if (roa.length > 0) {
                    result[sheetName] = roa;
                }
            });
            return result;
        }

        // ここでデータを取り出す  
        function makeData(output){
            var cellData =[];
            for (var item in output) {
                for (var subItem in output[item]) {
                    for (var sub2Item in output[item][subItem]) {
                        cellData.push(output[item][subItem][sub2Item])
                        console.log(output[item][subItem][sub2Item]);
                    }
                }
            }
            
            // ------------------------------------------------------------
            // HTMLTableElement オブジェクトを作成する
            // ------------------------------------------------------------
            var table = document.createElement("table");
            table.align = "center";
            // テーブルの外周線の太さを設定
            table.border = "2";
            // セルの内周余白量を設定
            table.cellPadding = "4";
            // セルの外周余白量を設定
            table.cellSpacing = "2";

            // body のノードリストに登録する
            document.body.appendChild(table);

            var html = "";                
            for(j=0; j<5; j++){
                var str1 = "";
                var str2 = "";
                var str3 = "";
                var str4 = "";

                //余白削除
                str1=cellData[j*4];
                str2=cellData[1+j*4];
                str3=cellData[2+j*4];
                str4=cellData[3+j*4];
                //str1 = tempStr;

                /*
                if(tempStr != undefined){
                    str1 = tempStr.replace(/\s+/g, "");
                }
                */
                //現場名は余白の削除はしない
                //tempStr=cellData[1 + j*2];

                //str2 = tempStr;

                /*
                if(j == 0){
                    str2 = tempStr;
                }else{
                    if(tempStr != undefined){
                        str2 = tempStr.replace(/\s+/g, "");
                    }
                }
                */

                //空白が続けば終了
                if(str1==undefined && str2==undefined){
                    break;
                }

                html += `<tr>`
                html += `<td>${str1}</td>`
                html += `<td>${str2}</td>`
                html += `<td>${str3}</td>`
                html += `<td>${str4}</td>`
                html += `</tr>`
            }

            table.innerHTML = html;
        }

        // 画面初期化
        $(document).ready(function () {

            // ファイル選択欄 選択イベント
            // http://cccabinet.jpn.org/bootstrap4/javascript/forms/file-browser
            $('.custom-file-input').on('change', function (e) {
                handleFile(e);
                $(this).next('.custom-file-label').html($(this)[0].files[0].name);
            })
        });