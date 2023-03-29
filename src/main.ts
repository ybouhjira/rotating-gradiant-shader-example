import './style.css'
import {
    AmbientLight,
    Mesh,
    Object3D,
    PerspectiveCamera,
    Scene,
    ShaderMaterial,
    SphereGeometry,
    Vector3,
    WebGLRenderer
} from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene = new Scene()
const webGLRenderer = new WebGLRenderer({
    antialias: true,
});
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
webGLRenderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(webGLRenderer.domElement);
scene.add(new AmbientLight(0x404040));


camera.position.set(0, 8, 8);
camera.lookAt(0, 0, 0);

new OrbitControls(camera, webGLRenderer.domElement)

const shaderMaterial = new ShaderMaterial(
    {
        //wireframe: true,
        fragmentShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            uniform float uTime;
            
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
                    hsv2rgb(vec3(y, 1., 1.)),
                    1.0
                );
            }
        `,
        vertexShader: ` 
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying float uTime;
            
            void main() {
                vUv = uv;
                vNormal = normal;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        uniforms: {
            uTime: {value: 0}
        }
    }
);
const sphere = new Mesh(
    new SphereGeometry(3, 200, 200),
    shaderMaterial
);

function addRandomSphere() {
    return Array.from({length: 50}).map((_) => {
        const obj = new Object3D()

        const sphere2 = new Mesh(
            new SphereGeometry(Math.random() * 2 - 0.5, 16, 16),
            shaderMaterial
        )

        const getPos = () => Math.random() * 20 - 10;
        sphere2.position.set(getPos(), getPos(), getPos());

        (obj as any).__rotation = new Vector3(
            Math.random() / 100,
            Math.random() / 100,
            Math.random() / 100
        )
        obj.add(sphere2)
        obj.position.set(sphere.position.x, sphere.position.y, sphere.position.z)
        return obj
    })

}

const spheres = addRandomSphere()


scene.add(sphere)
sphere.rotation.y = Math.PI / 2

sphere.add(...spheres);

function animate() {
    requestAnimationFrame(animate);

    shaderMaterial.uniforms.uTime.value += 0.005;

    spheres.forEach(s => {

        const s1 = s as any;
        s.rotation.x += (s1.__rotation).x;
        s.rotation.y += (s1.__rotation).y;
        s.rotation.z += (s1.__rotation).z;
    })

    webGLRenderer.render(scene, camera);
}

const background = new Mesh(
    new SphereGeometry(100, 100, 100),
    shaderMaterial  );
scene.add(background);

// make background mesh doublesided
background.material.side = 2;
// set camera max zoom
camera.zoom = 0.1;
animate()

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
})