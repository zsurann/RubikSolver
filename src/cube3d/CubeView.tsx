import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { useSettingsOptional } from '../app/settings'
import { COLOR_SYMBOL, STICKER_HEX } from '../cube/colors'
import { STICKERS, type Face, type Move, type State } from '../cube/cube'
import { arrowFor, inLayer, moveInfo, type ArrowPlacement, type Vec3 } from './moves'
import type { Job } from './player'

const reducedMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

type Props = {
  cube: State
  current: Job | null
  onDone: (id: number) => void
  pending?: Move | null
  arrows?: boolean
  glow?: boolean
  /** cambia valore per riportare il cubo alla vista standard */
  viewKey?: number
  label?: string
  /** adesivi da far lampeggiare (es. incerti dopo la scansione) */
  blink?: number[]
  /** tocco su un adesivo (indice facelet); se assente il cubo non è cliccabile */
  onStickerClick?: (i: number) => void
}

type Drag = { active: boolean; x: number; y: number; vx: number; vy: number; pendX: number; pendY: number }

export function CubeView({ cube, current, onDone, pending, arrows = true, glow = true, viewKey = 0, label, blink, onStickerClick }: Props) {
  const drag = useRef<Drag>({ active: false, x: 0, y: 0, vx: 0, vy: 0, pendX: 0, pendY: 0 })
  const { colorblind, lightGraphics } = useSettingsOptional()
  return (
    <div
      role="img"
      aria-label={label}
      style={{ width: '100%', height: '100%', touchAction: 'none', cursor: 'grab' }}
      onPointerDown={(e) => {
        Object.assign(drag.current, { active: true, x: e.clientX, y: e.clientY, vx: 0, vy: 0 })
      }}
      onPointerMove={(e) => {
        const d = drag.current
        if (!d.active) return
        // cattura il puntatore solo quando è davvero un trascinamento, così i tocchi restano clic sugli adesivi
        if (!e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.setPointerCapture(e.pointerId)
        d.pendX += e.clientX - d.x
        d.pendY += e.clientY - d.y
        Object.assign(d, { vx: e.clientX - d.x, vy: e.clientY - d.y, x: e.clientX, y: e.clientY })
      }}
      onPointerUp={() => (drag.current.active = false)}
      onPointerCancel={() => (drag.current.active = false)}
    >
      <Canvas camera={{ position: [5.2, 4.6, 7.4], fov: 32 }} dpr={lightGraphics ? 1 : [1, 2]} gl={{ antialias: !lightGraphics }}>
        {!lightGraphics && <AutoQuality />}
        <hemisphereLight args={[0xffffff, 0x445066, 1.6]} />
        <directionalLight position={[4, 8, 6]} intensity={1.8} />
        <directionalLight position={[-6, 2, -4]} intensity={0.6} color={0xbfd4ff} />
        {!lightGraphics && <Shadow />}
        <Scene {...{ cube, current, onDone, pending, arrows, glow, viewKey, drag, blink, onStickerClick, symbols: colorblind }} />
      </Canvas>
    </div>
  )
}

/** Se il telefono fatica (sotto ~25 fotogrammi al secondo), abbassa la risoluzione. */
function AutoQuality() {
  const setDpr = useThree((st) => st.setDpr)
  const stats = useRef({ frames: 0, time: 0, done: false })
  useFrame((_, delta) => {
    const st = stats.current
    if (st.done) return
    st.frames++
    st.time += delta
    if (st.frames < 90) return
    if (st.time / st.frames > 0.04) setDpr(1)
    st.done = true
  })
  return null
}

function Shadow() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const g = c.getContext('2d')!
    const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64)
    gr.addColorStop(0, 'rgba(0,0,0,.45)')
    gr.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = gr
    g.fillRect(0, 0, 128, 128)
    return new THREE.CanvasTexture(c)
  }, [])
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-2.35}>
      <planeGeometry args={[5.5, 5.5]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  )
}

function roundedRect(s: number, r: number) {
  const h = s / 2, sh = new THREE.Shape()
  sh.moveTo(-h + r, -h); sh.lineTo(h - r, -h); sh.quadraticCurveTo(h, -h, h, -h + r)
  sh.lineTo(h, h - r); sh.quadraticCurveTo(h, h, h - r, h); sh.lineTo(-h + r, h)
  sh.quadraticCurveTo(-h, h, -h, h - r); sh.lineTo(-h, -h + r); sh.quadraticCurveTo(-h, -h, -h + r, -h)
  return sh
}

// Geometrie e materiali condivisi da tutti i pezzi.
const bodyGeo = new THREE.BoxGeometry(0.97, 0.97, 0.97)
const stickerGeo = new THREE.ExtrudeGeometry(roundedRect(0.86, 0.1), {
  depth: 0.02, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 6,
})
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x111214, roughness: 0.35 })
const makeMats = () =>
  Object.fromEntries(
    Object.entries(STICKER_HEX).map(([f, c]) => [f, new THREE.MeshStandardMaterial({ color: c, roughness: 0.22, emissive: c, emissiveIntensity: 0 })]),
  ) as Record<Face | '?', THREE.MeshStandardMaterial>
const stickerMats = makeMats()
const glowMats = makeMats()
const blinkMats = makeMats()
const Z = new THREE.Vector3(0, 0, 1)

// Simboli per daltonici: una texture per colore, creata quando serve.
const symbolGeo = new THREE.PlaneGeometry(0.5, 0.5)
const symbolMats: Partial<Record<Face, THREE.MeshBasicMaterial>> = {}
function symbolMat(f: Face) {
  if (symbolMats[f]) return symbolMats[f]
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  g.fillStyle = f === 'D' || f === 'U' ? '#1b2230' : '#ffffff'
  g.font = 'bold 96px system-ui, sans-serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(COLOR_SYMBOL[f], 64, 70)
  return (symbolMats[f] = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }))
}

const CUBIE_POS: Vec3[] = []
for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) if (x || y || z) CUBIE_POS.push([x, y, z])
const STICKERS_OF = CUBIE_POS.map((p) =>
  STICKERS.map((s, i) => ({ ...s, i })).filter((s) => s.pos.every((v, k) => v === p[k])).map((s) => ({
    i: s.i,
    position: new THREE.Vector3(...s.n).multiplyScalar(0.485),
    quaternion: new THREE.Quaternion().setFromUnitVectors(Z, new THREE.Vector3(...s.n)),
  })),
)

type CubieProps = { idx: number; cube: State; glowing: boolean; blink?: Set<number>; onStickerClick?: (i: number) => void; symbols?: boolean }

function Cubie({ idx, cube, glowing, blink, onStickerClick, symbols }: CubieProps) {
  return (
    <group position={CUBIE_POS[idx]}>
      <mesh geometry={bodyGeo} material={bodyMat} />
      {STICKERS_OF[idx].map((s) => (
        <mesh
          key={s.i}
          geometry={stickerGeo}
          material={(blink?.has(s.i) ? blinkMats : glowing ? glowMats : stickerMats)[cube[s.i] as Face | '?']}
          position={s.position}
          quaternion={s.quaternion}
          onClick={onStickerClick && ((e) => {
            if (e.delta > 6) return // era un trascinamento
            e.stopPropagation()
            onStickerClick(s.i)
          })}
        >
          {symbols && cube[s.i] !== '?' && <mesh geometry={symbolGeo} material={symbolMat(cube[s.i] as Face)} position-z={0.04} />}
        </mesh>
      ))}
    </group>
  )
}

type SceneProps = Omit<Props, 'label'> & { drag: MutableRefObject<Drag>; symbols: boolean }

function Scene({ cube, current, onDone, pending, arrows, glow, viewKey, drag, blink, onStickerClick, symbols }: SceneProps) {
  const blinkSet = useMemo(() => new Set(blink), [blink])
  const root = useRef<THREE.Group>(null!)
  const turning = useRef<THREE.Group>(null!)
  const anim = useRef<{ id: number; start: number } | null>(null)
  const view = useRef<{ from: THREE.Quaternion; start: number } | null>(null)
  const info = current ? moveInfo(current.move) : null
  const glowInfo = glow && !current && pending ? moveInfo(pending) : null

  useEffect(() => {
    if (viewKey) view.current = { from: root.current.quaternion.clone(), start: performance.now() }
  }, [viewKey])

  const camRight = useMemo(() => new THREE.Vector3(), [])
  const q = useMemo(() => new THREE.Quaternion(), [])
  const Y = useMemo(() => new THREE.Vector3(0, 1, 0), [])

  useFrame(({ camera }) => {
    const now = performance.now()
    // animazione della mossa in corso
    if (current && info && turning.current) {
      if (anim.current?.id !== current.id) anim.current = { id: current.id, start: now }
      const dur = current.ms * (info.turns === 2 ? 1.5 : 1) * (reducedMotion ? 1.3 : 1)
      const t = Math.min(1, (now - anim.current.start) / dur)
      turning.current.rotation[info.axis] = info.angle * ease(t)
      if (t >= 1) onDone(current.id)
    }
    // trascinamento con inerzia
    const d = drag.current
    let dx = d.pendX, dy = d.pendY
    d.pendX = d.pendY = 0
    if (!d.active && Math.abs(d.vx) + Math.abs(d.vy) > 0.05) {
      dx += d.vx; dy += d.vy
      d.vx *= 0.92; d.vy *= 0.92
    }
    if (dx || dy) {
      view.current = null
      camRight.setFromMatrixColumn(camera.matrixWorld, 0)
      root.current.quaternion.premultiply(q.setFromAxisAngle(Y, dx * 0.009))
      root.current.quaternion.premultiply(q.setFromAxisAngle(camRight, dy * 0.009))
    }
    // ritorno alla vista standard
    if (view.current) {
      const k = Math.min(1, (now - view.current.start) / 500)
      root.current.quaternion.copy(view.current.from).slerp(new THREE.Quaternion(), ease(k))
      if (k >= 1) view.current = null
    }
    // pulsazione di freccia e strato evidenziato
    const pulse = reducedMotion ? 1 : 0.5 + 0.5 * Math.sin(now / 260)
    for (const m of Object.values(glowMats)) m.emissiveIntensity = 0.1 + 0.22 * pulse
    const blinkOn = reducedMotion ? 0.35 : 0.5 + 0.5 * Math.sin(now / 160)
    for (const m of Object.values(blinkMats)) m.emissiveIntensity = 0.55 * blinkOn
    arrowMat.color.copy(DIM).lerp(WHITE, pulse)
  })

  const still: number[] = [], moving: number[] = []
  CUBIE_POS.forEach((p, i) => (info && inLayer(p, info) ? moving : still).push(i))

  return (
    <group ref={root}>
      {still.map((i) => (
        <Cubie key={i} idx={i} cube={cube} glowing={!!glowInfo && inLayer(CUBIE_POS[i], glowInfo)} blink={blinkSet} onStickerClick={onStickerClick} symbols={symbols} />
      ))}
      {current && (
        <group ref={turning} key={current.id}>
          {moving.map((i) => <Cubie key={i} idx={i} cube={cube} glowing={false} symbols={symbols} />)}
        </group>
      )}
      {arrows && !current && pending && <Arrow placement={arrowFor(pending)} />}
    </group>
  )
}

// Frecce: bianche con bordo scuro, disegnate sopra al cubo.
const arrowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false })
const outlineMat = new THREE.MeshBasicMaterial({ color: 0x0b0e14, depthTest: false })
const WHITE = new THREE.Color(0xffffff), DIM = new THREE.Color(0xc9d2e3)
const headShape = new THREE.Shape()
headShape.moveTo(-0.28, 0); headShape.lineTo(0.28, 0); headShape.lineTo(0, 0.42); headShape.lineTo(-0.28, 0)
const headGeo = new THREE.ExtrudeGeometry(headShape, { depth: 0.03, bevelEnabled: false })
const shaftGeo = new THREE.BoxGeometry(0.15, 1.7, 0.03)
const ARC_R = 0.95, ARC = Math.PI * 1.45, ARC_START = Math.PI * 0.3
const arcGeo = new THREE.TorusGeometry(ARC_R, 0.07, 8, 48, ARC)
const arcOutlineGeo = new THREE.TorusGeometry(ARC_R, 0.11, 8, 48, ARC)

function Arrow({ placement }: { placement: ArrowPlacement }) {
  const layers = [
    { mat: outlineMat, order: 2, shaft: [1.6, 1.05, 1] as Vec3, head: 1.25, z: -0.02 },
    { mat: arrowMat, order: 3, shaft: [1, 1, 1] as Vec3, head: 1, z: 0 },
  ]
  if (placement.kind === 'straight') {
    const d = new THREE.Vector3(...placement.dir), n = new THREE.Vector3(...placement.normal)
    const qn = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(d.clone().cross(n), d, n))
    const heads = placement.twice ? [0.55, 0.15] : [0.55]
    return (
      <group position={placement.pos} quaternion={qn}>
        {layers.map((l) => (
          <group key={l.order} position-z={l.z}>
            <mesh geometry={shaftGeo} material={l.mat} renderOrder={l.order} position-y={-0.25} scale={l.shaft} />
            {heads.map((y) => (
              <mesh key={y} geometry={headGeo} material={l.mat} renderOrder={l.order} position-y={y} scale={[l.head, l.head, 1]} />
            ))}
          </group>
        ))}
      </group>
    )
  }
  const R = ARC_R, arc = ARC, start = ARC_START
  const heads = placement.twice ? [0, 0.5] : [0]
  return (
    <group position={placement.pos}>
      {layers.map((l) => (
        <group key={l.order} position-z={l.z}>
          <mesh geometry={l.order === 2 ? arcOutlineGeo : arcGeo} material={l.mat} renderOrder={l.order} rotation-z={start} />
          {heads.map((off) => {
            const a = placement.sign > 0 ? start + arc - off : start + off
            return (
              <mesh key={off} geometry={headGeo} material={l.mat} renderOrder={l.order} position={[R * Math.cos(a), R * Math.sin(a), 0]}
                rotation-z={placement.sign > 0 ? a : a + Math.PI} scale={[l.head, l.head, 1]} />
            )
          })}
        </group>
      ))}
    </group>
  )
}
