import * as THREE from 'three';

export class BulletTracer {
  private meshes: { mesh: THREE.Mesh, velocity: THREE.Vector3, life: number }[] = [];
  private material = new THREE.MeshBasicMaterial({ color: 0xffdd44, transparent: true, opacity: 0.8 });
  private geometry = new THREE.CylinderGeometry(0.04, 0.04, 3, 8);

  constructor(private scene: THREE.Scene) {
    this.geometry.rotateX(Math.PI / 2); // Align cylinder with Z axis
  }

  addTracer(origin: THREE.Vector3, direction: THREE.Vector3, speed: number = 200) {
    const mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.position.copy(origin);
    
    // Look in the direction of travel
    const target = origin.clone().add(direction);
    mesh.lookAt(target);

    this.scene.add(mesh);
    this.meshes.push({
      mesh,
      velocity: direction.clone().normalize().multiplyScalar(speed),
      life: 0.5 // 0.5 seconds life max
    });
  }

  update(dt: number) {
    for (let i = this.meshes.length - 1; i >= 0; i--) {
      const tracer = this.meshes[i];
      tracer.life -= dt;
      if (tracer.life <= 0) {
        this.scene.remove(tracer.mesh);
        this.meshes.splice(i, 1);
        continue;
      }
      
      tracer.mesh.position.addScaledVector(tracer.velocity, dt);
    }
  }

  dispose() {
    for (const t of this.meshes) {
      this.scene.remove(t.mesh);
    }
    this.meshes = [];
    this.geometry.dispose();
    this.material.dispose();
  }
}
