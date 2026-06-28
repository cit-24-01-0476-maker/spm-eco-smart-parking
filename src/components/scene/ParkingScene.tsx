import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Html, PerspectiveCamera, Stars, Text } from "@react-three/drei";
import * as THREE from "three";
import {
  STORY_CAPTIONS,
  summary,
  useSim,
  type CameraView,
  type Slot,
  type Vehicle,
} from "../../lib/simulation-store";

const ROAD_Z = 13;
const ENTRY_X = -16;
const EXIT_X = 16;
const SLOT_AREA_Z = 0;

// ---------------- Camera Rig ----------------
const VIEWS: Record<CameraView, { pos: [number, number, number]; look: [number, number, number] }> =
  {
    cinematic: { pos: [28, 18, 28], look: [0, 0, 0] },
    top: { pos: [0, 48, 0.01], look: [0, 0, 0] },
    entrance: { pos: [-26, 6, 22], look: [-12, 1, 12] },
    slot: { pos: [0, 10, 18], look: [0, 0, 0] },
    dashboard: { pos: [22, 14, 22], look: [0, 2, 0] },
    exit: { pos: [26, 6, 22], look: [12, 1, 12] },
  };

function CameraRig() {
  const view = useSim((s) => s.cameraView);
  const cam = useThree((s) => s.camera);
  const target = useRef(new THREE.Vector3());
  const desiredPos = useMemo(() => new THREE.Vector3(), []);
  const desiredLook = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    const v = VIEWS[view];
    desiredPos.set(...v.pos);
    desiredLook.set(...v.look);
    cam.position.lerp(desiredPos, Math.min(1, dt * 1.6));
    target.current.lerp(desiredLook, Math.min(1, dt * 1.8));
    cam.lookAt(target.current);
  });
  return null;
}

// ---------------- Ground / Environment ----------------
function Ground() {
  return (
    <>
      {/* Sky / ambient */}
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[20, 30, 10]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <hemisphereLight args={["#bcd6f5", "#1a2236", 0.6]} />

      {/* Ground plane */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0c1426" />
      </mesh>

      {/* Parking lot pad */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[60, 36]} />
        <meshStandardMaterial color="#1b2541" />
      </mesh>

      {/* Main road */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, ROAD_Z]} receiveShadow>
        <planeGeometry args={[80, 6]} />
        <meshStandardMaterial color="#0f1a30" />
      </mesh>
      {/* Road dashed line */}
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh key={i} rotation-x={-Math.PI / 2} position={[-38 + i * 5, 0.03, ROAD_Z]}>
          <planeGeometry args={[2, 0.18]} />
          <meshStandardMaterial color="#e6efff" emissive="#1a2a55" />
        </mesh>
      ))}

      {/* Approach lanes to slots */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.025, 7]} receiveShadow>
        <planeGeometry args={[50, 3.5]} />
        <meshStandardMaterial color="#162039" />
      </mesh>
    </>
  );
}

// ---------------- Parking Slots ----------------
function SlotMesh({ slot }: { slot: Slot }) {
  const color =
    slot.status === "available" ? "#3ad17e" : slot.status === "reserved" ? "#5b8cff" : "#ff5050";
  const emissive =
    slot.status === "available" ? "#0e6a3c" : slot.status === "reserved" ? "#143780" : "#7a1010";
  return (
    <group position={[slot.x, 0.04, slot.z]}>
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[2.6, 5]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.55}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* outline */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 0]}>
        <ringGeometry args={[0, 0, 4]} />
      </mesh>
      <Text
        position={[0, 0.08, -2.1]}
        rotation-x={-Math.PI / 2}
        fontSize={0.45}
        color="#ffffff"
        anchorY="middle"
      >
        {`P${(slot.id + 1).toString().padStart(2, "0")}`}
      </Text>
    </group>
  );
}

function Slots() {
  const slots = useSim((s) => s.slots);
  return (
    <>
      {slots.map((s) => (
        <SlotMesh key={s.id} slot={s} />
      ))}
    </>
  );
}

// ---------------- Gates ----------------
function Barrier({ open, x, label }: { open: boolean; x: number; label: string }) {
  const armRef = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!armRef.current) return;
    const target = open ? -Math.PI / 2.1 : 0;
    armRef.current.rotation.z = THREE.MathUtils.lerp(
      armRef.current.rotation.z,
      target,
      Math.min(1, dt * 3),
    );
  });
  return (
    <group position={[x, 0, ROAD_Z]}>
      {/* posts */}
      <mesh position={[0, 1.2, -2.5]} castShadow>
        <boxGeometry args={[0.4, 2.4, 0.4]} />
        <meshStandardMaterial color="#e8eef9" />
      </mesh>
      <mesh position={[0, 1.2, 2.5]} castShadow>
        <boxGeometry args={[0.4, 2.4, 0.4]} />
        <meshStandardMaterial color="#e8eef9" />
      </mesh>
      {/* arm pivot */}
      <group position={[0, 1.8, -2.4]} ref={armRef}>
        <mesh position={[0, 0, 2.4]} castShadow>
          <boxGeometry args={[0.18, 0.18, 4.8]} />
          <meshStandardMaterial color="#ff5050" emissive="#ff2828" emissiveIntensity={0.4} />
        </mesh>
      </group>
      <Text position={[0, 3.0, 0]} fontSize={0.5} color="#9ad8ff" anchorX="center">
        {label}
      </Text>
    </group>
  );
}

function Gates() {
  const entryOpen = useSim((s) => s.entryGateOpen);
  const exitOpen = useSim((s) => s.exitGateOpen);
  return (
    <>
      <Barrier open={entryOpen} x={ENTRY_X} label="ENTRY" />
      <Barrier open={exitOpen} x={EXIT_X} label="EXIT" />
    </>
  );
}

// ---------------- ANPR Cameras ----------------
function ANPRCamera({ x, scanning }: { x: number; scanning: boolean }) {
  const beamRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!beamRef.current) return;
    const m = beamRef.current.material as THREE.MeshStandardMaterial;
    const t = (Math.sin(state.clock.elapsedTime * 4) + 1) / 2;
    m.opacity = scanning ? 0.25 + t * 0.45 : 0.05;
  });
  return (
    <group position={[x, 0, ROAD_Z - 3.2]}>
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 3.2, 12]} />
        <meshStandardMaterial color="#cfd9ec" />
      </mesh>
      <mesh position={[0, 3.3, 0]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.7]} />
        <meshStandardMaterial color="#1a2540" emissive="#5cc8ff" emissiveIntensity={0.4} />
      </mesh>
      {/* scan cone */}
      <mesh ref={beamRef} position={[0, 1.6, 2]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[1.6, 4, 24, 1, true]} />
        <meshStandardMaterial
          color="#5cc8ff"
          emissive="#5cc8ff"
          emissiveIntensity={0.9}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ---------------- Vehicles ----------------
function pathPoint(v: Vehicle, slots: Slot[]): { pos: THREE.Vector3; rotY: number } {
  // base car y
  const y = 0.45;
  const slot = v.slotId !== undefined ? slots.find((s) => s.id === v.slotId) : undefined;
  switch (v.state) {
    case "approachingEntry": {
      const x = THREE.MathUtils.lerp(-34, ENTRY_X - 1, v.progress);
      return { pos: new THREE.Vector3(x, y, ROAD_Z), rotY: Math.PI / 2 };
    }
    case "scanning":
      return { pos: new THREE.Vector3(ENTRY_X - 1, y, ROAD_Z), rotY: Math.PI / 2 };
    case "verified": {
      const x = THREE.MathUtils.lerp(ENTRY_X - 1, ENTRY_X + 2, v.progress);
      return { pos: new THREE.Vector3(x, y, ROAD_Z), rotY: Math.PI / 2 };
    }
    case "drivingToSlot": {
      if (!slot) return { pos: new THREE.Vector3(0, y, ROAD_Z), rotY: Math.PI / 2 };
      // Move from gate area down lane then to slot
      const p1 = new THREE.Vector3(ENTRY_X + 2, y, ROAD_Z);
      const p2 = new THREE.Vector3(slot.x, y, 7);
      const p3 = new THREE.Vector3(slot.x, y, slot.z);
      if (v.progress < 0.5) {
        const t = v.progress / 0.5;
        const pos = p1.clone().lerp(p2, t);
        return { pos, rotY: Math.PI / 2 };
      } else {
        const t = (v.progress - 0.5) / 0.5;
        const pos = p2.clone().lerp(p3, t);
        return { pos, rotY: Math.PI };
      }
    }
    case "parked":
      if (slot) return { pos: new THREE.Vector3(slot.x, y, slot.z), rotY: Math.PI };
      return { pos: new THREE.Vector3(0, y, 0), rotY: 0 };
    case "leavingSlot": {
      if (!slot) return { pos: new THREE.Vector3(0, y, 0), rotY: 0 };
      const p1 = new THREE.Vector3(slot.x, y, slot.z);
      const p2 = new THREE.Vector3(slot.x, y, 7);
      const p3 = new THREE.Vector3(EXIT_X - 2, y, ROAD_Z);
      if (v.progress < 0.5) {
        const t = v.progress / 0.5;
        return { pos: p1.clone().lerp(p2, t), rotY: 0 };
      } else {
        const t = (v.progress - 0.5) / 0.5;
        return { pos: p2.clone().lerp(p3, t), rotY: Math.PI / 2 };
      }
    }
    case "approachingExit": {
      const x = THREE.MathUtils.lerp(EXIT_X - 2, EXIT_X - 0.5, v.progress);
      return { pos: new THREE.Vector3(x, y, ROAD_Z), rotY: Math.PI / 2 };
    }
    case "exiting": {
      const x = THREE.MathUtils.lerp(EXIT_X - 0.5, 34, v.progress);
      return { pos: new THREE.Vector3(x, y, ROAD_Z), rotY: Math.PI / 2 };
    }
    case "denied": {
      const x = ENTRY_X - 2 - v.progress * 1.5;
      return { pos: new THREE.Vector3(x, y, ROAD_Z), rotY: Math.PI / 2 };
    }
    default:
      return { pos: new THREE.Vector3(0, y, 0), rotY: 0 };
  }
}

const CLASS_LABELS: Record<Vehicle["klass"], { label: string; color: string }> = {
  prebooked: { label: "Pre-booked", color: "#7be3a0" },
  staff: { label: "Staff", color: "#7ed0ff" },
  walkin: { label: "Walk-in", color: "#e0e6ef" },
  delivery: { label: "Delivery", color: "#ffce6b" },
  unauthorized: { label: "Unauthorized", color: "#ff6b6b" },
};

function VehicleMesh({ v }: { v: Vehicle }) {
  const slots = useSim((s) => s.slots);
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!groupRef.current) return;
    const { pos, rotY } = pathPoint(v, slots);
    groupRef.current.position.lerp(pos, 0.25);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotY, 0.18);
  });

  const labelInfo = CLASS_LABELS[v.klass];
  const showLabel =
    v.state === "approachingEntry" ||
    v.state === "scanning" ||
    v.state === "verified" ||
    v.state === "denied";
  const showOverstay = v.isRetail && v.overstay;

  return (
    <group ref={groupRef}>
      {/* body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.8, 0.7, 4]} />
        <meshStandardMaterial color={v.color} metalness={0.5} roughness={0.35} />
      </mesh>
      {/* cabin */}
      <mesh position={[0, 0.95, -0.2]} castShadow>
        <boxGeometry args={[1.55, 0.55, 2.2]} />
        <meshStandardMaterial
          color="#0a1626"
          metalness={0.2}
          roughness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* wheels */}
      {[
        [-0.85, 0.25, 1.4],
        [0.85, 0.25, 1.4],
        [-0.85, 0.25, -1.4],
        [0.85, 0.25, -1.4],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.25, 14]} />
          <meshStandardMaterial color="#101010" />
        </mesh>
      ))}
      {/* headlights */}
      <mesh position={[-0.5, 0.45, 2.0]}>
        <boxGeometry args={[0.35, 0.18, 0.08]} />
        <meshStandardMaterial color="#fff8cc" emissive="#fff0a0" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.5, 0.45, 2.0]}>
        <boxGeometry args={[0.35, 0.18, 0.08]} />
        <meshStandardMaterial color="#fff8cc" emissive="#fff0a0" emissiveIntensity={1.2} />
      </mesh>

      {showLabel && (
        <Html position={[0, 2.2, 0]} center distanceFactor={14}>
          <div
            style={{
              background: "rgba(10,20,40,0.85)",
              color: labelInfo.color,
              padding: "4px 10px",
              borderRadius: 8,
              border: `1px solid ${labelInfo.color}`,
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 11,
              whiteSpace: "nowrap",
              textShadow: `0 0 8px ${labelInfo.color}`,
            }}
          >
            {labelInfo.label} · {v.plate}
          </div>
        </Html>
      )}
      {showOverstay && (
        <Html position={[0, 2.4, 0]} center distanceFactor={14}>
          <div
            style={{
              background: "rgba(40,20,5,0.9)",
              color: "#ffb648",
              padding: "4px 10px",
              borderRadius: 8,
              border: "1px solid #ffb648",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 11,
              textShadow: "0 0 8px #ffb648",
            }}
          >
            ⚠ Overstay
          </div>
        </Html>
      )}
    </group>
  );
}

function Vehicles() {
  const vehicles = useSim((s) => s.vehicles);
  return (
    <>
      {vehicles.map((v) => (
        <VehicleMesh key={v.id} v={v} />
      ))}
    </>
  );
}

// ---------------- Retail Building ----------------
function RetailBuilding() {
  return (
    <group position={[-22, 0, -14]}>
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[14, 6, 10]} />
        <meshStandardMaterial color="#e8eef9" />
      </mesh>
      <mesh position={[0, 6.5, 0]} castShadow>
        <boxGeometry args={[14.4, 1, 10.4]} />
        <meshStandardMaterial color="#5cc8ff" emissive="#1f6fa0" emissiveIntensity={0.5} />
      </mesh>
      <Text position={[0, 6.55, 5.21]} fontSize={0.8} color="#0a1626" anchorX="center">
        SPM MART
      </Text>
      {/* glass front */}
      <mesh position={[0, 2.5, 5.05]}>
        <planeGeometry args={[12, 4]} />
        <meshStandardMaterial
          color="#7fb6e6"
          transparent
          opacity={0.55}
          metalness={0.6}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

// ---------------- Light Poles ----------------
function LightPoles() {
  const positions: [number, number, number][] = [
    [-20, 0, 6],
    [-10, 0, 6],
    [0, 0, 6],
    [10, 0, 6],
    [20, 0, 6],
    [-20, 0, -10],
    [-10, 0, -10],
    [0, 0, -10],
    [10, 0, -10],
    [20, 0, -10],
  ];
  return (
    <>
      {positions.map((p, i) => (
        <group key={i} position={p}>
          <mesh position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 5, 8]} />
            <meshStandardMaterial color="#cfd9ec" />
          </mesh>
          <mesh position={[0, 5, 0]}>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshStandardMaterial color="#fff8cc" emissive="#fff0a0" emissiveIntensity={1.4} />
          </mesh>
          <pointLight position={[0, 5, 0]} intensity={0.5} distance={10} color="#ffe9a3" />
        </group>
      ))}
    </>
  );
}

// ---------------- Cloud + Connection Lines ----------------
function CloudIcon() {
  return (
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.6}>
      <group position={[0, 12, -18]}>
        <mesh>
          <sphereGeometry args={[1.6, 24, 24]} />
          <meshStandardMaterial
            color="#5cc8ff"
            emissive="#5cc8ff"
            emissiveIntensity={0.7}
            transparent
            opacity={0.85}
          />
        </mesh>
        <Text position={[0, -2.4, 0]} fontSize={0.7} color="#9ad8ff" anchorX="center">
          CLOUD · API
        </Text>
      </group>
    </Float>
  );
}

function ConnectionLine({
  from,
  to,
}: {
  from: [number, number, number];
  to: [number, number, number];
}) {
  const ref = useRef<THREE.LineSegments>(null);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...from),
      new THREE.Vector3(...to),
    ]);
    return g;
  }, [from, to]);
  useFrame((s) => {
    if (!ref.current) return;
    const m = ref.current.material as THREE.LineBasicMaterial;
    m.opacity = 0.4 + 0.4 * Math.abs(Math.sin(s.clock.elapsedTime * 1.6));
  });
  return (
    <lineSegments ref={ref} geometry={geom}>
      <lineBasicMaterial color="#5cc8ff" transparent />
    </lineSegments>
  );
}

function ConnectionLines() {
  const cloud: [number, number, number] = [0, 12, -18];
  return (
    <>
      <ConnectionLine from={cloud} to={[ENTRY_X, 3.3, ROAD_Z - 3.2]} />
      <ConnectionLine from={cloud} to={[EXIT_X, 3.3, ROAD_Z - 3.2]} />
      <ConnectionLine from={cloud} to={[-22, 6.5, -14]} />
      <ConnectionLine from={cloud} to={[18, 6, -10]} />
    </>
  );
}

// ---------------- Mobile App Hologram ----------------
function MobileAppHologram() {
  const bookingVisible = useSim((s) => s.bookingVisible);
  if (!bookingVisible) return null;
  return (
    <Float speed={1.2} floatIntensity={0.6}>
      <group position={[-12, 6, 18]} rotation={[0, 0.4, 0]}>
        <Html transform distanceFactor={8} occlude={false}>
          <div
            style={{
              width: 220,
              background: "linear-gradient(160deg, #0c1830, #142a55)",
              color: "#e8f3ff",
              borderRadius: 22,
              padding: 14,
              border: "1px solid #5cc8ff",
              boxShadow: "0 0 24px #5cc8ff66",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 14, color: "#5cc8ff" }}>SPM ECO</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Colombo Central Lot</div>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "repeat(6,1fr)",
                gap: 4,
              }}
            >
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 16,
                    borderRadius: 3,
                    background: i === 7 ? "#5b8cff" : i % 5 === 0 ? "#ff5050" : "#3ad17e",
                    boxShadow: i === 7 ? "0 0 6px #5b8cff" : "none",
                  }}
                />
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 11 }}>
              Slot <b>P08</b> · 2h · LKR 320
            </div>
            <div
              style={{
                marginTop: 8,
                background: "#5cc8ff",
                color: "#0a1626",
                padding: "6px 0",
                textAlign: "center",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              BOOK NOW
            </div>
          </div>
        </Html>
      </group>
    </Float>
  );
}

// ---------------- Scene Root ----------------
export default function ParkingScene() {
  const tick = useSim((s) => s.tick);
  const playing = useSim((s) => s.playing);
  const scanActive = useSim((s) => s.scanActive);

  return (
    <Canvas shadows dpr={[1, 1.8]} gl={{ antialias: true }}>
      <color attach="background" args={["#070d1c"]} />
      <fog attach="fog" args={["#070d1c", 40, 110]} />
      <PerspectiveCamera makeDefault fov={50} position={[28, 18, 28]} />
      <CameraRig />
      <Stars radius={120} depth={50} count={1500} factor={2} fade speed={0.4} />
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>
      <Ground />
      <LightPoles />
      <Slots />
      <Gates />
      <ANPRCamera x={ENTRY_X} scanning={scanActive} />
      <ANPRCamera x={EXIT_X} scanning={false} />
      <RetailBuilding />
      <CloudIcon />
      <ConnectionLines />
      <MobileAppHologram />
      <Vehicles />
      <TickDriver tick={tick} playing={playing} />
      {/* facility title */}
      <Text
        position={[0, 0.04, 17]}
        rotation-x={-Math.PI / 2}
        fontSize={1.4}
        color="#5cc8ff"
        anchorX="center"
      >
        SPM ECO · COLOMBO CENTRAL
      </Text>
    </Canvas>
  );
}

function TickDriver({ tick, playing }: { tick: (dt: number) => void; playing: boolean }) {
  useFrame((_, dt) => {
    if (playing) tick(Math.min(dt, 0.08));
  });
  return null;
}
