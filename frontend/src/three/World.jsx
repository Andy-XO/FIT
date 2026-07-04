import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars, Line, Html } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { SECTIONS, TOTAL_DEPTH, sceneY } from '../data/sections';
import { profile, macros } from '../data/profile';

const EMERALD = '#3ddc97';
const TEAL = '#5eead4';
const AMBER = '#e9a100';
const RUST = '#c85a3c';

const damp = THREE.MathUtils.damp;

/* ---------- Camera: descends through the world as you scroll ---------- */
function CameraRig({ scrollRef }) {
  const target = useRef(new THREE.Vector3());
  useFrame(({ camera }, dt) => {
    const s = scrollRef.current || {};
    const p = s.progress ?? 0;
    const mx = s.mx ?? 0;
    const my = s.my ?? 0;
    const wantY = -p * TOTAL_DEPTH;
    camera.position.y = damp(camera.position.y, wantY, 3, dt);
    camera.position.x = damp(camera.position.x, mx * 1.6, 3, dt);
    camera.position.z = damp(camera.position.z, 9.5, 3, dt);
    target.current.set(mx * 0.6, camera.position.y - my * 0.8, 0);
    camera.lookAt(target.current);
  });
  return null;
}

/* ---------- Backdrop: starfield + drifting motes spanning the whole descent ---------- */
function Backdrop() {
  return (
    <group>
      <Stars radius={120} depth={80} count={2600} factor={4} saturation={0} fade speed={0.6} />
      <Sparkles count={120} scale={[26, TOTAL_DEPTH + 20, 26]} position={[0, -TOTAL_DEPTH / 2, 0]} size={3} speed={0.3} opacity={0.5} color={TEAL} />
    </group>
  );
}

/* ---------- Scene 0: the living core (you, now) ---------- */
function HeroCore({ y, completion }) {
  const core = useRef();
  const halo = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const breathe = 1 + Math.sin(t * 1.1) * 0.05; // slow breath
    if (core.current) core.current.scale.setScalar(breathe);
    if (halo.current) halo.current.rotation.z = t * 0.15;
  });
  const glow = 0.6 + completion * 1.6; // brighter as the checklist fills
  return (
    <group position={[3, y, 0]}>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh ref={core}>
          <icosahedronGeometry args={[1.5, 6]} />
          <meshStandardMaterial
            color={EMERALD}
            emissive={EMERALD}
            emissiveIntensity={glow}
            roughness={0.35}
            metalness={0.2}
          />
        </mesh>
        <mesh ref={halo} rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[2.7, 0.03, 16, 120]} />
          <meshBasicMaterial color={TEAL} transparent opacity={0.7} />
        </mesh>
      </Float>
      <Sparkles count={60} scale={6} size={4} speed={0.4} color={EMERALD} />
      <pointLight position={[0, 0, 3]} intensity={6} distance={14} color={EMERALD} />
    </group>
  );
}

/* ---------- Scene 1: body composition (lean core / fat shell / visceral orb) ---------- */
function BodyComposition({ y }) {
  const spin = useRef();
  const visceral = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (spin.current) spin.current.rotation.y = t * 0.35;
    if (visceral.current) {
      visceral.current.position.set(Math.cos(t * 1.3) * 0.6, Math.sin(t * 0.9) * 0.4, Math.sin(t * 1.3) * 0.6);
      const pulse = 1 + Math.sin(t * 4) * 0.18;
      visceral.current.scale.setScalar(pulse);
    }
  });
  return (
    <group position={[-3, y, 0]}>
      <group ref={spin}>
        {/* lean mass - solid inner core */}
        <mesh>
          <sphereGeometry args={[1.35, 48, 48]} />
          <meshStandardMaterial color={EMERALD} emissive={EMERALD} emissiveIntensity={0.5} roughness={0.4} metalness={0.3} />
        </mesh>
        {/* fat mass - translucent outer shell */}
        <mesh>
          <sphereGeometry args={[2.0, 48, 48]} />
          <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.25} transparent opacity={0.28} roughness={0.15} metalness={0.1} side={THREE.DoubleSide} />
        </mesh>
        {/* visceral fat - angry pulsing orb near the centre */}
        <mesh ref={visceral}>
          <sphereGeometry args={[0.34, 24, 24]} />
          <meshStandardMaterial color={RUST} emissive={RUST} emissiveIntensity={1.6} roughness={0.5} />
        </mesh>
        <Html position={[1.35, 0.2, 0]} center style={labelStyle(EMERALD)} pointerEvents="none">
          Lean {profile.leanKg} kg
        </Html>
        <Html position={[0, 2.25, 0]} center style={labelStyle(AMBER)} pointerEvents="none">
          Fat {profile.fatKg} kg · {profile.bodyFatPct}%
        </Html>
        <Html position={[0, -0.9, 0.6]} center style={labelStyle(RUST)} pointerEvents="none">
          Visceral {profile.visceralFat} ⚠
        </Html>
      </group>
      <pointLight position={[3, 2, 4]} intensity={5} distance={20} color={TEAL} />
      <pointLight position={[-3, -2, 2]} intensity={3} distance={18} color={AMBER} />
    </group>
  );
}

/* ---------- Scene 2: the descent (116 kg → milestone → goal) ---------- */
function JourneySlope({ y }) {
  const marker = useRef();
  const curve = useMemo(() => {
    const pts = profile.journey.map((c, i) => {
      const x = (i - 1) * 3.4;
      const yy = -i * 1.7 + 1.7; // descends
      return new THREE.Vector3(x, yy, Math.sin(i) * 0.6);
    });
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.6);
  }, []);
  const linePts = useMemo(() => curve.getPoints(80), [curve]);
  useFrame(({ clock }) => {
    const t = (clock.elapsedTime * 0.12) % 1;
    if (marker.current) marker.current.position.copy(curve.getPointAt(t));
  });
  return (
    <group position={[2, y, 0]}>
      <Line points={linePts} color={TEAL} lineWidth={2} transparent opacity={0.8} />
      {profile.journey.map((c, i) => {
        const pos = curve.getPointAt(profile.journey.length > 1 ? i / (profile.journey.length - 1) : 0);
        const isStart = i === 0;
        const col = isStart ? AMBER : i === profile.journey.length - 1 ? EMERALD : TEAL;
        return (
          <group key={c.label} position={pos}>
            <mesh>
              <sphereGeometry args={[0.42, 32, 32]} />
              <meshStandardMaterial color={col} emissive={col} emissiveIntensity={1.1} roughness={0.4} />
            </mesh>
            <Html position={[0, 0.85, 0]} center style={labelStyle(col)} pointerEvents="none">
              {c.label} · {c.weight} kg
            </Html>
          </group>
        );
      })}
      <mesh ref={marker}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <pointLight position={[0, 2, 4]} intensity={4} distance={20} color={EMERALD} />
    </group>
  );
}

/* ---------- Scene 3: daily fuel rings ---------- */
function FuelRing({ macro, index, count }) {
  const fill = useRef();
  const denom = { kcal: 3050, protein: 220, carbs: 320, fats: 100 };
  const ratio = Math.min(1, macro.value / (denom[macro.key] || macro.value));
  const x = (index - (count - 1) / 2) * 3.1;
  useFrame(({ clock }) => {
    // grow the arc in, then hold
    const grow = Math.min(1, clock.elapsedTime * 0.4);
    const arc = Math.max(0.001, ratio * grow * Math.PI * 2);
    if (fill.current) {
      fill.current.geometry.dispose();
      fill.current.geometry = new THREE.TorusGeometry(1.05, 0.16, 20, 90, arc);
      fill.current.rotation.z = Math.PI / 2; // start arc at top
    }
  });
  return (
    <group position={[x, 0, 0]}>
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.4}>
        {/* track */}
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[1.05, 0.06, 16, 90]} />
          <meshStandardMaterial color="#243027" emissive="#101a14" emissiveIntensity={0.4} roughness={0.8} />
        </mesh>
        {/* animated fill */}
        <mesh ref={fill}>
          <torusGeometry args={[1.05, 0.16, 20, 90, 0.001]} />
          <meshStandardMaterial color={macro.color} emissive={macro.color} emissiveIntensity={1.3} roughness={0.35} />
        </mesh>
        <Html center style={{ ...labelStyle(macro.color), textAlign: 'center', lineHeight: 1.15 }} pointerEvents="none">
          <div style={{ fontSize: 20, fontWeight: 700 }}>{macro.value}</div>
          <div style={{ fontSize: 10, opacity: 0.8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{macro.label}</div>
        </Html>
      </Float>
    </group>
  );
}

function FuelRings({ y }) {
  return (
    <group position={[0, y, 0]}>
      {macros.map((m, i) => (
        <FuelRing key={m.key} macro={m} index={i} count={macros.length} />
      ))}
      <pointLight position={[0, 0, 5]} intensity={5} distance={26} color={EMERALD} />
    </group>
  );
}

function labelStyle(color) {
  return {
    color,
    font: '600 12px ui-monospace, "SF Mono", Menlo, Consolas, monospace',
    letterSpacing: '0.04em',
    textShadow: '0 1px 8px rgba(0,0,0,0.85)',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  };
}

/* ---------- The Canvas ---------- */
export default function World({ scrollRef, completion }) {
  const sceneOf = (name) => {
    const i = SECTIONS.findIndex((s) => s.scene === name);
    return sceneY(i);
  };
  return (
    <Canvas
      className="world-canvas"
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 9.5], fov: 50, near: 0.1, far: 400 }}
    >
      <color attach="background" args={['#05100c']} />
      <fog attach="fog" args={['#05100c', 14, 42]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 10, 6]} intensity={0.8} />

      <CameraRig scrollRef={scrollRef} />
      <Backdrop />

      <HeroCore y={sceneOf('hero')} completion={completion} />
      <BodyComposition y={sceneOf('composition')} />
      <JourneySlope y={sceneOf('journey')} />
      <FuelRings y={sceneOf('targets')} />

      <EffectComposer disableNormalPass>
        <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.18} luminanceSmoothing={0.9} radius={0.7} />
        <Vignette eskil={false} offset={0.15} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
