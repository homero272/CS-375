document.addEventListener("DOMContentLoaded", function () {
  // Create the scene, camera, and renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //setup orbit controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  const loader = new THREE.GLTFLoader();

  //Lighting setup for pitch
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
  hemisphereLight.position.set(0, 50, 0);
  scene.add(hemisphereLight);

  // instantiate the field area to kick the penalty
  const fieldGeometry = new THREE.PlaneGeometry(10, 20);
  //set the mesh to be transparent to mimic the grass already rendered by the stadium
  const fieldMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0
  });
  const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
  field.rotation.x = -Math.PI / 2;
  scene.add(field);

  // Load the stadium model
  let stadiumModel = null;
  loader.load('Models/Stadium.glb', (gltf) => {
    stadiumModel = gltf.scene;
    stadiumModel.scale.set(50, 50, 50);
    stadiumModel.position.set(0, -20, -20);
    scene.add(stadiumModel);
  });

  // Load the goalkeeper model
  let goalkeeperModel = null;
  //set goalkeeper transformations
  const initialKeeperPosition = new THREE.Vector3(0,0,8);
  loader.load('Models/Figure_01.glb', (gltf) => {
    goalkeeperModel = gltf.scene;
    goalkeeperModel.scale.set(1.5, 1.5, 1.5);
    goalkeeperModel.position.copy(initialKeeperPosition);
    scene.add(goalkeeperModel);
  });

  // instantiate the goal model
  const goalGeometry = new THREE.BoxGeometry(18, 8, 0.1);
  //set the mesh to be transparent to mimic the goal model that is rendered by the stadium
  const goalMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0
  });
  const goal = new THREE.Mesh(goalGeometry, goalMaterial);
  goal.position.set(0, 3, 10);
  scene.add(goal);

  // Load the soccer ball model
  let soccerBall = null;
  // Store initial ball position for when we reset it
  const initialBallPosition = new THREE.Vector3(0, 0.5, -7);
  //load ball and set its transformations
  loader.load('Models/Football_ball.glb', (gltf) => {
    soccerBall = gltf.scene;
    soccerBall.scale.set(0.5, 0.5, 0.5);
    soccerBall.position.copy(initialBallPosition);
    scene.add(soccerBall);
  });

  // Animation and Game Logic
  let score = 0;
  let ballTarget = null;
  let goalieTarget = null;

  function kickBall(event) {
    if (!soccerBall) return; 
    //get position of mouse click
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
      const randomX = Math.random() * 10 - 5;
      goalieTarget = new THREE.Vector3(randomX, 1, 8);
    }
  }

  //function to determine if goal was scored or not
  function checkGoalOrBlock() {
    if (soccerBall && goalkeeperModel) {
    
      const distanceToGoalkeeper = soccerBall.position.distanceTo(goalkeeperModel.position);
      const blockThreshold = 3.0; 
      let statusMessage = document.getElementById('statusMessage');
      //check if the distance of the ball to the goalkeeper is within the 'block radius'
      if (distanceToGoalkeeper < blockThreshold) {
        console.log("Blocked by the goalkeeper!");
        statusMessage.innerText = 'Saved!';
        statusMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
      } 
      else {
        console.log("Goal scored!");
        score++;
        updateScoreDisplay();
        statusMessage.innerText = 'Goal!';
        statusMessage.style.backgroundColor = 'rgba(0, 255, 0, 0.5)'; 
        
      }

      // Reset ball position after 1 second
      setTimeout(() => {
        soccerBall.position.copy(initialBallPosition);
        goalkeeperModel.position.lerp(initialKeeperPosition, 0.1);
        statusMessage.innerText = '';
        statusMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      }, 1000);
    }
  }

  function animateBall() {
    if (soccerBall && ballTarget) {
      soccerBall.position.lerp(ballTarget, 0.05);
      if (soccerBall.position.distanceTo(ballTarget) < 0.1) {
        checkGoalOrBlock(); 
        ballTarget = null; 
      }
    }
  }

  
  function animateGoalkeeper() {
    if (goalieTarget && goalkeeperModel) {
      goalkeeperModel.position.lerp(goalieTarget, 0.1);

      const direction = new THREE.Vector3().subVectors(goalieTarget, goalkeeperModel.position).normalize();

    }
  }

  //function to update score
  function updateScoreDisplay() {
    const scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.textContent = `Score: ${score}`;
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
  updateScoreDisplay();
});
