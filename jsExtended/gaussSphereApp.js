/*
* Created by narumi nogawa on 10/26/20.
*/

let parent = window.opener; //クロスオリジン要求のため、デバッガで起動しないと動かない
let surfNorm = parent.globals.surfNorm;
let surfNormListClustered = parent.globals.surfNormListClustered;

//グローバル変数の宣言
let scene, canvasFrame, renderer, camera, sphere, controls;

document.addEventListener('DOMContentLoaded', function(e) {
    startThree();
}, false);

function startThree() {
    initThree(); //レンダラー、シーン設定
    initCamera(); //カメラ作成
    initObject(); //3D図形作成
    draw(); //描画

    tick(); //マウス入力によって視点を回転させる関数
}

function initThree() {
    canvasFrame = document.getElementById('canvas-frame');
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setClearColor(0x999999, 1.0);
    renderer.setSize(canvasFrame.clientWidth, canvasFrame.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    if (!renderer) alert('初期化失敗！');
    canvasFrame.appendChild(renderer.domElement);
    scene = new THREE.Scene();
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, canvasFrame.clientWidth / canvasFrame.clientHeight);
    camera.position.set(0, 300, 1000);
}

function initObject() {
    const axes = new THREE.AxesHelper(1000);
    scene.add(axes);
    
    addSphere();
    addNormalVectors();
    addCirclePoints();
}

function draw() {
    renderer.render(scene, camera);
}

// 毎フレーム時に実行されるループイベントです
function tick() {
    // マウスの位置に応じて角度を設定
    // マウスのX座標がステージの幅の何%の位置にあるか調べてそれを360度で乗算する
    const targetRotX = (mouseX / window.innerWidth) * 360;
    // const targetRotY = (mouseY / window.innerHeight) * 360;
    // イージングの公式を用いて滑らかにする
    // 値 += (目標値 - 現在の値) * 減速値
    rotX += (targetRotX - rotX) * 0.02;
    // rotY += (targetRotY - rotY) * 0.02;
    // ラジアンに変換する
    const radianX = rotX * Math.PI / 180;
    // const radianY = rotY * Math.PI / 180;
    // 角度に応じてカメラの位置を設定
    // camera.position.x = 1000 * Math.sin(radianX);
    camera.position.z = 100 * Math.cos(radianX);
    // camera.position.y = 1000 * Math.sin(radianY);

    // 原点方向を見つめる
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    draw();
    requestAnimationFrame(tick);
}

function addSphere() {
    const geometry = new THREE.SphereGeometry(100, 32, 32);
    const material = new THREE.MeshNormalMaterial();
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
}

function addNormalVectors() {
    // 法線マップの描画
    surfNorm.forEach(n => {
        n.multiplyScalar(101);
        let geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(n.x, n.y, n.z));
        let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 10}));
        scene.add(line);
    });
}

function addCirclePoints() {
    // 円の点を生成して描画
    // for (let rotationAngleX = 0; rotationAngleX < 360; rotationAngleX += 45) {
    //     // X, Y, Z軸のそれぞれに対してrotationAngleX度回転させる（現状円のZ座標は0のため、Z軸に対して回転しても意味はない）
    //     // まずX軸に対する回転のループを定義
    //     for (let rotationAngleY = 0; rotationAngleY < 360; rotationAngleY += 45) {
    //         // Y軸に対する回転のループを定義
    //         for (let theta = 0.0; theta < 360.0; theta+=1.0) {
    //             let radius = 100.1;
    //             let x = radius * Math.cos(theta);
    //             let y = radius * Math.sin(theta);
    //             let z = 0;
    
    //             let rotatedXVector = apply3DRotationMatrixAxisX(x, y, z, rotationAngleX);
    //             let rotatedXYVector = apply3DRotationMatrixAxisX(rotatedXVector.x, rotatedXVector.y, rotatedXVector.z, rotationAngleY);

    //             let geometry = new THREE.Geometry();
    //             geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    //             geometry.vertices.push(rotatedXYVector);
    //             let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 10}));
    //             scene.add(line);
    //         }
    //     }
    // }

    for (let rotationAngleX = 0; rotationAngleX < 360; rotationAngleX += 45) {
        for (let theta = 0.0; theta < 360.0; theta+=0.5) {
            let radius = 100.1;
            let x = radius * Math.cos(theta);
            let y = radius * Math.sin(theta);
            let z = 0;

            let rotatedXVector = apply3DRotationMatrixAxisX(x, y, z, rotationAngleX);
            let geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(0, 0, 0));
            geometry.vertices.push(rotatedXVector);
            let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 10}));
            scene.add(line);
        }
    }

    // for (let theta = 0.0; theta < 360.0; theta+=0.1) {
    //     let radius = 100.1;
    //     let x = radius * Math.cos(theta);
    //     let y = radius * Math.sin(theta);
    //     let z = 0;
    //     let geometry = new THREE.Geometry();
    //     geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    //     geometry.vertices.push(new THREE.Vector3(x, y, z));
    //     let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 10}));
    //     scene.add(line);
    // }
}

// ある点をx軸に対してtheta度だけ回転移動させた点を求める関数
function apply3DRotationMatrixAxisX(x, y, z, angle) {
    let u, v, w;
    let theta = angle / 180 * Math.PI;
    u = x;
    v = Math.cos(theta) * y - Math.sin(theta) * z;
    w = Math.sin(theta) * y + Math.cos(theta) * z;
    return new THREE.Vector3(u, v, w);
}

// ある点をy軸に対してtheta度だけ回転移動させた点を求める関数
function apply3DRotationMatrixAxisY(x, y, z, angle) {
    let u, v, w;
    let theta = angle / 180 * Math.PI;
    u = Math.cos(theta) * x - Math.sin(theta) * z;
    v = y;
    w = Math.sin(theta) * x + Math.cos(theta) * z;
    return new THREE.Vector3(u, v, w);
}

// ある点をz軸に対してtheta度だけ回転移動させた点を求める関数
function apply3DRotationMatrixAxisZ(x, y, z, angle) {
    let u, v, w;
    let theta = angle / 180 * Math.PI;
    u = Math.cos(theta) * x + Math.sin(theta) * y;
    v = - Math.sin(theta) * x + Math.cos(theta) * y;
    w = z;
    return new THREE.Vector3(u, v, w);
}

let mouseDownFlag = false;
let rotX = 0;
let mouseX = 0;
let rotY = 0;
let mouseY = 0;

document.addEventListener("mousedown", (event) => {
    mouseDownFlag = true;
});

document.addEventListener("mouseup", (event) => {
    mouseDownFlag = false;
});

document.addEventListener('keydown', (event) => {
    switch (event.keyCode) {
        case 37:
            console.log("left");
            camera.position.x -= 20;
            break;

        case 38:
            console.log("top");
            camera.position.y += 20;
            break;

        case 39:
            console.log("right");
            camera.position.x += 20;
            break;

        case 40:
            console.log("left");
            camera.position.y -= 20;
            break;
    
        default:
            console.log("def");
            break;
    }
});

// マウス座標はマウスが動いた時のみ取得できる
document.addEventListener("mousemove", (event) => {
    if (mouseDownFlag) {
        mouseX = event.pageX;
        mouseY = event.pageY;
    }
    console.log("mousemove");
});
