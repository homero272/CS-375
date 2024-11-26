// Create the Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Field
const fieldGeometry = new THREE.PlaneGeometry(10, 20);
const fieldMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22, side: THREE.DoubleSide });
const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
field.rotation.x = -Math.PI / 2;
scene.add(field);

// Ball
const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0.5, -7);
scene.add(ball);

// Goalkeeper
const goalieGeometry = new THREE.BoxGeometry(1, 1, 0.5);
const goalieMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const goalkeeper = new THREE.Mesh(goalieGeometry, goalieMaterial);
goalkeeper.position.set(0, 0.5, 8);
scene.add(goalkeeper);

// Goal (simple frame)
const goalGeometry = new THREE.BoxGeometry(8, 4, 0.1);
const goalMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const goal = new THREE.Mesh(goalGeometry, goalMaterial);
goal.position.set(0, 2, 10);
scene.add(goal);

// Animation and Game Logic
let ballTarget = null;
let goalieTarget = null;

function kickBall(event) {
  // Map click position to the goal
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(goal);

  if (intersects.length > 0) {
    ballTarget = intersects[0].point;

    // Goalkeeper randomly dives
    const randomX = Math.random() * 6 - 3; // Random dive range (-3 to 3)
    goalieTarget = new THREE.Vector3(randomX, 0.5, 8);
  }
}

function animateBall() {
  if (ballTarget) {
    ball.position.lerp(ballTarget, 0.05);
    if (ball.position.distanceTo(ballTarget) < 0.1) {
      ballTarget = null; // Reset ball animation
    }
  }
}

function animateGoalkeeper() {
  if (goalieTarget) {
    goalkeeper.position.lerp(goalieTarget, 0.1);
  }
}

// Event Listener
window.addEventListener("click", kickBall);

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  animateBall();
  animateGoalkeeper();
  renderer.render(scene, camera);
}

animate();
