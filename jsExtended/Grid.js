/*
* Created by narumi nogawa on 1/21/20.
*/

function initGrids(globals) {
    //格子を描画する
    function drawGrid(mode, gridnumber, list, ctx, color, array) {
        const lines = gridnumber;
        for (let i = 0; i < array.length; i+=4) {
            const element0 = array[i];
            const element1 = array[i+1];
            const element2 = array[i+2];
            const element3 = array[i+3];
            const vectorP0 = new THREE.Vector2(element0[0], element0[1]);
            const vectorP1 = new THREE.Vector2(element1[0], element1[1]);
            const vectorP2 = new THREE.Vector2(element2[0], element2[1]);
            const vectorP3 = new THREE.Vector2(element3[0], element3[1]);
            const vectorP0P1 = new THREE.Vector2(vectorP1.x-vectorP0.x, vectorP1.y-vectorP0.y);
            const vectorP1P2 = new THREE.Vector2(vectorP2.x-vectorP1.x, vectorP2.y-vectorP1.y);
            const vectorP2P3 = new THREE.Vector2(vectorP3.x-vectorP2.x, vectorP3.y-vectorP2.y);
            const vectorP3P0 = new THREE.Vector2(vectorP0.x-vectorP3.x, vectorP0.y-vectorP3.y);
            vectorP0P1.divideScalar(lines);
            vectorP1P2.divideScalar(lines);
            vectorP2P3.divideScalar(lines);
            vectorP3P0.divideScalar(lines);

            if (mode == 0) {
                //正方グリッド
                for (let i = 1; i < lines; i++) {
                    //縦方向
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    //横方向
                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 1) {
                //直線×斜め１
                for (let i = 1; i < lines; i++) {
                    //横方向
                    let start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P1P3
                list.push([[vectorP1.x, vectorP1.y], [vectorP3.x, vectorP3.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 2) {
                //直線×斜め２
                for (let i = 1; i < lines; i++) {
                    //横方向
                    let start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P0P2
                list.push([[vectorP0.x, vectorP0.y], [vectorP2.x, vectorP2.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*(lines-i), vectorP0.y+vectorP0P1.y*(lines-i)];
                    let end = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    end = [vectorP2.x+vectorP2P3.x*i, vectorP2.y+vectorP2P3.y*i];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 3) {
                //斜め１×直線
                for (let i = 1; i < lines; i++) {
                    //縦方向
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P1P3
                list.push([[vectorP1.x, vectorP1.y], [vectorP3.x, vectorP3.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 4) {
                //斜め２×直線
                for (let i = 1; i < lines; i++) {
                    //縦方向
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P0P2
                list.push([[vectorP0.x, vectorP0.y], [vectorP2.x, vectorP2.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*(lines-i), vectorP0.y+vectorP0P1.y*(lines-i)];
                    let end = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    end = [vectorP2.x+vectorP2P3.x*i, vectorP2.y+vectorP2P3.y*i];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 5) {
                //斜め１×斜め２
                //中央の斜線P1P3
                list.push([[vectorP1.x, vectorP1.y], [vectorP3.x, vectorP3.y], color]);
                //中央の斜線P0P2
                list.push([[vectorP0.x, vectorP0.y], [vectorP2.x, vectorP2.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP0.x+vectorP0P1.x*(lines-i), vectorP0.y+vectorP0P1.y*(lines-i)];
                    end = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    end = [vectorP2.x+vectorP2P3.x*i, vectorP2.y+vectorP2P3.y*i];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 6) {
                //正方格子+斜め１
                for (let i = 1; i < lines; i++) {
                    //縦方向
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    //横方向
                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P1P3
                list.push([[vectorP1.x, vectorP1.y], [vectorP3.x, vectorP3.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 7) {
                //正方格子+斜め２
                for (let i = 1; i < lines; i++) {
                    //縦方向
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    //横方向
                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P0P2
                list.push([[vectorP0.x, vectorP0.y], [vectorP2.x, vectorP2.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*(lines-i), vectorP0.y+vectorP0P1.y*(lines-i)];
                    let end = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    end = [vectorP2.x+vectorP2P3.x*i, vectorP2.y+vectorP2P3.y*i];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 8) {
                //正方格子+斜め１×斜め２
                for (let i = 1; i < lines; i++) {
                    //縦方向
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    //横方向
                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P1P3
                list.push([[vectorP1.x, vectorP1.y], [vectorP3.x, vectorP3.y], color]);
                //中央の斜線P0P2
                list.push([[vectorP0.x, vectorP0.y], [vectorP2.x, vectorP2.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP0.x+vectorP0P1.x*(lines-i), vectorP0.y+vectorP0P1.y*(lines-i)];
                    end = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    end = [vectorP2.x+vectorP2P3.x*i, vectorP2.y+vectorP2P3.y*i];
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            }
        }

        //格子を回転させ描画する処理(とりあえず実装完了するまで0がデフォ)
        rotationalMovement(ctx, list, array, 0);
    }



    //角度を持った格子を描画する関数
    function drawGridWithAngle(gridnumber, outputList, ctx, lineColor, outlinePoints, angle) {
        //格子数がgridnumber
        //格子数Nに対し、N+1、2N+1、4N+2、5N+2を弾く
        const lines = gridnumber;
        var grids = new Array();
        for (let i = 0; i < outlinePoints.length; i+=4) {
            //輪郭を構成する頂点群(4つと決め打ち)
            const element0 = outlinePoints[0];
            const element1 = outlinePoints[1];
            const element2 = outlinePoints[2];
            const element3 = outlinePoints[3];
            const vectorP0 = new THREE.Vector2(element0[0], element0[1]);
            const vectorP1 = new THREE.Vector2(element1[0], element1[1]);
            const vectorP2 = new THREE.Vector2(element2[0], element2[1]);
            const vectorP3 = new THREE.Vector2(element3[0], element3[1]);
            const vectorP0P1 = new THREE.Vector2(vectorP1.x-vectorP0.x, vectorP1.y-vectorP0.y);
            const vectorP1P2 = new THREE.Vector2(vectorP2.x-vectorP1.x, vectorP2.y-vectorP1.y);
            const vectorP2P3 = new THREE.Vector2(vectorP3.x-vectorP2.x, vectorP3.y-vectorP2.y);
            const vectorP3P0 = new THREE.Vector2(vectorP0.x-vectorP3.x, vectorP0.y-vectorP3.y);
            vectorP0P1.divideScalar(lines);
            vectorP1P2.divideScalar(lines);
            vectorP2P3.divideScalar(lines);
            vectorP3P0.divideScalar(lines);
            //格子角度調整用に拡大した輪郭の頂点ベクトル
            const vectorP0Dash = new THREE.Vector2(2 * vectorP0.x - vectorP1.x, 2 * vectorP0.y - vectorP3.y);
            const vectorP1Dash = new THREE.Vector2(2 * vectorP1.x - vectorP0.x, 2 * vectorP1.y - vectorP2.y);
            const vectorP3Dash = new THREE.Vector2(2 * vectorP3.x - vectorP2.x, 2 * vectorP3.y - vectorP0.y);
            //線は縦横それぞれ 格子数×3+1本 描画する
            for (let i = 0; i < lines * 3 + 1; i++) {
                //gridsのなかに[[x0, y0], [x1, y1], color]の形式で格納
                //上から下の線
                grids.push([[vectorP0Dash.x + vectorP0P1.x * i, vectorP0Dash.y + vectorP0P1.y * i], 
                    [vectorP3Dash.x - vectorP2P3.x * i, vectorP3Dash.y - vectorP2P3.y * i], lineColor]);
                //左から右の線
                grids.push([[vectorP0Dash.x - vectorP3P0.x * i, vectorP0Dash.y - vectorP3P0.y * i], 
                    [vectorP1Dash.x + vectorP1P2.x * i, vectorP1Dash.y + vectorP1P2.y * i], lineColor]);
            }

            //grids内の座標をangleだけ回転移動
            rotationalMovement(ctx, grids, outlinePoints, angle);

            var handleGrids = new Array();
            //grids内にある線を用いて交差判定
            for (let i = 0; i < grids.length; i++) {
                handleGrids = new Array();
                //弾く格子ライン
                if (i !== 2 * gridnumber && i !== 2 * gridnumber + 1 && i !== 4 * gridnumber && i !== 4 * gridnumber +1 || angle%90 !== 0) {
                        let tmp = grids[i];
                        let start = tmp[0];
                        let end = tmp[1];

                        //ここから輪郭(P0~P3)と交差判定を行う
                        //線分P0P1との交差判定
                        if (globals.beziercurve.judgeIntersect2(element0[0], element0[1], element1[0], element1[1], start[0], start[1], end[0], end[1])) {
                            let intersectedPoint = globals.beziercurve.getIntersectPoint(element0[0], element0[1], start[0], start[1], element1[0], element1[1], end[0], end[1]);
                            handleGrids.push([intersectedPoint[0], intersectedPoint[1]]);
                        }
                        //線分P1P2との交差判定
                        if (globals.beziercurve.judgeIntersect2(element1[0], element1[1], element2[0], element2[1], start[0], start[1], end[0], end[1])) {
                            let intersectedPoint = globals.beziercurve.getIntersectPoint(element1[0], element1[1], start[0], start[1], element2[0], element2[1], end[0], end[1]);
                            handleGrids.push([intersectedPoint[0], intersectedPoint[1]]);
                        }
                        //線分P2P3との交差判定
                        if (globals.beziercurve.judgeIntersect2(element2[0], element2[1], element3[0], element3[1], start[0], start[1], end[0], end[1])) {
                            let intersectedPoint = globals.beziercurve.getIntersectPoint(element2[0], element2[1], start[0], start[1], element3[0], element3[1], end[0], end[1]);
                            handleGrids.push([intersectedPoint[0], intersectedPoint[1]]);
                        }
                        //線分P3P0との交差判定
                        if (globals.beziercurve.judgeIntersect2(element3[0], element3[1], element0[0], element0[1], start[0], start[1], end[0], end[1])) {
                            let intersectedPoint = globals.beziercurve.getIntersectPoint(element3[0], element3[1], start[0], start[1], element0[0], element0[1], end[0], end[1]);
                            handleGrids.push([intersectedPoint[0], intersectedPoint[1]]);
                        }
                }
                console.log("handleGrids size = " + handleGrids.length);
                //handlegridsのサイズが2だったら交差した2点を検出できているのでこれを格子の線とする
                if (handleGrids.length === 2) {
                    outputList.push([handleGrids[0], handleGrids[1], lineColor]);
                    globals.drawapp.drawLine(ctx, lineColor, 2, handleGrids[0][0], handleGrids[0][1], handleGrids[1][0], handleGrids[1][1]);
                }
            }
        }
    }



    //listに格納されている直線群のそれぞれに対し、
    //outlineを中心としてangleだけ回転させたものをlist内に返し描画する
    function rotationalMovement(ctx, list, outline, angle) {
        let center = [0, 0];
        for (let i = 0; i < outline.length; i++) {
            center[0] += outline[i][0];
            center[1] += outline[i][1];
        }
        center[0] /= outline.length;
        center[1] /= outline.length;
        ctx.fillRect(center[0]-5, center[1]-5, 11, 11);
        for (let i = 0; i < list.length; i++) {
            list[i][0] = coordinateTransformation(list[i][0][0], list[i][0][1], center[0], center[1], angle);
            list[i][1] = coordinateTransformation(list[i][1][0], list[i][1][1], center[0], center[1], angle);
        }
    }



    //(x, y)を(ox, oy)を中心としてangleだけ回転移動した座標を返す関数
    function coordinateTransformation(x, y, ox, oy, angle) {
        x -= ox;
        y -= oy;
        return [x * Math.cos(angle / 180 * Math.PI) - y * Math.sin(angle / 180 * Math.PI) + ox, 
            x * Math.sin(angle / 180 * Math.PI) + y * Math.cos(angle / 180 * Math.PI) + oy];
    }







    //=============================================
    //四分木の構造体
    class q_tree {
        constructor(selfIndex, parentIndex, height, coordinates) {
            this.selfIndex = selfIndex;
            this.parentIndex = parentIndex;
            this.height = height;
            this.coordinates = coordinates;
            this.center = [(coordinates[0] + coordinates[2] + coordinates[4] + coordinates[6]) / 4, (coordinates[1] + coordinates[3] + coordinates[5] + coordinates[7]) / 4];
            //parentとchild0~3を持たせる
            this.child0;
            this.child1;
            this.child2;
            this.child3;
        }
    }


    //四分木構造を構築するメソッド
    function makeQTree(source) {
        let points = source.points;
        let x0 = points[0][0];
        let y0 = points[0][1];
        let x1 = points[1][0];
        let y1 = points[1][1];
        let x2 = points[2][0];
        let y2 = points[2][1];
        let x3 = points[3][0];
        let y3 = points[3][1];
        source.structure = new q_tree(0, NaN, 0, [x0, y0, x1, y1, x2, y2, x3, y3]);

        if (points.length >= 4) {
            for (let i = 4; i < points.length; i++) {
                //ここに再起で四分木を構築するようにしたい
                if (i === 4) {
                    let parent = source.structure;
                    //x: 0 2 4 6
                    //y: 1 3 5 7

                    //初めての分割
                    //子1
                    source.structure.child0 = new q_tree(1, parent.selfIndex, source.structure.height + 1, [x0, (y0+y3)/2, (x0+x1)/2, (y0+y3)/2, (x3+x2)/2, y3, x3, y3]);
                    //子2
                    source.structure.child1 = new q_tree(2, parent.selfIndex, source.structure.height + 1, [(x0+x1)/2, (y0+y3)/2, x1, (y1+y2)/2, x2, y2, (x3+x2)/2, y3]);
                    //子3
                    source.structure.child2 = new q_tree(3, parent.selfIndex, source.structure.height + 1, [x0, y0, (x0+x1)/2, y0, (x0+x1)/2, (y0+y3)/2, x0, (y0+y3)/2]);
                    //子4
                    source.structure.child3 = new q_tree(4, parent.selfIndex, source.structure.height + 1, [(x0+x1)/2, y0, x1, y1, x1, (y1+y2)/2, (x0+x1)/2, (y0+y3)/2]);

                } else {
                    //初期分割以降
                    //クリックした点の位置を取得
                    let point = points[i];
                    divideAimTree(source.structure, point);
                    //divideQTree(endQTree);
                }
            }
        }
    }


    //分割する木を探索し、分割するメソッド
    function divideAimTree(tree, point) {
        if (tree.child0 === undefined) {
            divideQTree(tree);
            return;
        }
        //4つのcenterで一番近いところにすすむ
        let center0 = tree.child0.center;
        let center1 = tree.child1.center;
        let center2 = tree.child2.center;
        let center3 = tree.child3.center;
        //pointとcenterX間の距離
        let dist0 = dist(point[0], point[1], center0[0], center0[1]);
        let dist1 = dist(point[0], point[1], center1[0], center1[1]);
        let dist2 = dist(point[0], point[1], center2[0], center2[1]);
        let dist3 = dist(point[0], point[1], center3[0], center3[1]);

        if (Math.min(dist0, dist1, dist2, dist3) === dist0) {
            divideAimTree(tree.child0, point);
        } else if (Math.min(dist0, dist1, dist2, dist3) === dist1) {
            divideAimTree(tree.child1, point);
        } else if (Math.min(dist0, dist1, dist2, dist3) === dist2) {
            divideAimTree(tree.child2, point);
        } else if (Math.min(dist0, dist1, dist2, dist3) === dist3) {
            divideAimTree(tree.child3, point);
        }
    }


    //木を分割するメソッド
    function divideQTree(tree) {
        //四分木を分割(子1~4をappendする)
        let parentId = tree.selfIndex;
        let x0 = tree.coordinates[0];
        let y0 = tree.coordinates[1];
        let x1 = tree.coordinates[2];
        let y1 = tree.coordinates[3];
        let x2 = tree.coordinates[4];
        let y2 = tree.coordinates[5];
        let x3 = tree.coordinates[6];
        let y3 = tree.coordinates[7];

        //子1(左上)の追加
        tree.child0 = new q_tree(parentId*4+1, parentId, tree.height + 1, [x0, (y0+y3)/2, (x0+x1)/2, (y0+y3)/2, (x3+x2)/2, y3, x3, y3]);
        //子2(右上)の追加
        tree.child1 = new q_tree(parentId*4+2, parentId, tree.height + 1, [(x0+x1)/2, (y0+y3)/2, x1, (y1+y2)/2, x2, y2, (x3+x2)/2, y3]);
        //子3(左下)の追加
        tree.child2 = new q_tree(parentId*4+3, parentId, tree.height + 1, [x0, y0, (x0+x1)/2, y0, (x0+x1)/2, (y0+y3)/2, x0, (y0+y3)/2]);
        //子4(右下)の追加
        tree.child3 = new q_tree(parentId*4+4, parentId, tree.height + 1, [(x0+x1)/2, y0, x1, y1, x1, (y1+y2)/2, (x0+x1)/2, (y0+y3)/2]);
    }


    //木をCanvasに描画するメソッド
    function drawQTree(tree, ctx, gridLineList, lineColor) {
        if (tree === undefined) {
            return;
        }

        let x0 = tree.coordinates[0];
        let y0 = tree.coordinates[1];
        let x1 = tree.coordinates[2];
        let y1 = tree.coordinates[3];
        let x2 = tree.coordinates[4];
        let y2 = tree.coordinates[5];
        let x3 = tree.coordinates[6];
        let y3 = tree.coordinates[7];
        let center = tree.center;

        ctx.fillRect(center[0]-0.5, center[1]-0.5, 2, 2);

        if (tree.selfIndex !== 0) {
            if (tree.selfIndex%4 === 1) {
                //child0の場合
                globals.drawapp.drawLine(ctx, "rgb(255, 0, 0)", 0.8, x0, y0, x1, y1);
                gridLineList.push([[x0, y0], [x1, y1], lineColor]);
            } else if (tree.selfIndex%4 === 2) {
                //chld1の場合
                globals.drawapp.drawLine(ctx, "rgb(255, 0, 0)", 0.8, x3, y3, x0, y0);
                gridLineList.push([[x3, y3], [x0, y0], lineColor]);
            } else if (tree.selfIndex%4 === 3) {
                //child2の場合
                globals.drawapp.drawLine(ctx, "rgb(255, 0, 0)", 0.8, x1, y1, x2, y2);
                gridLineList.push([[x1, y1], [x2, y2], lineColor]);
            } else if (tree.selfIndex%4 === 0) {
                //child3の場合
                globals.drawapp.drawLine(ctx, "rgb(255, 0, 0)", 0.8, x2, y2, x3, y3);
                gridLineList.push([[x2, y2], [x3, y3], lineColor]);
            }
        }

        drawQTree(tree.child0, ctx, gridLineList, lineColor);
        drawQTree(tree.child1, ctx, gridLineList, lineColor);
        drawQTree(tree.child2, ctx, gridLineList, lineColor);
        drawQTree(tree.child3, ctx, gridLineList, lineColor);
        return;
    }


    //木の自動分割
    function autoMesh(tree, hmin, hmax, svgInfo) {
        if (tree === undefined) { return; }

        if (hmin > hmax) {
            console.log("HminとHmaxの値が不適切です。")
            return;
        }

        //ここで木の高さ判定を行う
        if (tree.height >= hmax) { return; }

        if (tree.child0 === undefined) {
            //子がいない場合に分割の処理を行う
            let x0 = tree.coordinates[0];
            let y0 = tree.coordinates[1];
            let x1 = tree.coordinates[2];
            let y1 = tree.coordinates[3];
            let x2 = tree.coordinates[4];
            let y2 = tree.coordinates[5];
            let x3 = tree.coordinates[6];
            let y3 = tree.coordinates[7];
            let flag = false;
            
            //木の高さがHminより低い場合、問答無用で分割する
            if (tree.height < hmin) {
                flag = true;
            } else {
                //木の領域□の中に、折り線(赤や青の線)が含まれていれば分割
                //線分の交差判定を用いるが、端点は含まない方を扱う
                for (let i = 0; i < svgInfo.stroke.length; i++) {
                    if (svgInfo.stroke[i] != "#000") {
                        if(globals.beziercurve.judgeIntersect2(x0, y0, x1, y1, svgInfo.x1[i], svgInfo.y1[i], svgInfo.x2[i], svgInfo.y2[i])){
                            flag = true;
                            break;
                        }
                        if(globals.beziercurve.judgeIntersect2(x1, y1, x2, y2, svgInfo.x1[i], svgInfo.y1[i], svgInfo.x2[i], svgInfo.y2[i])){
                            flag = true;
                            break;
                        }
                        if(globals.beziercurve.judgeIntersect2(x2, y2, x3, y3, svgInfo.x1[i], svgInfo.y1[i], svgInfo.x2[i], svgInfo.y2[i])){
                            flag = true;
                            break;
                        }
                        if(globals.beziercurve.judgeIntersect2(x3, y3, x0, y0, svgInfo.x1[i], svgInfo.y1[i], svgInfo.x2[i], svgInfo.y2[i])){
                            flag = true;
                            break;
                        }
                    }
                }
            }

            if (flag) {
                //分割する！
                divideQTree(tree);
                flag = false;
            }
        } else {
            //子がいる場合
            // autoMesh(tree.child0, hmin, hmax, svgInfo);
            // autoMesh(tree.child1, hmin, hmax, svgInfo);
            // autoMesh(tree.child2, hmin, hmax, svgInfo);
            // autoMesh(tree.child3, hmin, hmax, svgInfo);
        }
        autoMesh(tree.child0, hmin, hmax, svgInfo);
        autoMesh(tree.child1, hmin, hmax, svgInfo);
        autoMesh(tree.child2, hmin, hmax, svgInfo);
        autoMesh(tree.child3, hmin, hmax, svgInfo);
    }

    //=============================================



    

    //2点間の距離を求める
    function dist(x1,y1,x2,y2) {
        return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
    }




    //=============================================
    //正三角形の格子を描画するメソッド
    function regularTrianglation(outlinePoints, triangleEdgeLength, ctx, gridLineList, lineColor) {
        if (outlinePoints.length < 4) {
            return;
        }
        let op = outlinePoints;
        let center = [
            (op[0][0]+op[1][0]+op[2][0]+op[3][0])/4,
            (op[0][1]+op[1][1]+op[2][1]+op[3][1])/4
        ];

        let vecLeftTop = new THREE.Vector2(-1, Math.sqrt(3));
        let vecRightTop = new THREE.Vector2(1, Math.sqrt(3));
        vecLeftTop.normalize();
        vecRightTop.normalize();
        
        let startRight = [center[0] + triangleEdgeLength/2, center[1]];
        let startLeft = [center[0] - triangleEdgeLength/2, center[1]];

        //右側の点
        while (startRight[0] < op[1][0]*20 && startLeft[0] > op[0][0]*(-20)) {
            //描画処理
            // ctx.fillStyle = lineColor;
            // ctx.fillRect(startRight[0]-2, startRight[1]-2, 5, 5);
            // ctx.fillRect(startLeft[0]-2, startLeft[1]-2, 5, 5);

            //ベクトルを使って斜め線の集合を引いていく
            //スタート地点(左左上、左右上、左左下、左右下、右左上、右右上、右左下、右右下)2点ずつ(始点と終点)書いていく
            let leftUpperLeft = new THREE.Vector2(startLeft[0] + vecLeftTop.x*1000, startLeft[1] + vecLeftTop.y*1000);
            let leftLowerRight = new THREE.Vector2(startLeft[0] + -vecLeftTop.x*1000, startLeft[1] + -vecLeftTop.y*1000);

            let leftUpperRight = new THREE.Vector2(startLeft[0] + vecRightTop.x*1000, startLeft[1] + vecRightTop.y*1000);
            let leftLowerLeft = new THREE.Vector2(startLeft[0] + -vecRightTop.x*1000, startLeft[1] + -vecRightTop.y*1000);

            let rightUpperLeft = new THREE.Vector2(startRight[0] + vecLeftTop.x*1000, startRight[1] + vecLeftTop.y*1000);
            let rightLowerRight = new THREE.Vector2(startRight[0] + -vecLeftTop.x*1000, startRight[1] + -vecLeftTop.y*1000);

            let rightUpperRight = new THREE.Vector2(startRight[0] + vecRightTop.x*1000, startRight[1] + vecRightTop.y*1000);
            let rightLowerLeft = new THREE.Vector2(startRight[0] + -vecRightTop.x*1000, startRight[1] + -vecRightTop.y*1000);

            let intersectedPoints = [];
            //(輪郭)との交差判定
            judgeAndGetIntersection(op, leftUpperLeft.x, leftUpperLeft.y, leftLowerRight.x, leftLowerRight.y, intersectedPoints);
            if (intersectedPoints.length === 2) {
                globals.drawapp.drawLine(ctx, lineColor, 1.0, intersectedPoints[0][0], intersectedPoints[0][1], intersectedPoints[1][0], intersectedPoints[1][1]);
                gridLineList.push([[intersectedPoints[0][0], intersectedPoints[0][1]], [intersectedPoints[1][0], intersectedPoints[1][1]], lineColor]);
            }
            intersectedPoints = [];

            judgeAndGetIntersection(op, leftUpperRight.x, leftUpperRight.y, leftLowerLeft.x, leftLowerLeft.y, intersectedPoints);
            if (intersectedPoints.length === 2) {
                globals.drawapp.drawLine(ctx, lineColor, 1.0, intersectedPoints[0][0], intersectedPoints[0][1], intersectedPoints[1][0], intersectedPoints[1][1]);
                gridLineList.push([[intersectedPoints[0][0], intersectedPoints[0][1]], [intersectedPoints[1][0], intersectedPoints[1][1]], lineColor]);
            }
            intersectedPoints = [];

            judgeAndGetIntersection(op, rightUpperLeft.x, rightUpperLeft.y, rightLowerRight.x, rightLowerRight.y, intersectedPoints);
            if (intersectedPoints.length === 2) {
                globals.drawapp.drawLine(ctx, lineColor, 1.0, intersectedPoints[0][0], intersectedPoints[0][1], intersectedPoints[1][0], intersectedPoints[1][1]);
                gridLineList.push([[intersectedPoints[0][0], intersectedPoints[0][1]], [intersectedPoints[1][0], intersectedPoints[1][1]], lineColor]);
            }
            intersectedPoints = [];

            judgeAndGetIntersection(op, rightUpperRight.x, rightUpperRight.y, rightLowerLeft.x, rightLowerLeft.y, intersectedPoints);
            if (intersectedPoints.length === 2) {
                globals.drawapp.drawLine(ctx, lineColor, 1.0, intersectedPoints[0][0], intersectedPoints[0][1], intersectedPoints[1][0], intersectedPoints[1][1]);
                gridLineList.push([[intersectedPoints[0][0], intersectedPoints[0][1]], [intersectedPoints[1][0], intersectedPoints[1][1]], lineColor]);
            }
            intersectedPoints = [];

            //描画処理
            // globals.drawapp.drawLine(ctx, lineColor, 1.0, leftUpperLeft.x, leftUpperLeft.y, leftLowerRight.x, leftLowerRight.y);
            // gridLineList.push([[leftUpperLeft.x, leftUpperLeft.y], [leftLowerRight.x, leftLowerRight.y], lineColor]);
            // globals.drawapp.drawLine(ctx, lineColor, 1.0, leftUpperRight.x, leftUpperRight.y, leftLowerLeft.x, leftLowerLeft.y);
            // gridLineList.push([[leftUpperRight.x, leftUpperRight.y], [leftLowerLeft.x, leftLowerLeft.y], lineColor]);
            // globals.drawapp.drawLine(ctx, lineColor, 1.0, rightUpperLeft.x, rightUpperLeft.y, rightLowerRight.x, rightLowerRight.y);
            // gridLineList.push([[rightUpperLeft.x, rightUpperLeft.y], [rightLowerRight.x, rightLowerRight.y], lineColor]);
            // globals.drawapp.drawLine(ctx, lineColor, 1.0, rightUpperRight.x, rightUpperRight.y, rightLowerLeft.x, rightLowerLeft.y);
            // gridLineList.push([[rightUpperRight.x, rightUpperRight.y], [rightLowerLeft.x, rightLowerLeft.y], lineColor]);

            //更新処理
            startRight[0] += triangleEdgeLength;
            startLeft[0] -= triangleEdgeLength;
        }
        //上下の点
        //真ん中の横線引いちゃう
        globals.drawapp.drawLine(ctx, lineColor, 1.0, op[0][0], startLeft[1], op[1][0], startLeft[1]);
        gridLineList.push([[op[0][0], startRight[1]], [op[1][0], startRight[1]], lineColor]);
        startRight[1] += triangleEdgeLength*Math.sqrt(3)/2;
        startLeft[1] -= triangleEdgeLength*Math.sqrt(3)/2;
        while (startRight[1] < op[2][1] && startLeft[1] > op[0][1]) {
            //描画処理
            globals.drawapp.drawLine(ctx, lineColor, 0.8, op[0][0], startRight[1], op[1][0], startRight[1]);
            globals.drawapp.drawLine(ctx, lineColor, 0.8, op[0][0], startLeft[1], op[1][0], startLeft[1]);
            gridLineList.push([[op[0][0], startRight[1]], [op[1][0], startRight[1]], lineColor]);
            gridLineList.push([[op[0][0], startLeft[1]], [op[1][0], startLeft[1]], lineColor]);

            //更新処理
            startRight[1] += triangleEdgeLength*Math.sqrt(3)/2;
            startLeft[1] -= triangleEdgeLength*Math.sqrt(3)/2;
        }
    }
    //=============================================




    //=============================================

    //細分割可能な正三角メッシュ構造
    class dividableRegularTriangle {
        constructor(childID, height, coordinates) {
            this.childID = childID;
            this.height = height;
            //正三角形を構成する座標
            //上の頂点から時計回りにP0,P1,P2で、coordinates = [P0x,P0y, P1x,P1y, P2x,P2y]とする
            this.coordinates = coordinates;
            this.center = [(coordinates[0] + coordinates[2] + coordinates[4])/3, 
            (coordinates[1] + coordinates[3] + coordinates[5])/3];
            //正三角形を構成する正三角形×４個（分割先）
            //中心の上の三角形から時計回りに0, 1, 2とし、真ん中にできる正三角形は3とする
            this.child0;
            this.child1;
            this.child2;
            //分割した三角形を描画する際は、Child3の輪郭を描画すればいいことになる
            this.child3;
        }
    }


    //正六角形構造
    class parentHexagon {
        constructor(outlinePoints) {
            this.height = 0;
            this.center = [(outlinePoints[0][0] + outlinePoints[1][0] + outlinePoints[2][0] + outlinePoints[3][0])/4, 
            (outlinePoints[0][1] + outlinePoints[1][1] + outlinePoints[2][1] + outlinePoints[3][1])/4];

            //正六角形（正三角形）の辺の長さを決める
            let outlineWidth = Math.abs(outlinePoints[1][0] - outlinePoints[0][0]);
            let outlineHeight = Math.abs(outlinePoints[3][1] - outlinePoints[0][1]);
            //一辺の長さ ＝ 輪郭の（４辺、うち２辺は等しい想定）長い方の辺
            let regularTriangleEdgeLength = outlineWidth >= outlineHeight ? outlineWidth : outlineHeight;

            //ベクトルを用意する
            let vecLeftUpper = new THREE.Vector2(-1, Math.sqrt(3));
            let vecRightUpper = new THREE.Vector2(1, Math.sqrt(3));
            let vecLeftLower = new THREE.Vector2(-1, -Math.sqrt(3));
            let vecRightLower = new THREE.Vector2(1, -Math.sqrt(3));
            vecLeftUpper.normalize();
            vecRightUpper.normalize();
            vecLeftLower.normalize();
            vecRightLower.normalize();

            //正六角形を構成する６個の座標P0dash~P5dash
            this.P0dash = [this.center[0] - regularTriangleEdgeLength, this.center[1]];
            this.P1dash = [this.center[0] + vecLeftUpper.x * regularTriangleEdgeLength, this.center[1] + vecLeftUpper.y * regularTriangleEdgeLength];
            this.P2dash = [this.center[0] + vecRightUpper.x * regularTriangleEdgeLength, this.center[1] + vecRightUpper.y * regularTriangleEdgeLength];
            this.P3dash = [this.center[0] + regularTriangleEdgeLength, this.center[1]];
            this.P4dash = [this.center[0] + vecRightLower.x * regularTriangleEdgeLength, this.center[1] + vecRightLower.y * regularTriangleEdgeLength];
            this.P5dash = [this.center[0] + vecLeftLower.x * regularTriangleEdgeLength, this.center[1] + vecLeftLower.y * regularTriangleEdgeLength];

            //正六角形を形成する正三角形×６個
            //中心の左上の三角形から時計回りに0~5とする
            //正三角形(center, P0dash, P1dash)
            this.child0 = new dividableRegularTriangle(-1, this.height+1, [this.center[0], this.center[1], this.P0dash[0], this.P0dash[1], this.P1dash[0], this.P1dash[1]]);
            //正三角形(center, P1dash, P2dash)
            this.child1 = new dividableRegularTriangle(-1, this.height+1, [this.center[0], this.center[1], this.P1dash[0], this.P1dash[1], this.P2dash[0], this.P2dash[1]]);
            //正三角形(center, P2dash, P3dash)
            this.child2 = new dividableRegularTriangle(-1, this.height+1, [this.center[0], this.center[1], this.P2dash[0], this.P2dash[1], this.P3dash[0], this.P3dash[1]]);
            //正三角形(center, P3dash, P4dash)
            this.child3 = new dividableRegularTriangle(-1, this.height+1, [this.center[0], this.center[1], this.P3dash[0], this.P3dash[1], this.P4dash[0], this.P4dash[1]]);
            //正三角形(center, P4dash, P5dash)
            this.child4 = new dividableRegularTriangle(-1, this.height+1, [this.center[0], this.center[1], this.P4dash[0], this.P4dash[1], this.P5dash[0], this.P5dash[1]]);
            //正三角形(center, P5dash, P0dash)
            this.child5 = new dividableRegularTriangle(-1, this.height+1, [this.center[0], this.center[1], this.P5dash[0], this.P5dash[1], this.P0dash[0], this.P0dash[1]]);
        }
    }


    function makeParentHexagon(source) {
        //source.points：輪郭線などの頂点情報
        //source.structure：Object　←コレにparentHexagonを代入する
        let points = source.points;
        source.structure = new parentHexagon([points[0], points[1], points[2], points[3]]);

        let center0 = source.structure.child0.center;
        let center1 = source.structure.child1.center;
        let center2 = source.structure.child2.center;
        let center3 = source.structure.child3.center;
        let center4 = source.structure.child4.center;
        let center5 = source.structure.child5.center;
        
        //他の入力点に対して分割を行う処理を記述↓
        if (points.length >= 4) {
            for (let i = 4; i < points.length; i++) {
                let point = points[i];
                //子0から5で、points[i]から最短のcenterを持つものを探す
                let dist0 = dist(point[0], point[1], center0[0], center0[1]);
                let dist1 = dist(point[0], point[1], center1[0], center1[1]);
                let dist2 = dist(point[0], point[1], center2[0], center2[1]);
                let dist3 = dist(point[0], point[1], center3[0], center3[1]);
                let dist4 = dist(point[0], point[1], center4[0], center4[1]);
                let dist5 = dist(point[0], point[1], center5[0], center5[1]);

                if (Math.min(dist0, dist1, dist2, dist3, dist4, dist5) === dist0) {
                    reachAimAndDivideRegularTriangle(source.structure.child0, point);
                } else if (Math.min(dist0, dist1, dist2, dist3, dist4, dist5) === dist1) {
                    reachAimAndDivideRegularTriangle(source.structure.child1, point);
                } else if (Math.min(dist0, dist1, dist2, dist3, dist4, dist5) === dist2) {
                    reachAimAndDivideRegularTriangle(source.structure.child2, point);
                } else if (Math.min(dist0, dist1, dist2, dist3, dist4, dist5) === dist3) {
                    reachAimAndDivideRegularTriangle(source.structure.child3, point);
                } else if (Math.min(dist0, dist1, dist2, dist3, dist4, dist5) === dist4) {
                    reachAimAndDivideRegularTriangle(source.structure.child4, point);
                } else if (Math.min(dist0, dist1, dist2, dist3, dist4, dist5) === dist5) {
                    reachAimAndDivideRegularTriangle(source.structure.child5, point);
                }
            }
        }
    }


    function divideRegularTriangle(regularTriangle) {
        let co = regularTriangle.coordinates;
        let P0 = [co[0], co[1]];
        let P1 = [co[2], co[3]];
        let P2 = [co[4], co[5]];
        let centerP0P1 = [(P0[0]+P1[0])/2, (P0[1]+P1[1])/2];
        let centerP1P2 = [(P1[0]+P2[0])/2, (P1[1]+P2[1])/2];
        let centerP2P0 = [(P2[0]+P0[0])/2, (P2[1]+P0[1])/2];

        regularTriangle.child0 = new dividableRegularTriangle(0, regularTriangle.height+1, [P0[0], P0[1], centerP0P1[0], centerP0P1[1], centerP2P0[0], centerP2P0[1]]);
        regularTriangle.child1 = new dividableRegularTriangle(1, regularTriangle.height+1, [centerP0P1[0], centerP0P1[1], P1[0], P1[1], centerP1P2[0], centerP1P2[1]]);
        regularTriangle.child2 = new dividableRegularTriangle(2, regularTriangle.height+1, [centerP2P0[0], centerP2P0[1], centerP1P2[0], centerP1P2[1], P2[0], P2[1]]);
        regularTriangle.child3 = new dividableRegularTriangle(3, regularTriangle.height+1, [centerP1P2[0], centerP1P2[1], centerP2P0[0], centerP2P0[1], centerP0P1[0], centerP0P1[1]]);
    }


    //分割するところに到達して、divideを呼ぶメソッド
    function reachAimAndDivideRegularTriangle(regularTriangle, point) {
        if (regularTriangle.child0 === undefined) {
            divideRegularTriangle(regularTriangle);
            return;
        }

        //4つのcenterで一番近いところにすすむ
        let center0 = regularTriangle.child0.center;
        let center1 = regularTriangle.child1.center;
        let center2 = regularTriangle.child2.center;
        let center3 = regularTriangle.child3.center;
        //pointとcenterX間の距離
        let dist0 = dist(point[0], point[1], center0[0], center0[1]);
        let dist1 = dist(point[0], point[1], center1[0], center1[1]);
        let dist2 = dist(point[0], point[1], center2[0], center2[1]);
        let dist3 = dist(point[0], point[1], center3[0], center3[1]);

        if (Math.min(dist0, dist1, dist2, dist3) === dist0) {
            reachAimAndDivideRegularTriangle(regularTriangle.child0, point);
        } else if (Math.min(dist0, dist1, dist2, dist3) === dist1) {
            reachAimAndDivideRegularTriangle(regularTriangle.child1, point);
        } else if (Math.min(dist0, dist1, dist2, dist3) === dist2) {
            reachAimAndDivideRegularTriangle(regularTriangle.child2, point);
        } else if (Math.min(dist0, dist1, dist2, dist3) === dist3) {
            reachAimAndDivideRegularTriangle(regularTriangle.child3, point);
        }
    }


    function drawParentHexagon(outlinePoints, hexagon, ctx, gridLineList, lineColor) {
        //正六角形の輪郭（を構成する＊の部分（３本の線分））を描画する
        let array = [];
        judgeAndGetIntersection(outlinePoints, hexagon.P0dash[0], hexagon.P0dash[1], hexagon.P3dash[0], hexagon.P3dash[1], array);
        if (array.length === 1) {
            //現状ここには入らない
        } else if (array.length === 2) {
            globals.drawapp.drawLine(ctx, lineColor, 1.0, array[0][0], array[0][1], array[1][0], array[1][1]);
        }

        array = [];
        judgeAndGetIntersection(outlinePoints, hexagon.P1dash[0], hexagon.P1dash[1], hexagon.P4dash[0], hexagon.P4dash[1], array);
        if (array.length === 1) {
            //現状ここには入らない
        } else if (array.length === 2) {
            globals.drawapp.drawLine(ctx, lineColor, 1.0, array[0][0], array[0][1], array[1][0], array[1][1]);
        }

        array = [];
        judgeAndGetIntersection(outlinePoints, hexagon.P2dash[0], hexagon.P2dash[1], hexagon.P5dash[0], hexagon.P5dash[1], array);
        if (array.length === 1) {
            //現状ここには入らない
        } else if (array.length === 2) {
            globals.drawapp.drawLine(ctx, lineColor, 1.0, array[0][0], array[0][1], array[1][0], array[1][1]);
        }

        // if (isInOutline(hexagon.P0dash[0], hexagon.P0dash[1], outlinePoints) && isInOutline(hexagon.P3dash[0], hexagon.P3dash[1], outlinePoints)) {
        //     globals.drawapp.drawLine(ctx, lineColor, 1.0, hexagon.P0dash[0], hexagon.P0dash[1], hexagon.P3dash[0], hexagon.P3dash[1]);
        // }
        // if (isInOutline(hexagon.P1dash[0], hexagon.P1dash[1], outlinePoints) && isInOutline(hexagon.P4dash[0], hexagon.P4dash[1], outlinePoints)) {
        //     globals.drawapp.drawLine(ctx, lineColor, 1.0, hexagon.P1dash[0], hexagon.P1dash[1], hexagon.P4dash[0], hexagon.P4dash[1]);
        // }
        // if (isInOutline(hexagon.P2dash[0], hexagon.P2dash[1], outlinePoints) && isInOutline(hexagon.P5dash[0], hexagon.P5dash[1], outlinePoints)) {
        //     globals.drawapp.drawLine(ctx, lineColor, 1.0, hexagon.P2dash[0], hexagon.P2dash[1], hexagon.P5dash[0], hexagon.P5dash[1]);
        // }

        if (hexagon.child0 === undefined) { return; }

        drawRegularTriangle(outlinePoints, hexagon.child0, ctx, gridLineList, lineColor);
        drawRegularTriangle(outlinePoints, hexagon.child1, ctx, gridLineList, lineColor);
        drawRegularTriangle(outlinePoints, hexagon.child2, ctx, gridLineList, lineColor);
        drawRegularTriangle(outlinePoints, hexagon.child3, ctx, gridLineList, lineColor);
        drawRegularTriangle(outlinePoints, hexagon.child4, ctx, gridLineList, lineColor);
        drawRegularTriangle(outlinePoints, hexagon.child5, ctx, gridLineList, lineColor);
    }

    
    function drawRegularTriangle(outlinePoints, childTriangle, ctx, gridLineList, lineColor) {
        let co = childTriangle.coordinates;
        let center = childTriangle.center;
        ctx.fillRect(center[0]-0.5, center[1]-0.5, 2, 2);

        let array = [];
        //正三角形の輪郭を描画する
        if (childTriangle.childID === -1) {
            //正六角形の子の場合
            if (isInOutline(co[2], co[3], outlinePoints) && isInOutline(co[4], co[5], outlinePoints)) {
                //線分が展開図内部にある場合
                globals.drawapp.drawLine(ctx, lineColor, 1.0, co[2], co[3], co[4], co[5]);
            }
        } else if (childTriangle.childID === 3) {
            //4個目の子供の場合、輪郭を描画する
            if (isInOutline(co[0], co[1], outlinePoints) && isInOutline(co[2], co[3], outlinePoints)) {
                //線分が展開図内部にある場合
                globals.drawapp.drawLine(ctx, lineColor, 1.0, co[0], co[1], co[2], co[3]);
            }
            if (isInOutline(co[2], co[3], outlinePoints) && isInOutline(co[4], co[5], outlinePoints)) {
                //線分が展開図内部にある場合
                globals.drawapp.drawLine(ctx, lineColor, 1.0, co[2], co[3], co[4], co[5]);
            }
            if (isInOutline(co[4], co[5], outlinePoints) && isInOutline(co[0], co[1], outlinePoints)) {
                //線分が展開図内部にある場合
                globals.drawapp.drawLine(ctx, lineColor, 1.0, co[4], co[5], co[0], co[1]);
            }
        }

        if (childTriangle.child0 === undefined) { return; }

        drawRegularTriangle(outlinePoints, childTriangle.child0, ctx, gridLineList, lineColor);
        drawRegularTriangle(outlinePoints, childTriangle.child1, ctx, gridLineList, lineColor);
        drawRegularTriangle(outlinePoints, childTriangle.child2, ctx, gridLineList, lineColor);
        drawRegularTriangle(outlinePoints, childTriangle.child3, ctx, gridLineList, lineColor);
    }


    //=============================================



    //ある点が、展開図の輪郭内にあるかどうかを判定するやつ
    //展開図は４頂点から構成される四辺形（正方形か長方形）であるとする
    function isInOutline(px, py, outlinePoints) {
        return outlinePoints[0][0] <= px && px <= outlinePoints[1][0] && outlinePoints[0][1] <= py && py <= outlinePoints[3][1];
    }


    //交差判定して交点とか求めるやーつ
    function judgeAndGetIntersection(op, xs, ys, xe, ye, array) {
        //op0op1との交点
        if (globals.beziercurve.judgeIntersect2(xs, ys, xe, ye, op[0][0], op[0][1], op[1][0], op[1][1])) {
            array.push(globals.beziercurve.getIntersectPoint(xs, ys, op[0][0], op[0][1], xe, ye, op[1][0], op[1][1]));
        }
        //op1op2との交点
        if (globals.beziercurve.judgeIntersect2(xs, ys, xe, ye, op[1][0], op[1][1], op[2][0], op[2][1])) {
            array.push(globals.beziercurve.getIntersectPoint(xs, ys, op[1][0], op[1][1], xe, ye, op[2][0], op[2][1]));
        }
        //op2op3との交点
        if (globals.beziercurve.judgeIntersect2(xs, ys, xe, ye, op[2][0], op[2][1], op[3][0], op[3][1])) {
            array.push(globals.beziercurve.getIntersectPoint(xs, ys, op[2][0], op[2][1], xe, ye, op[3][0], op[3][1]));
        }
        //op3op0との交点
        if (globals.beziercurve.judgeIntersect2(xs, ys, xe, ye, op[3][0], op[3][1], op[0][0], op[0][1])) {
            array.push(globals.beziercurve.getIntersectPoint(xs, ys, op[3][0], op[3][1], xe, ye, op[0][0], op[0][1]));
        }
    }




    return {
        drawGrid: drawGrid,
        drawGridWithAngle: drawGridWithAngle,
        rotationalMovement: rotationalMovement,
        coordinateTransformation: coordinateTransformation,
        q_tree: q_tree,
        makeQTree: makeQTree,
        divideQTree: divideQTree,
        drawQTree: drawQTree,
        autoMesh: autoMesh,
        regularTrianglation: regularTrianglation,
        dividableRegularTriangle: dividableRegularTriangle,
        parentHexagon: parentHexagon,
        makeParentHexagon: makeParentHexagon,
        drawParentHexagon: drawParentHexagon,
        drawRegularTriangle: drawRegularTriangle,
    }
}