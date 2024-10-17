///////////////////////////////////////////////////////////////////////////////
//
//  ExperimentalCube.js - 
//    A cube defined using gl.TRIANGLE_STRIP with 14 vertices
//

class ExperimentalCube {
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
            fColor = vColor;
        }`;

        // vertices for the cube with gl.TRIANGLE_STRIP
        const positions = new Float32Array([
            0.5, 0.5, -0.5, // Back-top-right
            -0.5, 0.5, -0.5, // Back-top-left
            0.5, -0.5, -0.5, // Back-bottom-right
            -0.5, -0.5, -0.5, // Back-bottom-left
            -0.5, -0.5, 0.5, // Front-bottom-left
            -0.5, 0.5, -0.5, // Back-top-left
            -0.5, 0.5, 0.5, // Front-top-left
            0.5, 0.5, -0.5, // Back-top-right
            0.5, 0.5, 0.5, // Front-top-right
            0.5, -0.5, -0.5, // Back-bottom-right
            0.5, -0.5, 0.5, // Front-bottom-right
            -0.5, -0.5, 0.5, // Front-bottom-left
            0.5, 0.5, 0.5, // Front-top-right
            -0.5, 0.5, 0.5, // Front-top-left
        ]);

        //  colors for vertices
        const colors = new Float32Array([
            1.0, 0.0, 0.0, 1.0, 
            1.0, 0.0, 0.5, 1.0,
            0.0, 1.0, 0.0, 1.0, 
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0, 
            0.0, 0.0, 1.0, 1.0,
            1.0, 1.0, 0.0, 1.0, 
            1.0, 1.0, 0.0, 1.0,
            0.5, 0.5, 1.0, 1.0, 
            0.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0, 
            1.0, 0.5, 1.0, 1.0,
            0.5, 0.0, 1.0, 1.0,
            1.0, 0.0, 0.5, 1.0,
        ]);

        // Create ShaderProgram
        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

        // Create Attribute objects
        let aPosition = new Attribute(gl, program, 'aPosition', positions, 3, gl.FLOAT);
        let aColor = new Attribute(gl, program, 'aColor', colors, 4, gl.FLOAT);
        this.draw = () => {
            // Use the shader program
            program.use();

            // Enable the position and color attributes
            aPosition.enable();
            aColor.enable();

            // Draw the cube using gl.TRIANGLE_STRIP
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 14);

            // Disable the attributes after drawing
            aPosition.disable();
            aColor.disable();
        };
    }
}
