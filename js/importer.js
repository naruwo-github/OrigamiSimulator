/**
 * Created by amandaghassaei on 5/6/17.
 */


function initImporter(globals){
    var reader = new FileReader();

    function importDemoFile(url){
        var extension = url.split(".");
        var name = extension[extension.length-2].split("/");
        name = name[name.length-1];
        extension = extension[extension.length-1];
        // globals.setCreasePercent(0);
        if (extension == "svg"){
            globals.url = url;
            globals.filename = name;
            globals.extension = extension;
            globals.pattern.loadSVG("assets/" + url);
        } else {
            console.warn("unknown extension: " + extension);
        }
    }

    window.addEventListener('message', function(e) {
        if (!e.data) return;
        if (e.data.op === 'importFold' && e.data.fold) {
            globals.filename = e.data.fold.file_title || 'message';
            globals.extension = 'fold';
            globals.url = null;
            globals.pattern.setFoldData(e.data.fold);
        } else if (e.data.op === 'importSVG' && e.data.svg) {
            globals.filename = e.data.filename || 'message';
            globals.extension = 'svg';
            globals.url = null;
            if (e.data.vertTol) {
                globals.vertTol = e.data.vertTol;
            }
            globals.pattern.loadSVG(URL.createObjectURL(new Blob([e.data.svg])));
        }
    });
    // Tell parent/opening window that we're ready for messages now.
    var readyMessage = {from: 'OrigamiSimulator', status: 'ready'};
    if (window.parent && window.parent !== window) {
        window.parent.postMessage(readyMessage, '*');
    } else if (window.opener) {
        window.opener.postMessage(readyMessage, '*');
    }

    $("#fileSelector").change(function(e) {
        var files = e.target.files; // FileList object
        if (files.length < 1) {
            return;
        }
        var file = files[0];

        //files[0]をグローバル化
        globals.svgFile = files[0];

        var extension = file.name.split(".");
        var name = extension[0];
        extension = extension[extension.length - 1];

        $(e.target).val("");

        if (extension == "svg") {
            reader.onload = function () {
                return function (e) {
                    if (!reader.result) {
                        warnUnableToLoad();
                        return;
                    }
                    $("#vertTol").val(globals.vertTol);
                    $("#importSettingsModal").modal("show");
                    $('#doSVGImport').click(function (e) {
                        e.preventDefault();
                        $('#doSVGImport').unbind("click");
                        globals.filename = name;
                        globals.extension = extension;
                        globals.url = null;
                        globals.pattern.loadSVG(reader.result);
                        //console.log(reader.result);
                    });
                }
            }(file);
            reader.readAsDataURL(file);
        } else if (extension == "fold"){
            reader.onload = function () {
                return function (e) {
                    if (!reader.result) {
                        warnUnableToLoad();
                        return;
                    }
                    globals.filename = name;
                    globals.extension = extension;
                    globals.url = null;

                    try {
                        var fold = JSON.parse(reader.result);
                        if (!fold || !fold.vertices_coords || !fold.edges_assignment || !fold.edges_vertices || !fold.faces_vertices){
                            globals.warn("Invalid FOLD file, must contain all of: <br/>" +
                                "<br/>vertices_coords<br/>edges_vertices<br/>edges_assignment<br/>faces_vertices");
                            return;
                        }

                        // spec 1.0 backwards compatibility
                        if (fold.edges_foldAngles){
                            fold.edges_foldAngle = fold.edges_foldAngles;
                            delete fold.edges_foldAngles;
                        }
                        if (fold.edges_foldAngle){
                            globals.pattern.setFoldData(fold);
                            return;
                        }

                        $("#importFoldModal").modal("show");
                        $('#importFoldModal').on('hidden.bs.modal', function () {
                            $('#importFoldModal').off('hidden.bs.modal');
                            if (globals.foldUseAngles) {//todo this should all go to pattern.js
                                globals.setCreasePercent(1);
                                var foldAngles = [];
                                for (var i=0;i<fold.edges_assignment.length;i++){
                                    var assignment = fold.edges_assignment[i];
                                    if (assignment == "F") foldAngles.push(0);
                                    else foldAngles.push(null);
                                }
                                fold.edges_foldAngles = foldAngles;

                                var allCreaseParams = globals.pattern.setFoldData(fold, true);
                                var j = 0;
                                var faces = globals.pattern.getTriangulatedFaces();
                                for (var i=0;i<fold.edges_assignment.length;i++){
                                    var assignment = fold.edges_assignment[i];
                                    if (assignment !== "M" && assignment !== "V" && assignment !== "F") continue;
                                    var creaseParams = allCreaseParams[j];
                                    var face1 = faces[creaseParams[0]];
                                    var vec1 = makeVector(fold.vertices_coords[face1[1]]).sub(makeVector(fold.vertices_coords[face1[0]]));
                                    var vec2 = makeVector(fold.vertices_coords[face1[2]]).sub(makeVector(fold.vertices_coords[face1[0]]));
                                    var normal1 = (vec2.cross(vec1)).normalize();
                                    var face2 = faces[creaseParams[2]];
                                    vec1 = makeVector(fold.vertices_coords[face2[1]]).sub(makeVector(fold.vertices_coords[face2[0]]));
                                    vec2 = makeVector(fold.vertices_coords[face2[2]]).sub(makeVector(fold.vertices_coords[face2[0]]));
                                    var normal2 = (vec2.cross(vec1)).normalize();
                                    var angle = Math.abs(normal1.angleTo(normal2));
                                    if (assignment == "M") angle *= -1;
                                    fold.edges_foldAngle[i] = angle * 180 / Math.PI;
                                    creaseParams[5] = angle;
                                    j++;
                                }
                                globals.model.buildModel(fold, allCreaseParams);
                                return;
                            }
                            var foldAngles = [];
                            for (var i=0;i<fold.edges_assignment.length;i++){
                                var assignment = fold.edges_assignment[i];
                                if (assignment == "M") foldAngles.push(-180);
                                else if (assignment == "V") foldAngles.push(180);
                                else if (assignment == "F") foldAngles.push(0);
                                else foldAngles.push(null);
                            }
                            fold.edges_foldAngle = foldAngles;
                            globals.pattern.setFoldData(fold);
                        });
                    } catch(err) {
                        globals.warn("Unable to parse FOLD json.");
                        console.log(err);
                    }
                }
            }(file);
            reader.readAsText(file);
        } else {
            globals.warn('Unknown file extension: .' + extension);
            return null;
        }

    });

    //------------------------------------------------------
    //読み込む関数を作ろう
    //ファイルを入力にとって、シミュレーションを開始する
    //function simulateAgain(svgFile,cooX,cooY) {
    function simulateAgain(svgFile, outputList, gridList) {
        var file = svgFile;
        var extension = file.name.split(".");
        var name = extension[0];
        extension = extension[extension.length - 1];

        //$(e.target).val("");

        if (extension == "svg") {
            reader.onload = function () {
                $("#vertTol").val(globals.vertTol);
                $("#importSettingsModal").modal("show");
                $('#doSVGImport').click(function (e) {
                    e.preventDefault();
                    $('#doSVGImport').unbind("click");
                    globals.filename = name;
                    globals.extension = extension;
                    globals.url = null;
                    //globals.pattern.loadSVGAgain(reader.result,cooX,cooY);
                    console.log(reader.result);
                    globals.timeOfInputFixedSvg = performance.now(); // 入力開始の時間
                    globals.pattern.loadSVGAgain(reader.result, outputList, gridList);
                });
                /*
                return function (e) {
                    if (!reader.result) {
                        warnUnableToLoad();
                        return;
                    }
                    $("#vertTol").val(globals.vertTol);
                    $("#importSettingsModal").modal("show");
                    $('#doSVGImport').click(function (e) {
                        e.preventDefault();
                        $('#doSVGImport').unbind("click");
                        globals.filename = name;
                        globals.extension = extension;
                        globals.url = null;
                        globals.pattern.loadSVG(reader.result);
                        //console.log(reader.result);
                    });
                }
                */
            }(file);
            reader.readAsDataURL(file);
        }else {
            globals.warn('Unknown file extension: .' + extension);
            return null;
        }
    }
    //------------------------------------------------------

    function makeVector(v){
        if (v.length == 2) return makeVector2(v);
        return makeVector3(v);
    }
    function makeVector2(v){
        return new THREE.Vector2(v[0], v[1]);
    }
    function makeVector3(v){
        return new THREE.Vector3(v[0], v[1], v[2]);
    }

    function warnUnableToLoad(){
        globals.warn("Unable to load file.");
    }

    return {
        importDemoFile: importDemoFile,
        simulateAgain: simulateAgain
    }
}