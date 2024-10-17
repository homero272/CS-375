///////////////////////////////////////////////////////////////////////////////
//
//  BasicCube.js
//
//  A cube defined of 12 triangles
//

class BasicCube {
    constructor(gl, vertexShader, fragmentShader) {
        vertexShader ||= `
                in vec4 aPosition;
                in vec4 aColor;

                uniform mat4 P;
                uniform mat4 MV;

                out vec4 vColor;

                void main() {
                    gl_Position = P * MV * aPosition;
                    vColor = aColor;
}`;
        fragmentShader ||= `
                in vec4 vColor;
                out vec4 fColor;

                void main() {
                    fColor = gl_FrontFacing? vColor : vec4(0,0,0,0);
        }`;
        // Define positions with side length 1 (from -0.5 to +0.5)
        const positions = new Float32Array([
            // Front face
            -0.5, -0.5,  0.5,  // Triangle 1
             0.5, -0.5,  0.5,
             0.5,  0.5,  0.5,
            
            -0.5, -0.5,  0.5,  // Triangle 2
             0.5,  0.5,  0.5,
            -0.5,  0.5,  0.5,

            // Back face
            -0.5, -0.5, -0.5,  // Triangle 3
            -0.5,  0.5, -0.5,
             0.5,  0.5, -0.5,
            
            -0.5, -0.5, -0.5,  // Triangle 4
             0.5,  0.5, -0.5,
             0.5, -0.5, -0.5,

            // Top face
            -0.5,  0.5, -0.5,  // Triangle 5
            -0.5,  0.5,  0.5,
             0.5,  0.5,  0.5,
            
            -0.5,  0.5, -0.5,  // Triangle 6
             0.5,  0.5,  0.5,
             0.5,  0.5, -0.5,

            // Bottom face
            -0.5, -0.5, -0.5,  // Triangle 7
             0.5, -0.5, -0.5,
             0.5, -0.5,  0.5,
            
            -0.5, -0.5, -0.5,  // Triangle 8
             0.5, -0.5,  0.5,
            -0.5, -0.5,  0.5,

            // Right face
             0.5, -0.5, -0.5,  // Triangle 9
             0.5,  0.5, -0.5,
             0.5,  0.5,  0.5,
            
             0.5, -0.5, -0.5,  // Triangle 10
             0.5,  0.5,  0.5,
             0.5, -0.5,  0.5,

            // Left face
            -0.5, -0.5, -0.5,  // Triangle 11
            -0.5, -0.5,  0.5,
            -0.5,  0.5,  0.5,
            
            -0.5, -0.5, -0.5,  // Triangle 12
            -0.5,  0.5,  0.5,
            -0.5,  0.5, -0.5,
        ]);

        // Define colors corresponding to each vertex
        const colors = new Float32Array([
            // Front face (Red)
            1.0, 0.0, 0.0, 1.0,  // Triangle 1
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,

            1.0, 0.0, 0.0, 1.0,  // Triangle 2
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,

            // Back face (Green)
            0.0, 1.0, 0.0, 1.0,  // Triangle 3
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,

            0.0, 1.0, 0.0, 1.0,  // Triangle 4
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,

            // Top face (Blue)
            0.0, 0.0, 1.0, 1.0,  // Triangle 5
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,

            0.0, 0.0, 1.0, 1.0,  // Triangle 6
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,

            // Bottom face (Yellow)
            1.0, 1.0, 0.0, 1.0,  // Triangle 7
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,

            1.0, 1.0, 0.0, 1.0,  // Triangle 8
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,

            // Right face (Magenta)
            1.0, 0.0, 1.0, 1.0,  // Triangle 9
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,

            1.0, 0.0, 1.0, 1.0,  // Triangle 10
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,

            // Left face (Cyan)
            0.0, 1.0, 1.0, 1.0,  // Triangle 11
            0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,

            0.0, 1.0, 1.0, 1.0,  // Triangle 12
            0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
        ]);

        // Create ShaderProgram
        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

        // Create Attribute objects
        let aPosition = new Attribute(gl, program, 'aPosition', positions, 3, gl.FLOAT);
        let aColor = new Attribute(gl, program, 'aColor', colors, 4, gl.FLOAT);
        this.draw = ()=> {
            // Use the shader program
            program.use();
    
            // Enable the position and color attributes
            aPosition.enable();
            aColor.enable();
    
            // Draw the cube using TRIANGLES starting vrtx 0, 36 total
            gl.drawArrays(gl.TRIANGLES, 0, 36);
    
            // Disable the attributes after drawing
            aPosition.disable();
            aColor.disable();
        }
    }


};
