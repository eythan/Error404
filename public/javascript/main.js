import * as THREE from 'https://esm.sh/three@0.169.0';
import { GLTFLoader } from 'https://esm.sh/three@0.169.0/examples/jsm/loaders/GLTFLoader.js';

// -------------------- 1. Scene, Camera, Renderer --------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

const container = document.getElementById('earth-container');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// -------------------- 2. Lighting --------------------
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(2, 2, 2);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const earthLight = new THREE.PointLight(0xffffff, 1, 120);
earthLight.position.set(-8, -0.1, 0);
scene.add(earthLight);

// -------------------- 3. Earth --------------------
const earthGeometry = new THREE.SphereGeometry(5, 128, 128);
const earthMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg'),
    bumpMap: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg'),
    bumpScale: 0.05,
    specularMap: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg'),
    specular: new THREE.Color('grey'),
    shininess: 5,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(-8, -0.1, 0);
scene.add(earth);

// -------------------- 4. Starfield --------------------
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, opacity: 0.8 });
const starVertices = [];
for (let i = 0; i < 10000; i++) {
    starVertices.push((Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
scene.add(new THREE.Points(starGeometry, starMaterial));

// -------------------- 5. Load Rocket --------------------
let rocket;
const loader = new GLTFLoader();
loader.load(
    'public/assets/model/rocket.glb', // ensure this path is correct
    (gltf) => {
        rocket = gltf.scene;
        rocket.scale.set(0.05, 0.05, 0.05);
        scene.add(rocket);
    },
    undefined,
    (error) => console.error('Error loading rocket model:', error)
);

// -------------------- 6. Orbit Parameters --------------------
const orbitRadius = 10;
let orbitAngle = 0;
const orbitSpeed = 0.01;
let hasFinishedOrbit = false;

// -------------------- 7. Flash Setup --------------------
let flash = false;
let flashOpacity = 0;
let flashDone = false;

const flashPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
);
flashPlane.position.z = camera.position.z - 1;
scene.add(flashPlane);

// -------------------- 8. Message --------------------
const messageEl = document.getElementById("message");
let messageShown = false;

// -------------------- 8b. Second Message --------------------
const secondMessageEl = document.getElementById("second-message");
let secondMessageShown = false;

// -------------------- 9. Button System --------------------
const buttonContainer = document.getElementById("orbit-buttons");
let orbitButtons = [];
let buttonsReady = false;

function spawnOrbitButtons() {
    const labels = ["Nird", "Nuit de l'info", "Windows"];
    const hrefs = [
        "https://nird.forge.apps.education.fr/",
        "https://www.nuitdelinfo.com/",
        "https://fr.wikipedia.org/wiki/Windows_10"
    ];

    for (let i = 0; i < labels.length; i++) {
        const btn = document.createElement("button");
        btn.className = "orbit-btn";
        btn.innerText = labels[i];

        btn.addEventListener("click", () => {
            window.location.href = hrefs[i];
        });

        buttonContainer.appendChild(btn);

        orbitButtons.push({
            element: btn,
            angle: (Math.PI * 2 / labels.length) * i
        });
    }
    buttonsReady = true;
}

// -------------------- 10. Mouse Rotation --------------------
let isDragging = false;
let dragStartX = 0;
let autoRotate = true;

window.addEventListener('mousedown', (e) => {
    isDragging = true;
    autoRotate = false;
    dragStartX = e.clientX;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    autoRotate = true;
});

window.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - dragStartX;
        dragStartX = e.clientX;
        earth.rotation.y += deltaX * 0.005;
    }
});

// -------------------- 11. Animation Loop --------------------
function animate() {
    requestAnimationFrame(animate);

    // Earth rotation
    if (!flash && autoRotate) earth.rotation.y += 0.0012;

    // Rocket animation
    if (rocket) {
        if (!hasFinishedOrbit) {
            orbitAngle += orbitSpeed;
            rocket.position.x = earth.position.x + orbitRadius * Math.sin(orbitAngle);
            rocket.position.y = earth.position.y + orbitRadius * Math.cos(orbitAngle) * 0.2;
            rocket.position.z = earth.position.z + orbitRadius * Math.cos(orbitAngle);

            const nextAngle = orbitAngle + 0.01;
            const nextX = earth.position.x + orbitRadius * Math.sin(nextAngle);
            const nextZ = earth.position.z + orbitRadius * Math.cos(nextAngle);
            rocket.lookAt(nextX, rocket.position.y, nextZ);
            rocket.rotation.order = "XYZ";
            rocket.rotateX(Math.PI / 2);
            rocket.rotateY(Math.PI);

            // First message mid-orbit
            if (!messageShown && orbitAngle >= Math.PI) {
                messageShown = true;
                messageEl.style.transition = "opacity 1s ease-in, transform 1s ease-in";
                messageEl.style.opacity = 1;
                messageEl.style.transform = "translate(-50%, -50%) scale(1)";

                messageEl.addEventListener("transitionend", () => {
                    messageEl.style.zIndex = "1";
                    setTimeout(() => {
                        messageEl.style.transition = "transform 2s ease-out, opacity 2s ease-out";
                        messageEl.style.opacity = 0;
                        messageEl.style.transform = "translate(-50%, -50%) scale(0.5) translateY(-50px)";
                    }, 5000);
                }, { once: true });
            }

            if (orbitAngle >= Math.PI * 2) {
                hasFinishedOrbit = true;
                rocket.scale.set(0.2, 0.2, 0.2);
                rocket.position.set(-15, earth.position.y, earth.position.z + 6);
                rocket.rotation.set(0, 0, 0);
                rocket.rotateZ(-Math.PI / 2);
            }
        } else {
            // Rocket second orbit/final movement
            rocket.position.x += 0.05;
            rocket.rotation.x += 0.05;

            // === Show second message once, right before flash ===
            if (!secondMessageShown && rocket.position.x > 15) {
                secondMessageShown = true;

                // Show second message
                secondMessageEl.style.transition = "opacity 1s ease-in, transform 1s ease-in";
                secondMessageEl.style.opacity = 1;
                secondMessageEl.style.transform = "translate(-50%, -50%) scale(1)";

                // After 3 seconds, fade out and trigger flash
                setTimeout(() => {
                    secondMessageEl.style.transition = "transform 2s ease-out, opacity 2s ease-out";
                    secondMessageEl.style.opacity = 0;
                    secondMessageEl.style.transform = "translate(-50%, -50%) scale(0.5) translateY(-50px)";

                    setTimeout(() => {
                        flash = true;
                    }, 2000);
                }, 3000);
            }
        }
    }

    // Flash effect
    if (flash) {
        flashOpacity += 0.01;
        flashPlane.material.opacity = flashOpacity;
        earth.position.x = THREE.MathUtils.lerp(earth.position.x, 0, 0.02);

        if (flashOpacity >= 1) {
            earth.position.set(0, -earth.geometry.parameters.radius * 0.75, 0);
            flashOpacity = 0;
            flash = false;
            flashPlane.material.opacity = 0;

            if (!buttonsReady) spawnOrbitButtons();
        }
    }

    // Orbiting buttons
    if (buttonsReady) {
        const orbitR = 8;
        orbitButtons.forEach((b) => {
            const x = orbitR * Math.sin(b.angle + earth.rotation.y);
            const y = orbitR * Math.cos(b.angle + earth.rotation.y) * 0.4;

            const vector = new THREE.Vector3(
                earth.position.x + x,
                earth.position.y + y,
                earth.position.z
            );

            vector.project(camera);

            const screenX = (vector.x * 0.5 + 0.5) * container.clientWidth;
            const screenY = (-vector.y * 0.5 + 0.5) * container.clientHeight;

            b.element.style.left = screenX + "px";
            b.element.style.top = screenY + "px";
        });
    }

    renderer.render(scene, camera);
}

// -------------------- 12. Start Animation --------------------
animate();

// -------------------- 13. Resize Handler --------------------
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

