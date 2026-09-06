import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  PerspectiveCamera,
  Text,
} from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Person({
  position,
  bodyColor,
  name,
}: {
  position: [number, number, number];
  bodyColor: string;
  name: string;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;

    group.current.position.y =
      position[1] +
      Math.sin(
        state.clock.elapsedTime * 1.5 + position[0]
      ) *
        0.08;

    group.current.rotation.y =
      Math.sin(
        state.clock.elapsedTime * 0.7 + position[0]
      ) *
        0.12;
  });

  return (
    <group ref={group} position={position}>
      {/* Body */}
      <mesh position={[0, -0.45, 0]}>
        <capsuleGeometry args={[0.32, 0.65, 8, 16]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.35}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial
          color="#ffd7bd"
          roughness={0.5}
        />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 0.53, 0]}>
        <sphereGeometry args={[0.29, 24, 24]} />
        <meshStandardMaterial
          color="#29213d"
          roughness={0.8}
        />
      </mesh>

      {/* Name */}
      <Text
        position={[0, -1.05, 0]}
        fontSize={0.16}
        color="#334155"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
}


function SkillBubble({
  position,
  text,
  color,
}: {
  position: [number, number, number];
  text: string;
  color: string;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;

    group.current.rotation.y =
      state.clock.elapsedTime * 0.5;
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={1.2}
    >
      <group
        ref={group}
        position={position}
      >
        <mesh>
          <sphereGeometry args={[0.34, 32, 32]} />

          <meshStandardMaterial
            color={color}
            roughness={0.25}
            metalness={0.15}
          />
        </mesh>

        <Text
          position={[0, 0, 0.35]}
          fontSize={0.11}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>
      </group>
    </Float>
  );
}


function ConnectionLines() {
  const points = [
    new THREE.Vector3(-1.2, 0.1, 0),
    new THREE.Vector3(0, 0.35, 0),
    new THREE.Vector3(1.2, 0.1, 0),
  ];

  const geometry =
    new THREE.BufferGeometry().setFromPoints(
      points
    );

  return (
    <line geometry={geometry}>
      <lineBasicMaterial
        color="#c4b5fd"
        transparent
        opacity={0.45}
      />
    </line>
  );
}


function Scene() {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 0.8, 6]}
      />

      <ambientLight intensity={2.2} />

      <directionalLight
        position={[3, 5, 4]}
        intensity={3}
      />

      <pointLight
        position={[-3, 2, 3]}
        intensity={2}
      />

      {/* People */}

      <Person
        position={[-1.2, 0, 0]}
        bodyColor="#6d5dfc"
        name="Alex"
      />

      <Person
        position={[0, 0.25, 0.2]}
        bodyColor="#ff6b9d"
        name="You"
      />

      <Person
        position={[1.2, -0.05, 0]}
        bodyColor="#42c7a5"
        name="Maya"
      />

      {/* Connection */}

      <ConnectionLines />

      {/* Skills */}

      <SkillBubble
        position={[-1.7, 1.45, 0]}
        text="React"
        color="#6d5dfc"
      />

      <SkillBubble
        position={[1.7, 1.55, 0]}
        text="Python"
        color="#42c7a5"
      />

      <SkillBubble
        position={[0, 2, -0.2]}
        text="Design"
        color="#ff6b9d"
      />

      {/* Ground */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 0]}
      >
        <circleGeometry args={[2.7, 64]} />

        <meshStandardMaterial
          color="#f1edff"
          roughness={0.8}
        />
      </mesh>
    </>
  );
}


function CommunityScene() {
  return (
    <div className="h-[420px] w-full sm:h-[500px]">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}


export default CommunityScene;