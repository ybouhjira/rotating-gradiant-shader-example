import {ShaderMaterial} from "three";

export class GradiantMaterial extends ShaderMaterial {
    constructor(hueValue: number = 1, valueValue: number = 1) {
        super({
            fragmentShader: `
                varying vec2 vUv;
                uniform float uTime;
                uniform float uHue;
                uniform float uValue;
                
                vec3 hsv2rgb(vec3 c) {
                    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
                }
    
                void main() {
                    vec3 red = vec3(1., 0., 0.);
                    vec3 green = vec3(0., 1., 0.);
                    vec3 blue = vec3(0., 0., 1.);
        
                    float y = vUv.y * 0.2 + cos(uTime);
                    
                    gl_FragColor = vec4(
                        hsv2rgb(vec3(y, uHue, uValue)),
                        1.0
                    );
                }
            `,
            vertexShader: ` 
                varying vec2 vUv;
                varying float uTime;
                
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            uniforms: {
                uTime: {value: 0},
                uHue: {value: hueValue},
                uValue: {value: valueValue},
            }
        })
    }
}