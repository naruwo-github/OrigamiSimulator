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
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    //横方向
                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 1) {
                //直線×斜め１
                for (let i = 1; i < lines; i++) {
                    //横方向
                    let start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P1P3
                globals.drawapp.drawLine(ctx, color, 2, vectorP1.x, vectorP1.y, vectorP3.x, vectorP3.y);
                list.push([[vectorP1.x, vectorP1.y], [vectorP3.x, vectorP3.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 2) {
                //直線×斜め２
                for (let i = 1; i < lines; i++) {
                    //横方向
                    let start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P0P2
                globals.drawapp.drawLine(ctx, color, 2, vectorP0.x, vectorP0.y, vectorP2.x, vectorP2.y);
                list.push([[vectorP0.x, vectorP0.y], [vectorP2.x, vectorP2.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*(lines-i), vectorP0.y+vectorP0P1.y*(lines-i)];
                    let end = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    end = [vectorP2.x+vectorP2P3.x*i, vectorP2.y+vectorP2P3.y*i];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 3) {
                //斜め１×直線
                for (let i = 1; i < lines; i++) {
                    //縦方向
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P1P3
                globals.drawapp.drawLine(ctx, color, 2, vectorP1.x, vectorP1.y, vectorP3.x, vectorP3.y);
                list.push([[vectorP1.x, vectorP1.y], [vectorP3.x, vectorP3.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 4) {
                //斜め２×直線
                for (let i = 1; i < lines; i++) {
                    //縦方向
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P0P2
                globals.drawapp.drawLine(ctx, color, 2, vectorP0.x, vectorP0.y, vectorP2.x, vectorP2.y);
                list.push([[vectorP0.x, vectorP0.y], [vectorP2.x, vectorP2.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*(lines-i), vectorP0.y+vectorP0P1.y*(lines-i)];
                    let end = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    end = [vectorP2.x+vectorP2P3.x*i, vectorP2.y+vectorP2P3.y*i];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 5) {
                //斜め１×斜め２
                //中央の斜線P1P3
                globals.drawapp.drawLine(ctx, color, 2, vectorP1.x, vectorP1.y, vectorP3.x, vectorP3.y);
                list.push([[vectorP1.x, vectorP1.y], [vectorP3.x, vectorP3.y], color]);
                //中央の斜線P0P2
                globals.drawapp.drawLine(ctx, color, 2, vectorP0.x, vectorP0.y, vectorP2.x, vectorP2.y);
                list.push([[vectorP0.x, vectorP0.y], [vectorP2.x, vectorP2.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP0.x+vectorP0P1.x*(lines-i), vectorP0.y+vectorP0P1.y*(lines-i)];
                    end = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    end = [vectorP2.x+vectorP2P3.x*i, vectorP2.y+vectorP2P3.y*i];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 6) {
                //正方格子+斜め１
                for (let i = 1; i < lines; i++) {
                    //縦方向
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    //横方向
                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P1P3
                globals.drawapp.drawLine(ctx, color, 2, vectorP1.x, vectorP1.y, vectorP3.x, vectorP3.y);
                list.push([[vectorP1.x, vectorP1.y], [vectorP3.x, vectorP3.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 7) {
                //正方格子+斜め２
                for (let i = 1; i < lines; i++) {
                    //縦方向
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    //横方向
                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P0P2
                globals.drawapp.drawLine(ctx, color, 2, vectorP0.x, vectorP0.y, vectorP2.x, vectorP2.y);
                list.push([[vectorP0.x, vectorP0.y], [vectorP2.x, vectorP2.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*(lines-i), vectorP0.y+vectorP0P1.y*(lines-i)];
                    let end = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    end = [vectorP2.x+vectorP2P3.x*i, vectorP2.y+vectorP2P3.y*i];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            } else if (mode == 8) {
                //正方格子+斜め１×斜め２
                for (let i = 1; i < lines; i++) {
                    //縦方向
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    //横方向
                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
                //中央の斜線P1P3
                globals.drawapp.drawLine(ctx, color, 2, vectorP1.x, vectorP1.y, vectorP3.x, vectorP3.y);
                list.push([[vectorP1.x, vectorP1.y], [vectorP3.x, vectorP3.y], color]);
                //中央の斜線P0P2
                globals.drawapp.drawLine(ctx, color, 2, vectorP0.x, vectorP0.y, vectorP2.x, vectorP2.y);
                list.push([[vectorP0.x, vectorP0.y], [vectorP2.x, vectorP2.y], color]);
                //斜線
                for (let i = 0; i < lines; i++) {
                    let start = [vectorP0.x+vectorP0P1.x*i, vectorP0.y+vectorP0P1.y*i];
                    let end = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    end = [vectorP2.x+vectorP2P3.x*(lines-i), vectorP2.y+vectorP2P3.y*(lines-i)];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP0.x+vectorP0P1.x*(lines-i), vectorP0.y+vectorP0P1.y*(lines-i)];
                    end = [vectorP1.x+vectorP1P2.x*i, vectorP1.y+vectorP1P2.y*i];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);

                    start = [vectorP3.x+vectorP3P0.x*(lines-i), vectorP3.y+vectorP3P0.y*(lines-i)];
                    end = [vectorP2.x+vectorP2P3.x*i, vectorP2.y+vectorP2P3.y*i];
                    globals.drawapp.drawLine(ctx, color, 2, start[0], start[1], end[0], end[1]);
                    list.push([[start[0], start[1]], [end[0], end[1]], color]);
                }
            }
        }
    }

    return {
        drawGrid: drawGrid,
    }
}