import './style.css'
import {AmbientLight, BufferGeometry, Mesh, PerspectiveCamera, Scene, SphereGeometry, WebGLRenderer} from 'three'
import {addRandomSphere} from "./addRandomSphere";
import {GradiantMaterial} from "./gradiantMaterial";

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


const shaderMaterial = new GradiantMaterial();

const sphere = new Mesh(
    new SphereGeometry(3, 200, 200),
    shaderMaterial
);

const spheres = addRandomSphere(sphere.position, shaderMaterial);


scene.add(sphere)
sphere.rotation.y = Math.PI / 2

sphere.add(...spheres);

function animate() {
    requestAnimationFrame(animate);

    shaderMaterial.uniforms.uTime.value += 0.008;
    (scene.getObjectByName('background') as Mesh<BufferGeometry, GradiantMaterial>).material!.uniforms.uTime.value += 0.008;

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
    new GradiantMaterial(1, 0.5));
scene.add(background);

background.material.side = 2;
background.name = 'background';

animate()

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
})