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
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    //横方向
                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 1) {
                //直線×斜め１
                for (let i = 1; i < lines; i++) {
                    //横方向
                    let start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P1P3
                //globals.drawapp.drawLine(ctx, color, 2, vectorP1.x, vectorP1.y, vectorP3.x, vectorP3.y);
                list.push([[vectorP1.x, vectorP1.y], [vectorP3.x, vectorP3.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 2) {
                //直線×斜め２
                for (let i = 1; i < lines; i++) {
                    //横方向
                    let start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P0P2
                //globals.drawapp.drawLine(ctx, color, 2, vectorP0.x, vectorP0.y, vectorP2.x, vectorP2.y);
                list.push([[vectorP0.x, vectorP0.y], [vectorP2.x, vectorP2.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*(lines-i), vectorP0.y+vectorP0P1.y*(lines-i)];
                    let end = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    end = [vectorP2.x+vectorP2P3.x*i, vectorP2.y+vectorP2P3.y*i];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 3) {
                //斜め１×直線
                for (let i = 1; i < lines; i++) {
                    //縦方向
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P1P3
                //globals.drawapp.drawLine(ctx, color, 2, vectorP1.x, vectorP1.y, vectorP3.x, vectorP3.y);
                list.push([[vectorP1.x, vectorP1.y], [vectorP3.x, vectorP3.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 4) {
                //斜め２×直線
                for (let i = 1; i < lines; i++) {
                    //縦方向
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P0P2
                //globals.drawapp.drawLine(ctx, color, 2, vectorP0.x, vectorP0.y, vectorP2.x, vectorP2.y);
                list.push([[vectorP0.x, vectorP0.y], [vectorP2.x, vectorP2.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*(lines-i), vectorP0.y+vectorP0P1.y*(lines-i)];
                    let end = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    end = [vectorP2.x+vectorP2P3.x*i, vectorP2.y+vectorP2P3.y*i];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 5) {
                //斜め１×斜め２
                //中央の斜線P1P3
                //globals.drawapp.drawLine(ctx, color, 2, vectorP1.x, vectorP1.y, vectorP3.x, vectorP3.y);
                list.push([[vectorP1.x, vectorP1.y], [vectorP3.x, vectorP3.y], color]);
                //中央の斜線P0P2
                //globals.drawapp.drawLine(ctx, color, 2, vectorP0.x, vectorP0.y, vectorP2.x, vectorP2.y);
                list.push([[vectorP0.x, vectorP0.y], [vectorP2.x, vectorP2.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP0.x+vectorP0P1.x*(lines-i), vectorP0.y+vectorP0P1.y*(lines-i)];
                    end = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    end = [vectorP2.x+vectorP2P3.x*i, vectorP2.y+vectorP2P3.y*i];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 6) {
                //正方格子+斜め１
                for (let i = 1; i < lines; i++) {
                    //縦方向
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    //横方向
                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P1P3
                //globals.drawapp.drawLine(ctx, color, 2, vectorP1.x, vectorP1.y, vectorP3.x, vectorP3.y);
                list.push([[vectorP1.x, vectorP1.y], [vectorP3.x, vectorP3.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 7) {
                //正方格子+斜め２
                for (let i = 1; i < lines; i++) {
                    //縦方向
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    //横方向
                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P0P2
                //globals.drawapp.drawLine(ctx, color, 2, vectorP0.x, vectorP0.y, vectorP2.x, vectorP2.y);
                list.push([[vectorP0.x, vectorP0.y], [vectorP2.x, vectorP2.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*(lines-i), vectorP0.y+vectorP0P1.y*(lines-i)];
                    let end = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    end = [vectorP2.x+vectorP2P3.x*i, vectorP2.y+vectorP2P3.y*i];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 8) {
                //正方格子+斜め１×斜め２
                for (let i = 1; i < lines; i++) {
                    //縦方向
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    //横方向
                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P1P3
                //globals.drawapp.drawLine(ctx, color, 2, vectorP1.x, vectorP1.y, vectorP3.x, vectorP3.y);
                list.push([[vectorP1.x, vectorP1.y], [vectorP3.x, vectorP3.y], color]);
                //中央の斜線P0P2
                //globals.drawapp.drawLine(ctx, color, 2, vectorP0.x, vectorP0.y, vectorP2.x, vectorP2.y);
                list.push([[vectorP0.x, vectorP0.y], [vectorP2.x, vectorP2.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP0.x+vectorP0P1.x*(lines-i), vectorP0.y+vectorP0P1.y*(lines-i)];
                    end = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    end = [vectorP2.x+vectorP2P3.x*i, vectorP2.y+vectorP2P3.y*i];
                    //globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            }
        }

        //格子を回転させ描画する処理(とりあえず実装完了するまで0がデフォ)
        rotationalMovement(ctx, list, array, 0);
    }

    //角度を持った格子を描画する関数
    function drawGridWithAngle(gridMode, gridnumber, outputList, ctx, lineColor, outlinePoints, angle) {
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
            const vectorP2Dash = new THREE.Vector2(2 * vectorP2.x - vectorP3.x, 2 * vectorP2.y - vectorP1.y);
            const vectorP3Dash = new THREE.Vector2(2 * vectorP3.x - vectorP2.x, 2 * vectorP3.y - vectorP0.y);
            // const vectorP0P1Dash = new THREE.Vector2(vectorP1Dash.x - vectorP0Dash.x, vectorP1Dash.y - vectorP0Dash.y);
            // const vectorP1P2Dash = new THREE.Vector2(vectorP2Dash.x - vectorP1Dash.x, vectorP2Dash.y - vectorP1Dash.y);
            // const vectorP2P3Dash = new THREE.Vector2(vectorP3Dash.x - vectorP2Dash.x, vectorP3Dash.y - vectorP2Dash.y);
            // const vectorP3P0Dash = new THREE.Vector2(vectorP0Dash.x - vectorP3Dash.x, vectorP0Dash.y - vectorP3Dash.y);
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
           console.log("(drawGridWithAngle)angle = " + angle);
           rotationalMovement(ctx, grids, outlinePoints, angle);
           //試し描き
        //    for (let i = 0; i < grids.length; i++) {
        //        globals.drawapp.drawLine(ctx, lineColor, 3, grids[i][0][0], grids[i][0][1], grids[i][1][0], grids[i][1][1]);
        //    }
           //grids内にある線を用いて交差判定
           for (let i = 0; i < grids.length; i++) {
               let tmp = grids[i];
               let start = tmp[0];
               let end = tmp[1];
               var vectorStart = new THREE.Vector2(start[0], start[1]);
               var vectorEnd = new THREE.Vector2(end[0], end[1]);
               var vectorStartToEnd = new THREE.Vector2(vectorEnd.x - vectorStart.x, vectorEnd.y - vectorStart.y);
               vectorStartToEnd.normalize();

               var j = 0;
               var handleGrids = new Array();
               var vectorStartTmp = vectorStart;
               while (vectorStartTmp.distanceTo(vectorEnd) > 10) {
                   vectorStartTmp.x += vectorStartToEnd.x * j;
                   vectorStartTmp.y += vectorStartToEnd.y * j;
                   //デバッグコード
                   ctx.fillStyle = "rgb(0, 255, 0)";
                   ctx.fillRect(vectorStartTmp.x-1, vectorStartTmp.y-1, 3, 3);
                   //輪郭との交差判定を行う(現段階では輪郭線は4本と上で固定されている？)
                   //一方向から交差判定し続けると、上の点が複数回検出されてしまう、、それを弾く処理が必要になる
                   //検出したら、「その点を更新した点」から始める
                   if (globals.beziercurve.judgeIntersect2(vectorStart.x, vectorStart.y, vectorStartTmp.x, vectorStartTmp.y, 
                    element0[0], element0[1], element1[0], element1[1])) {
                        handleGrids.push(globals.beziercurve.getIntersectPoint(vectorStart.x, vectorStart.y, element0[0], element0[1], 
                            vectorStartTmp.x, vectorStartTmp.y, element1[0], element1[1]));
                        vectorStart = vectorStartTmp;
                   }
                   if (globals.beziercurve.judgeIntersect2(vectorStart.x, vectorStart.y, vectorStartTmp.x, vectorStartTmp.y, 
                    element1[0], element1[1], element2[0], element2[1])) {
                        handleGrids.push(globals.beziercurve.getIntersectPoint(vectorStart.x, vectorStart.y, element1[0], element1[1], 
                            vectorStartTmp.x, vectorStartTmp.y, element2[0], element2[1]));
                        vectorStart = vectorStartTmp;
                   }
                   if (globals.beziercurve.judgeIntersect2(vectorStart.x, vectorStart.y, vectorStartTmp.x, vectorStartTmp.y, 
                    element2[0], element2[1], element3[0], element3[1])) {
                        handleGrids.push(globals.beziercurve.getIntersectPoint(vectorStart.x, vectorStart.y, element2[0], element2[1], 
                            vectorStartTmp.x, vectorStartTmp.y, element3[0], element3[1]));
                        vectorStart = vectorStartTmp;
                   }
                   if (globals.beziercurve.judgeIntersect2(vectorStart.x, vectorStart.y, vectorStartTmp.x, vectorStartTmp.y, 
                    element3[0], element3[1], element0[0], element0[1])) {
                        handleGrids.push(globals.beziercurve.getIntersectPoint(vectorStart.x, vectorStart.y, element3[0], element3[1], 
                            vectorStartTmp.x, vectorStartTmp.y, element0[0], element0[1]));
                        vectorStart = vectorStartTmp;
                   }
                   j += 5;
               }
               //handlegridsのサイズが2だったら交差した2点を検出できているのでこれを格子の線とする
               if (handleGrids.length == 2) {
                   //outputlistに格納&描画
                   outputList.push(handleGrids[0]);
                   outputList.push(handleGrids[1]);
                   globals.drawapp.drawLine(ctx, lineColor, 0.5, handleGrids[0][0], handleGrids[0][1], handleGrids[1][0], handleGrids[1][1]);
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
            //globals.drawapp.drawLine(ctx, list[i][2], 2, list[i][0][0], list[i][0][1], list[i][1][0], list[i][1][1]);
        }
    }

    //(x, y)を(ox, oy)を中心としてangleだけ回転移動した座標を返す関数
    function coordinateTransformation(x, y, ox, oy, angle) {
        x -= ox;
        y -= oy;
        return [x * Math.cos(angle / 180 * Math.PI) - y * Math.sin(angle / 180 * Math.PI) + ox, 
            x * Math.sin(angle / 180 * Math.PI) + y * Math.cos(angle / 180 * Math.PI) + oy];
    }

    return {
        drawGrid: drawGrid,
        drawGridWithAngle: drawGridWithAngle,
        rotationalMovement: rotationalMovement,
        coordinateTransformation: coordinateTransformation,
    }
}