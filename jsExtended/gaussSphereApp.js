/*
* Created by narumi nogawa on 10/26/20.
*/


document.addEventListener('DOMContentLoaded', function(e) {
    startThree();
}, false);

let parent = window.opener; //クロスオリジン要求のため、デバッガで起動しないと動かない
let surfNorm = parent.globals.surfNorm;
let surfNormListClustered = parent.globals.surfNormListClustered;

//グローバル変数の宣言
let scene, canvasFrame, renderer, camera, sphere, controls;

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
    camera.position.set(20, 100, 1000);
}

function initObject() {
    const axes = new THREE.AxesHelper(1000);
    scene.add(axes);
    
    const geometry = new THREE.SphereGeometry(100, 32, 32);
    const material = new THREE.MeshNormalMaterial();
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    surfNorm.forEach(n => {
        n.multiplyScalar(101);
        let geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(n.x, n.y, n.z));
        let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 10}));
        scene.add(line);
    });
}

function draw() {
    renderer.render(scene, camera);
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

// なぜか聞かない
document.getElementById("output-button").addEventListener("click", (event) => {
    camera.position.y -= 10;
});

// マウス座標はマウスが動いた時のみ取得できる
document.addEventListener("mousemove", (event) => {
    if (mouseDownFlag) {
        mouseX = event.pageX;
        mouseY = event.pageY;
    }
    console.log("mousemove");
});

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