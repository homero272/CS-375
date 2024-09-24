let gl = undefined;
let axes, cone, sphere;
let ms;  
let angle = 0.0;
let scaleChange = 0.0;
let isShrinking = false;
let randomColor = vec4(Math.random(), Math.random(), Math.random(), 1.0);
function init() {
    let canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");
    if (!gl) { alert("Your Web browser doesn't support WebGL 2\nPlease contact Dave"); }
    
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Initialize different shapes
    axes = new Axes(gl);
    cone = new Cone(gl, 36);    
    sphere = new Sphere(gl, 100, 100); 

    // Initialize MatrixStack for transformations
    ms = new MatrixStack();

    // Start the rendering loop
    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //update angle for rotations
    angle += 3.0;
    angle %= 360.0;

    //update scaling factor for sphere
    if(scaleChange > 1.0){
        isShrinking = true;
    }
    else{
        isShrinking = false;
    }
    if(isShrinking){
        scaleChange = 0.0;
        //only change the color every so often
        randomColor = vec4(Math.random(), Math.random(), Math.random(), 1.0);
    }
    else{
        scaleChange += 0.02;
    }

    
   

    
    
    
    // 1. Draw Axes 
    ms.push();
    ms.scale(0.2,0.2,0.2);
    ms.rotate(angle,[1,1,0]);
    axes.MV = ms.current();
    axes.draw();
    ms.pop();

    // 2. Draw Cone
    ms.push();
    ms.rotate(angle, [1,1,0])
    ms.translate(-0.5, -0.5, 0);  
    ms.scale(0.2, 0.2, 0.2);
    cone.color = randomColor;
    cone.MV = ms.current();
    cone.draw();
    ms.pop();

    // 3. Draw Sphere
    ms.push();
    ms.translate(0.5, 0.5, 0);  
    ms.scale(0.3, 0.3, 0.3); 
    ms.scale(scaleChange,scaleChange,scaleChange);
    sphere.color = vec4(0.2,0.5,.6,1.0);
    sphere.MV = ms.current();
    sphere.draw();
    ms.pop();

    
    requestAnimationFrame(render);
}

window.onload = init;
