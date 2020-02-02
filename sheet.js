
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

                /////////////////////////////////   ここでデータを取り出す   ////////////////////////////////////////
                /*
                for (var item in output) {
                    console.log("output:",output,"    item: ",item)
                    for (var subItem in output[item]) {
                        console.log("output[item]:",output[item],"    subItem:",subItem)
                        if (typeof output[item][subItem] === 'object') {
                            for (var sub2Item in output[item][subItem]) {
                                console.log(item + ': ' + subItem + ': ' + sub2Item
                                    + ': ' + output[item][subItem][sub2Item])
                            }
                        }
                        else {
                            console.log(item + ': ' + subItem + ': ' + output[item][subItem])
                        }
                    }
                }
                */

                //sheet配列にデータを格納する。　注意！！(Excelのタグ1のみ)//
                var sheet = new Array(10);
                for(let y=0; y<10; y++) {
                    sheet[y] = new Array(10).fill(0);
                }
                for(j=0; j<8; j++){
                    for(i=0; i<10; i++){
                        if(output[1][j][i] != undefined){
                            sheet[j][i] = output[1][j][i];
                        }
                    }
                }


                // ------------------------------------------------------------
                // HTMLTableElement オブジェクトを作成する
                // ------------------------------------------------------------
                var table = document.createElement("table");

                // BODY のノードリストに登録する
                document.body.appendChild(table);

                // ------------------------------------------------------------
                // テーブルを構築する
                // ------------------------------------------------------------

                // 行、列、セル代入を追加
                var tr=[];
                var td=[];
                for(i=0;i<5;i++){
                    tr[i] = table.insertRow(-1);
                    for(j=0;j<5;j++){
                        td[i * 5 + j] = tr[i].insertCell(-1);
                        td[i * 5 + j].align = "right";
                        td[i * 5 + j].innerHTML = sheet[i][j + 1];
                    }
                }

   
                // ------------------------------------------------------------
                // テーブルの設定
                // ------------------------------------------------------------
                // テーブルの幅を設定
                table.width = "400";

                // 背景カラーを設定
                table.bgColor = "#eee";

                // テーブルの外周線の太さを設定
                table.border = "2";

                // テーブルの外周線のルールを設定
                table.frame = "box";

                // テーブル内の線ルールを設定
                table.rules = "all";

                // セルの内周余白量を設定
                table.cellPadding = "4";

                // セルの外周余白量を設定
                table.cellSpacing = "0";

                // 概要を設定
                table.summary = "";

                table.align = "center";


                ///////////////////////////////////////////////////////////////////////////////////////////////////

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

        // 画面初期化
        $(document).ready(function () {

            // ファイル選択欄 選択イベント
            // http://cccabinet.jpn.org/bootstrap4/javascript/forms/file-browser
            $('.custom-file-input').on('change', function (e) {
                handleFile(e);
                $(this).next('.custom-file-label').html($(this)[0].files[0].name);
            })
        });
