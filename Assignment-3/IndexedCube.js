/////////////////////////////////////////////////////////////////////////////
//
//  IndexedCube.js
//
//  A cube defined of 12 triangles using vertex indices.
//

class IndexedCube {
    constructor(gl, vertexShader, fragmentShader) {
        vertexShader = `
            in vec4 aPosition;
            in vec4 aColor;

            uniform mat4 P;
            uniform mat4 MV;

            out vec4 vColor;

            void main() {
                gl_Position = P * MV * aPosition;
                vColor = aColor;
            }`;

    fragmentShader = 
        `in vec4 vColor;
        out vec4 fColor;

        void main() {
            fColor = gl_FrontFacing? vColor : vec4(0,0,0,0);
    }`;

        // Define unique vertex positions for the cube (8 vertices)
        const positions = new Float32Array([
            -0.5, -0.5,  0.5, // 0: Front-bottom-left
             0.5, -0.5,  0.5, // 1: Front-bottom-right
             0.5,  0.5,  0.5, // 2: Front-top-right
            -0.5,  0.5,  0.5, // 3: Front-top-left
            -0.5, -0.5, -0.5, // 4: Back-bottom-left
             0.5, -0.5, -0.5, // 5: Back-bottom-right
             0.5,  0.5, -0.5, // 6: Back-top-right
            -0.5,  0.5, -0.5  // 7: Back-top-left
        ]);

        // Define colors corresponding to each vertex (same for each face)
        const colors = new Float32Array([
            1.0, 0.0, 0.0, 1.0, // Red
            1.0, 0.0, 0.0, 1.0, // red
            0.0, 0.0, 1.0, 1.0, // Blue
            0.0, 0.0, 1.0, 1.0, // Blue
            0.0, 1.0, 0.0, 1.0, // green
            0.0, 1.0, 0.0, 1.0, // green
            0.0, 1.0, 1.0, 1.0, // Grey
            0.0, 1.0, 1.0, 1.0  // Orange
        ]);

        // Define the indices for the 12 triangles that make up the cube
        let indices = new Uint16Array([
            // Front face
            0, 1, 2,
            0, 2, 3,
            // Back face
            4, 6, 5,
            4, 7, 6,
            // Top face
            3, 2, 6,
            3, 6, 7,
            // Bottom face
            0, 5, 1,
            0, 4, 5,
            // Right face
            1, 5, 6,
            1, 6, 2,
            // Left face
            0, 3, 7,
            0, 7, 4
        ]);

        // Create ShaderProgram
        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

        // Create Attribute objects for positions and colors
        let aPosition = new Attribute(gl, program, 'aPosition', positions, 3, gl.FLOAT);
        let aColor = new Attribute(gl, program, 'aColor', colors, 4, gl.FLOAT);

        // Create an Indices object for the element array
        indices = new Indices(gl, indices);

        this.draw = ()=> {
            // Use the shader program
            program.use();
    
            // Enable the position and color attributes
            aPosition.enable();
            aColor.enable();
            indices.enable();

            //call draw elements based on indices 
            gl.drawElements(gl.TRIANGLES, indices.count, indices.type, 0);

            // Disable the attributes after drawing
            aPosition.disable();
            aColor.disable();
            indices.disable();
        }
    }
};
