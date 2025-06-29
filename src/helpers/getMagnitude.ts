import * as THREE from "three";

const getMagnitude = (vector: THREE.Vector3): number => {
  const x = Math.pow(vector.x, 2);
  const y = Math.pow(vector.y, 2);
  const z = Math.pow(vector.z, 2);

  return Math.sqrt(x + y + z);
};

export default getMagnitude;