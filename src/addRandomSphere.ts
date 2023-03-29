import {Material, Mesh, Object3D, SphereGeometry, Vector3} from "three";

export function addRandomSphere(position: Vector3, shaderMaterial: Material) {
    return Array.from({length: 50}).map((_, i) => {
        const obj = new Object3D()

        const sphere2 = new Mesh(
            new SphereGeometry(Math.random() * 2 - 0.5, 64, 64),
            shaderMaterial,
        )

        sphere2.name = `sphere2#${i}`;

        const getPos = () => Math.random() * 20 - 10;
        sphere2.position.set(getPos(), getPos(), getPos());

        (obj as any).__rotation = new Vector3(
            Math.random() / 100,
            Math.random() / 100,
            Math.random() / 100
        )
        obj.name = `obj.sphere2#${i}`;
        obj.add(sphere2)
        obj.position.set(position.x, position.y, position.z);
        return obj
    })

}