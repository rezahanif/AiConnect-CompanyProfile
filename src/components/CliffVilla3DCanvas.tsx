import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface CliffVilla3DCanvasProps {
  pulseBurst?: number
  simStatus?: 'idle' | 'scanning_gis' | 'fea_solving' | 'bim_assembling' | 'converged'
  simProgress?: number
}

// Crisp Diamond Optical Starlight / Bokeh Texture (matching Hero & Gear)
function createParticleTexture(): THREE.CanvasTexture | null {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // Crisp Diamond Optical Starlight / Bokeh Texture (matching Hero & Gear)
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)')
  gradient.addColorStop(0.12, 'rgba(230, 248, 255, 0.90)') // luminous ice white core
  gradient.addColorStop(0.28, 'rgba(120, 215, 255, 0.55)') // radiant celestial cyan
  gradient.addColorStop(0.55, 'rgba(40, 130, 235, 0.18)')  // electric sky
  gradient.addColorStop(0.80, 'rgba(15, 45, 140, 0.03)')   // deep midnight indigo
  gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export function CliffVilla3DCanvas({
  pulseBurst = 0,
  simStatus = 'idle',
  simProgress = 0,
}: CliffVilla3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const uniformsRef = useRef<{
    uTime: { value: number }
    uProgress: { value: number }
    uFloorAssemble: { value: number }
    uPulseBurst: { value: number }
    uHoverOffset: { value: THREE.Vector2 }
  }>({
    uTime: { value: 0 },
    uProgress: { value: 1.0 },
    uFloorAssemble: { value: 1.0 },
    uPulseBurst: { value: 0 },
    uHoverOffset: { value: new THREE.Vector2(0, 0) },
  })

  const targetProgressRef = useRef(1.0)

  // Synchronize simulation progress target with shader uniforms
  useEffect(() => {
    const u = uniformsRef.current
    u.uPulseBurst.value = pulseBurst

    if (simStatus === 'idle') {
      targetProgressRef.current = 1.0
    } else {
      // 0% - 100% maps to elevation 0.0 to 1.0 rising continuously
      targetProgressRef.current = Math.min(1.0, simProgress / 100.0)
    }
  }, [simStatus, simProgress, pulseBurst])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x06080d, 0.032)

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    // Isometric three-quarter architectural perspective
    camera.position.set(5.8, 3.8, 6.8)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const particleTexture = createParticleTexture()

    // -------------------------------------------------------------------------
    // Procedural Clean Building Structural Frame (Autodesk Revit BIM Skeleton)
    // -------------------------------------------------------------------------
    // 5 Stories: Columns, Girders, Perimeter Beams, Joists, Bracing & Slabs
    const posList: number[] = []
    const colList: number[] = []
    const sizeList: number[] = []
    const floorIndexList: number[] = [] // 0: foundation, 1..5: floors
    const heightNormList: number[] = []
    const memberTypeList: number[] = [] // 0: footing/node, 1: column, 2: beam, 3: slab/brace
    const phaseList: number[] = []

    const addPoint = (
      x: number,
      y: number,
      z: number,
      color: THREE.Color,
      size: number,
      floorIdx: number,
      memberType: number
    ) => {
      posList.push(x, y, z)
      colList.push(color.r, color.g, color.b)
      sizeList.push(size)
      floorIndexList.push(floorIdx)
      const hNorm = Math.max(0.0, Math.min(1.0, (y - (-2.15)) / (2.95 - (-2.15))))
      heightNormList.push(hNorm)
      memberTypeList.push(memberType)
      phaseList.push(Math.random())
    }

    // High-Tech Vivid Revit Color Palette
    const cRevitBlue = new THREE.Color('#4f96ff')   // Vivid luminous sapphire blue
    const cElectricSky = new THREE.Color('#38bdf8') // Highlight beam electric cyan
    const cDiamondWhite = new THREE.Color('#ffffff')// Brilliant starlight white
    const cCoreIndigo = new THREE.Color('#93c5fd')  // Luminous light sky core

    // Grid Dimensions: 4 columns in X, 3 columns in Z, 5 levels in Y
    const gridX = [-2.1, -0.7, 0.7, 2.1]
    const gridZ = [-1.4, 0.0, 1.4]
    const floorHeights = [-2.0, -1.0, 0.0, 1.0, 2.0, 2.9] // Foundation (-2.0) to Roof (2.9)

    // 1. Foundation Footings (Orthogonal Rebar Mesh Mat - Tulangan Pondasi Tapak)
    gridX.forEach((gx) => {
      gridZ.forEach((gz) => {
        const padExtent = 0.20
        const fy = floorHeights[0] - 0.12
        for (let dx = -padExtent; dx <= padExtent + 0.01; dx += 0.08) {
          for (let dz = -padExtent; dz <= padExtent + 0.01; dz += 0.08) {
            const isCorner = Math.abs(dx) > 0.15 && Math.abs(dz) > 0.15
            addPoint(
              gx + dx,
              fy,
              gz + dz,
              isCorner ? cDiamondWhite : cElectricSky,
              isCorner ? 0.068 : 0.048,
              0,
              0
            )
          }
        }
      })
    })

    // 2. Vertical Structural Columns (12 Rebar Cage Columns - Rangka Besi Kolom Bertulang)
    // 4 longitudinal corner steel bars + intermediate face bars + horizontal tie stirrups (sengkang)
    const colHalf = 0.060 // column cage profile: 0.12m x 0.12m
    const cornerOffsets = [
      [-colHalf, -colHalf],
      [colHalf, -colHalf],
      [colHalf, colHalf],
      [-colHalf, colHalf],
    ]

    gridX.forEach((gx) => {
      gridZ.forEach((gz) => {
        const yStart = floorHeights[0]
        const yEnd = floorHeights[5]
        const yTotal = yEnd - yStart

        // 2a. Longitudinal Vertical Rebar Rods (4 Corner Steel Bars per Column)
        const vertSteps = 60 // ~0.08m vertical spacing between rebar nodes
        for (let i = 0; i <= vertSteps; i++) {
          const u = i / vertSteps
          const cy = yStart + u * yTotal
          const currentFloor = Math.min(5, Math.floor(u * 5) + 1)
          const isJoint = floorHeights.some((fh) => Math.abs(cy - fh) < 0.08)

          // 4 Corner vertical steel bars
          cornerOffsets.forEach(([ox, oz]) => {
            addPoint(
              gx + ox,
              cy,
              gz + oz,
              isJoint ? cDiamondWhite : cElectricSky,
              isJoint ? 0.076 : 0.054,
              currentFloor,
              1
            )
          })

          // Intermediate face rebar dots (midpoints of the 4 faces) every 2 steps
          if (i % 2 === 0) {
            addPoint(gx, cy, gz - colHalf, cRevitBlue, 0.046, currentFloor, 1)
            addPoint(gx, cy, gz + colHalf, cRevitBlue, 0.046, currentFloor, 1)
            addPoint(gx - colHalf, cy, gz, cRevitBlue, 0.046, currentFloor, 1)
            addPoint(gx + colHalf, cy, gz, cRevitBlue, 0.046, currentFloor, 1)
          }
        }

        // 2b. Horizontal Column Ties / Stirrups (Sengkang Kolom / Beugel)
        // Authentic structural tie hoops wrapping around the vertical bars every ~0.18m
        const stirrupSpacing = 0.18
        for (let sy = yStart + 0.06; sy <= yEnd - 0.04; sy += stirrupSpacing) {
          const uFloor = (sy - yStart) / yTotal
          const currentFloor = Math.min(5, Math.floor(uFloor * 5) + 1)
          const isJointZone = floorHeights.some((fh) => Math.abs(sy - fh) < 0.16)
          const tieColor = isJointZone ? cDiamondWhite : cElectricSky
          const tieSize = isJointZone ? 0.052 : 0.044

          // 4 mid-edge points connecting the 4 corner bars into a square hoop
          addPoint(gx, sy, gz - colHalf, tieColor, tieSize, currentFloor, 1)
          addPoint(gx, sy, gz + colHalf, tieColor, tieSize, currentFloor, 1)
          addPoint(gx - colHalf, sy, gz, tieColor, tieSize, currentFloor, 1)
          addPoint(gx + colHalf, sy, gz, tieColor, tieSize, currentFloor, 1)
        }

        // 2c. Foundation Dowels / Anchor Hooks (Stek Tulangan ke Pondasi)
        cornerOffsets.forEach(([ox, oz]) => {
          addPoint(
            gx + ox * 1.5,
            floorHeights[0] - 0.08,
            gz + oz * 1.5,
            cDiamondWhite,
            0.065,
            0,
            0
          )
        })
      })
    })

    // 3. Horizontal Floor Framing (Primary Girders & Secondary Beams at each floor)
    for (let f = 1; f < floorHeights.length; f++) {
      const fy = floorHeights[f]
      const floorIdx = f

      // Longitudinal Girders (along X axis)
      gridZ.forEach((gz) => {
        const steps = 60
        for (let i = 0; i <= steps; i++) {
          const u = i / steps
          const bx = gridX[0] + u * (gridX[gridX.length - 1] - gridX[0])
          const isNode = gridX.some((gx) => Math.abs(bx - gx) < 0.08)
          addPoint(
            bx,
            fy,
            gz,
            isNode ? cDiamondWhite : cElectricSky,
            isNode ? 0.082 : 0.054,
            floorIdx,
            2
          )

          // Top and bottom girder rebar chords every 3 steps
          if (i % 3 === 0 && !isNode) {
            addPoint(bx, fy + 0.032, gz, cRevitBlue, 0.044, floorIdx, 2)
            addPoint(bx, fy - 0.032, gz, cRevitBlue, 0.044, floorIdx, 2)
          }
        }
      })

      // Transverse Beams (along Z axis)
      gridX.forEach((gx) => {
        const steps = 40
        for (let i = 0; i <= steps; i++) {
          const u = i / steps
          const bz = gridZ[0] + u * (gridZ[gridZ.length - 1] - gridZ[0])
          const isNode = gridZ.some((gz) => Math.abs(bz - gz) < 0.08)
          addPoint(
            gx,
            fy,
            bz,
            isNode ? cDiamondWhite : cElectricSky,
            isNode ? 0.082 : 0.054,
            floorIdx,
            2
          )
        }
      })

      // Intermediate Secondary Floor Joists (Sub-framing)
      for (let span = 0; span < gridX.length - 1; span++) {
        const xMid = (gridX[span] + gridX[span + 1]) * 0.5
        const steps = 28
        for (let i = 0; i <= steps; i++) {
          const u = i / steps
          const bz = gridZ[0] + u * (gridZ[gridZ.length - 1] - gridZ[0])
          addPoint(xMid, fy, bz, cElectricSky.clone().lerp(cDiamondWhite, 0.25), 0.046, floorIdx, 2)
        }
      }

      // Perimeter Floor Slab Edge (Clean boundary rebar)
      for (let x = gridX[0]; x <= gridX[gridX.length - 1]; x += 0.14) {
        for (let z = gridZ[0]; z <= gridZ[gridZ.length - 1]; z += 0.14) {
          const isPerimeter =
            Math.abs(x - gridX[0]) < 0.09 ||
            Math.abs(x - gridX[gridX.length - 1]) < 0.09 ||
            Math.abs(z - gridZ[0]) < 0.09 ||
            Math.abs(z - gridZ[gridZ.length - 1]) < 0.09

          if (isPerimeter) {
            addPoint(
              x,
              fy + 0.02,
              z,
              cDiamondWhite,
              0.054,
              floorIdx,
              3
            )
          }
        }
      }

      // 4. Central Structural Core / Shear Wall Box (around center bay)
      const coreXMin = gridX[1]
      const coreXMax = gridX[2]
      const coreZMin = -0.5
      const coreZMax = 0.5

      if (f < floorHeights.length - 1) {
        for (let dy = 0; dy <= 1.0; dy += 0.15) {
          const cy = fy + dy
          for (let u = 0; u <= 1; u += 0.12) {
            addPoint(coreXMin + u * (coreXMax - coreXMin), cy, coreZMin, cCoreIndigo, 0.050, floorIdx, 3)
            addPoint(coreXMin + u * (coreXMax - coreXMin), cy, coreZMax, cCoreIndigo, 0.050, floorIdx, 3)
          }
        }
      }

      // 5. Diagonal Steel Wind Bracing (X-Bracing on end bays)
      if (f < floorHeights.length - 1) {
        const yBottom = fy
        const yTop = floorHeights[f + 1]
        ;[gridX[0], gridX[gridX.length - 1]].forEach((bx) => {
          const z0 = gridZ[0]
          const z1 = gridZ[1]
          const steps = 22
          for (let i = 0; i <= steps; i++) {
            const u = i / steps
            addPoint(bx, yBottom + u * (yTop - yBottom), z0 + u * (z1 - z0), cElectricSky, 0.054, floorIdx, 3)
            addPoint(bx, yBottom + u * (yTop - yBottom), z1 - u * (z1 - z0), cElectricSky, 0.054, floorIdx, 3)
          }
        })
      }
    }

    // Convert to Three.js BufferGeometry
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(posList, 3))
    geometry.setAttribute('aColor', new THREE.Float32BufferAttribute(colList, 3))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizeList, 1))
    geometry.setAttribute('aFloor', new THREE.Float32BufferAttribute(floorIndexList, 1))
    geometry.setAttribute('aHeightNorm', new THREE.Float32BufferAttribute(heightNormList, 1))
    geometry.setAttribute('aMemberType', new THREE.Float32BufferAttribute(memberTypeList, 1))
    geometry.setAttribute('aPhase', new THREE.Float32BufferAttribute(phaseList, 1))

    // -------------------------------------------------------------------------
    // Custom Shader Material: Continuous 60 FPS BIM Extrusion & Starlight Glow
    // -------------------------------------------------------------------------
    const vertexShader = `
      attribute vec3 aColor;
      attribute float size;
      attribute float aFloor;
      attribute float aHeightNorm;
      attribute float aMemberType;
      attribute float aPhase;

      uniform float uTime;
      uniform float uProgress;
      uniform float uPulseBurst;
      uniform vec2 uHoverOffset;

      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vec3 pos = position;

        // Interactive mouse tilt parallax
        pos.x += uHoverOffset.x * 0.35;
        pos.y += uHoverOffset.y * 0.35;

        // Continuous 60 FPS Height Extrusion Wave:
        // uProgress smoothly sweeps from 0.0 to 1.0
        float delta = aHeightNorm - uProgress;
        float assembleFactor = smoothstep(0.06, -0.01, delta);

        // Rising ethereal starlight dust for unbuilt levels above the wave
        float ghostLift = (1.0 - assembleFactor) * 0.65 + sin(uTime * 2.2 + aPhase * 6.28) * 0.04;
        vec3 ghostPos = position + vec3(
          sin(aPhase * 6.28) * 0.12 * (1.0 - assembleFactor),
          ghostLift,
          cos(aPhase * 6.28) * 0.12 * (1.0 - assembleFactor)
        );
        pos = mix(ghostPos, position, assembleFactor);

        // Pulse burst micro-shiver
        if (uPulseBurst > 0.5) {
          float pulseWave = sin(uTime * 12.0 + aPhase * 6.28) * 0.02;
          pos.y += pulseWave;
        }

        // Color determination & laser crystallization wave
        vec3 col = aColor;
        float scanGlow = exp(-pow(delta * 24.0, 2.0)) * (1.0 - smoothstep(0.96, 1.0, uProgress));
        
        col = mix(aColor * 0.45, aColor, assembleFactor);
        col = mix(col, vec3(0.40, 1.25, 1.60), scanGlow * 0.95);

        float alpha = mix(0.10, 0.96, assembleFactor);
        alpha = max(alpha, scanGlow * 0.98);

        // Subtle organic starlight twinkle
        float twinkle = sin(uTime * 2.5 + aPhase * 6.28) * 0.15;
        col += vec3(twinkle * 0.18);

        vColor = col * 1.45;
        vAlpha = alpha;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        float sizeMultiplier = aMemberType < 0.5 ? 1.15 : (aMemberType < 1.5 ? 1.08 : 1.00);
        gl_PointSize = size * sizeMultiplier * (1150.0 / -mvPosition.z);
        gl_PointSize = clamp(gl_PointSize, 2.6, 7.2);
        gl_Position = projectionMatrix * mvPosition;
      }
    `

    const fragmentShader = `
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        if (vAlpha < 0.005) discard;
        vec4 tex = texture2D(pointTexture, gl_PointCoord);
        gl_FragColor = vec4(vColor, vAlpha) * tex;
      }
    `

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: uniformsRef.current.uTime,
        uProgress: uniformsRef.current.uProgress,
        uFloorAssemble: uniformsRef.current.uFloorAssemble,
        uPulseBurst: uniformsRef.current.uPulseBurst,
        uHoverOffset: uniformsRef.current.uHoverOffset,
        pointTexture: { value: particleTexture },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const pointCloud = new THREE.Points(geometry, material)
    pointCloud.scale.set(0.61, 0.61, 0.61)
    pointCloud.position.set(0.26, -0.05, 0.0)
    scene.add(pointCloud)

    // Holographic ground elevation grid in deep cyan
    const gridHelper = new THREE.GridHelper(10, 20, 0x0284c7, 0x0369a1)
    gridHelper.scale.set(0.61, 0.61, 0.61)
    gridHelper.position.set(0.26, -1.62, 0.0)
    // @ts-ignore
    gridHelper.material.transparent = true
    // @ts-ignore
    gridHelper.material.opacity = 0.12
    scene.add(gridHelper)

    // -------------------------------------------------------------------------
    // Mouse Parallax & Smooth Animation Loop
    // -------------------------------------------------------------------------
    let targetRotY = 0.42
    let targetRotX = 0.16
    let currentRotY = 0.42
    let currentRotX = 0.16

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetRotY = 0.42 + nx * 0.28
      targetRotX = 0.16 + ny * 0.18
      uniformsRef.current.uHoverOffset.value.set(nx * 0.2, ny * 0.2)
    }

    window.addEventListener('mousemove', handleMouseMove)

    let animId: number
    const clock = new THREE.Clock()
    let smoothProgress = 1.0

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()
      uniformsRef.current.uTime.value = elapsed

      // Scroll-driven deconstruct removed: structure stays built.
      const targetP = targetProgressRef.current
      smoothProgress += (targetP - smoothProgress) * 0.12
      uniformsRef.current.uProgress.value = smoothProgress

      // Damped smooth rotation
      currentRotY += (targetRotY - currentRotY) * 0.04
      currentRotX += (targetRotX - currentRotX) * 0.04

      // Gentle continuous ambient orbit
      const ambientOrbit = Math.sin(elapsed * 0.35) * 0.08
      pointCloud.rotation.y = currentRotY + ambientOrbit
      pointCloud.rotation.x = currentRotX
      pointCloud.position.y = -0.05 + Math.sin(elapsed * 0.5) * 0.02

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
      style={{ touchAction: 'none' }}
    />
  )
}
