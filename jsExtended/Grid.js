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
            //木の領域□の中に、折り線(赤や青の線)が含まれていれば分割
            //線分の交差判定を用いるが、端点は含まない方を扱う
            for (let i = 0; i < svgInfo.stroke.length; i++) {
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

    //2点間の距離を求める
    function dist(x1,y1,x2,y2) {
        return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
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
    }
}