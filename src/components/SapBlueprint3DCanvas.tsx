import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface SapBlueprint3DCanvasProps {
  pulseBurst?: number
  simStatus?: 'idle' | 'scanning_gis' | 'fea_meshing' | 'seismic_solving' | 'converged'
  simProgress?: number
}

// Crisp Diamond Optical Starlight / Bokeh Texture (matching Hero, Gear, and Revit)
function createParticleTexture(): THREE.CanvasTexture | null {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)')
  gradient.addColorStop(0.12, 'rgba(230, 248, 255, 0.95)') // luminous ice-white core
  gradient.addColorStop(0.28, 'rgba(120, 220, 255, 0.65)') // celestial cyan
  gradient.addColorStop(0.55, 'rgba(30, 140, 245, 0.22)')  // electric sky blue
  gradient.addColorStop(0.80, 'rgba(10, 40, 130, 0.05)')   // deep blueprint indigo
  gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export function SapBlueprint3DCanvas({
  pulseBurst = 0,
  simStatus = 'idle',
  simProgress = 0,
}: SapBlueprint3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const uniformsRef = useRef<{
    uTime: { value: number }
    uProgress: { value: number }
    uPulseBurst: { value: number }
    uHoverOffset: { value: THREE.Vector2 }
    uSeismicAmp: { value: number }
  }>({
    uTime: { value: 0 },
    uProgress: { value: 1.0 },
    uPulseBurst: { value: 0 },
    uHoverOffset: { value: new THREE.Vector2(0, 0) },
    uSeismicAmp: { value: 0 },
  })

  const targetProgressRef = useRef(1.0)
  const targetSeismicRef = useRef(0.0)

  // Synchronize simulation progress target with shader uniforms
  useEffect(() => {
    const u = uniformsRef.current
    u.uPulseBurst.value = pulseBurst

    if (simStatus === 'idle') {
      targetProgressRef.current = 1.0
      targetSeismicRef.current = 0.0
    } else if (simStatus === 'scanning_gis') {
      targetProgressRef.current = Math.min(1.0, simProgress / 100.0)
      targetSeismicRef.current = 0.0
    } else if (simStatus === 'fea_meshing') {
      targetProgressRef.current = Math.min(1.0, simProgress / 100.0)
      targetSeismicRef.current = 0.15
    } else if (simStatus === 'seismic_solving') {
      targetProgressRef.current = Math.min(1.0, simProgress / 100.0)
      targetSeismicRef.current = 1.0
    } else if (simStatus === 'converged') {
      targetProgressRef.current = 1.0
      targetSeismicRef.current = 0.05
    }
  }, [simStatus, simProgress, pulseBurst])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x06080d, 0.032)

    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    // Isometric 3/4 aerial view for topographic terrain & civil blueprint
    camera.position.set(5.8, 4.4, 6.4)
    camera.lookAt(0.2, -0.15, 0)

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
    // Dramatic Topographic Relief Function (Dataran Tinggi vs Dataran Rendah)
    // Highlands (Summit & Ridge): Elevation +1.7m (glowing, catching light)
    // Lowlands (Valley & Ravine): Elevation -1.3m (deep, shadowed in darkness)
    // -------------------------------------------------------------------------
    const getTerrainHeight = (x: number, z: number): number => {
      // 1. Continental Macro Slope: High Ridge (Top-Right) to Deep Valley (Bottom-Left)
      const baseSlope = -0.38 * x + 0.32 * z

      // 2. High Mountain Summit & Promontory Peak (Dataran Tinggi) - prominent crest reaching +1.75m
      const peak1 = 1.38 * Math.exp(-((x - 1.15) ** 2 + (z + 0.95) ** 2) / 2.5)

      // 3. Secondary Mountain Ridge Spine running across the top flank
      const ridgeSpine = 0.68 * Math.exp(-((x * 0.72 + z * 0.48 - 0.32) ** 2) / 1.5)

      // 4. Stepped Engineering Cut Terraces (Benches for civil stability & retaining walls)
      const benchDist = Math.sqrt((x + 0.2) ** 2 + (z + 0.3) ** 2)
      const bench1 = 0.38 * Math.exp(-(benchDist ** 2) / 2.1)

      // 5. Deep Escarpment Valley / Canyon Basin (Dataran Rendah) - sinks into shadows
      const ravine = -0.58 * Math.exp(-((x + 1.5) ** 2 + (z - 1.35) ** 2) / 2.6)

      // 6. Natural Geological Bedding Strata
      const strata = 0.05 * Math.sin(x * 3.2 + z * 1.8) + 0.035 * Math.cos(x * 1.8 - z * 3.4)

      return baseSlope + peak1 + ridgeSpine + bench1 + ravine + strata - 0.20
    }

    // Analytical Surface Normal for Physical Light Calculations
    const getTerrainNormal = (x: number, z: number): THREE.Vector3 => {
      const eps = 0.035
      const hL = getTerrainHeight(x - eps, z)
      const hR = getTerrainHeight(x + eps, z)
      const hD = getTerrainHeight(x, z - eps)
      const hU = getTerrainHeight(x, z + eps)

      const dx = (hR - hL) / (2 * eps)
      const dz = (hU - hD) / (2 * eps)

      return new THREE.Vector3(-dx, 1.0, -dz).normalize()
    }

    // Master Blueprint 3D Scene Group (scaled down ~20% for elegant breathable balance)
    const blueprintGroup = new THREE.Group()
    blueprintGroup.scale.set(0.52, 0.52, 0.52)
    blueprintGroup.position.set(0.22, -0.05, 0.0)
    scene.add(blueprintGroup)

    // -------------------------------------------------------------------------
    // Procedural 3D Topographic Blueprint & Geotechnical FEA Data Points
    // -------------------------------------------------------------------------
    const posList: number[] = []
    const colList: number[] = []
    const normList: number[] = []
    const sizeList: number[] = []
    const typeList: number[] = [] // 0: Blueprint Grid, 1: Contour Isoline, 2: FEA Soil Mesh, 3: Soil Nail Anchor
    const heightNormList: number[] = []
    const lightValList: number[] = []
    const phaseList: number[] = []

    const minElev = -1.35
    const maxElev = 1.75
    const elevRange = maxElev - minElev

    // Light Source Direction: Top-Left atmospheric beam (pointing down toward center-right)
    const lightDir = new THREE.Vector3(-0.55, 0.78, 0.30).normalize()

    const addPoint = (
      x: number,
      y: number,
      z: number,
      normal: THREE.Vector3,
      baseColor: THREE.Color,
      size: number,
      type: number,
      hNorm: number
    ) => {
      posList.push(x, y, z)
      normList.push(normal.x, normal.y, normal.z)

      // Light Physics Rule: Lambertian diffuse + Ambient Occlusion + Elevation Tint
      const diffuse = Math.max(0.0, normal.dot(lightDir))
      // Highlands have high sky exposure; valleys are self-occluded in shadow
      const ao = 0.10 + 0.28 * Math.pow(hNorm, 1.3)
      const direct = Math.pow(diffuse, 1.2) * (0.35 + 0.65 * hNorm)
      const peakSpecular = Math.pow(hNorm, 2.4) * Math.pow(diffuse, 2.2) * 0.45
      const totalLight = THREE.MathUtils.clamp(ao + direct + peakSpecular, 0.08, 1.0)

      // Color mapping: Gelap Terang according to light physics
      // Lowlands / shadow (totalLight < 0.25): Deep dark midnight indigo / oceanic navy
      // Highlands / sunlight (totalLight > 0.65): Brilliant celestial ice-cyan & diamond white
      let finalColor = baseColor.clone()
      if (type === 1 || type === 2) {
        if (totalLight < 0.28) {
          // Deep shadowed valley: dark steel navy
          finalColor.lerp(new THREE.Color(0x06182c), 0.72)
        } else if (totalLight > 0.62) {
          // Sunlit highland: radiant luminous cyan to diamond white
          const sunFactor = (totalLight - 0.62) / 0.38
          finalColor.lerp(new THREE.Color(0xffffff), sunFactor * 0.85)
        }
      }

      colList.push(finalColor.r, finalColor.g, finalColor.b)
      // Particle size scales with light: lit highlands bloom, shadowed valleys are fine delicate dust
      const dynamicSize = size * (0.75 + 0.55 * totalLight)
      sizeList.push(dynamicSize)
      typeList.push(type)
      heightNormList.push(Math.max(0.0, Math.min(1.0, hNorm)))
      lightValList.push(totalLight)
      phaseList.push(Math.random())
    }

    // --- 1. CAD / Blueprint Coordinate Datum Floor Grid (Y = -1.60) ---
    const gridSpan = 4.2
    const gridStep = 0.35
    const floorNormal = new THREE.Vector3(0, 1, 0)
    for (let x = -gridSpan; x <= gridSpan; x += gridStep) {
      for (let z = -gridSpan; z <= gridSpan; z += gridStep) {
        const isMajor = Math.abs(x % (gridStep * 4)) < 0.02 && Math.abs(z % (gridStep * 4)) < 0.02
        const isPerimeter =
          Math.abs(Math.abs(x) - gridSpan) < 0.02 || Math.abs(Math.abs(z) - gridSpan) < 0.02

        if (isMajor || isPerimeter) {
          addPoint(x, -1.60, z, floorNormal, new THREE.Color(0x38bdf8), 0.055, 0, 0.0)
        } else {
          addPoint(x, -1.60, z, floorNormal, new THREE.Color(0x041830), 0.032, 0, 0.0)
        }

        // Survey Datum Crosshairs (+) at key geodetic benchmarks
        if (isMajor) {
          const cross = 0.06
          addPoint(x - cross, -1.60, z, floorNormal, new THREE.Color(0x0284c7), 0.040, 0, 0.0)
          addPoint(x + cross, -1.60, z, floorNormal, new THREE.Color(0x0284c7), 0.040, 0, 0.0)
          addPoint(x, -1.60, z - cross, floorNormal, new THREE.Color(0x0284c7), 0.040, 0, 0.0)
          addPoint(x, -1.60, z + cross, floorNormal, new THREE.Color(0x0284c7), 0.040, 0, 0.0)
        }
      }
    }

    // --- 2. QGIS 3D Topographic Contour Isolines (Elevations -1.35m to +1.75m) ---
    const numContourLevels = 16
    const contourStep = elevRange / numContourLevels
    const terrainSpanX = 3.6
    const terrainSpanZ = 3.6
    const searchRes = 140

    // Continuous 3D vector lines for contour isolines
    const contourLinePositions: number[] = []
    const contourLineColors: number[] = []

    for (let level = 0; level <= numContourLevels; level++) {
      const targetY = minElev + level * contourStep
      const hNorm = (targetY - minElev) / elevRange
      const isIndexContour = level % 3 === 0 // Major index contour every 3rd line

      // Base color depends on elevation (Dataran Rendah = Deep Cyan/Teal, Dataran Tinggi = Luminous Diamond White)
      const baseContourCol = isIndexContour
        ? new THREE.Color(0xffffff).lerp(new THREE.Color(0x7dd3fc), 1.0 - hNorm * 0.5)
        : new THREE.Color(0x0284c7).lerp(new THREE.Color(0x38bdf8), hNorm)

      const ptSize = isIndexContour ? 0.068 : 0.048

      for (let ix = 0; ix < searchRes; ix++) {
        const x = -terrainSpanX + (ix / searchRes) * (terrainSpanX * 2)
        for (let iz = 0; iz < searchRes; iz++) {
          const z = -terrainSpanZ + (iz / searchRes) * (terrainSpanZ * 2)
          const h = getTerrainHeight(x, z)
          const diff = Math.abs(h - targetY)

          if (diff < 0.024) {
            const norm = getTerrainNormal(x, z)
            addPoint(x, targetY, z, norm, baseContourCol, ptSize, 1, hNorm)
          }
        }
      }
    }

    // --- 3. Dense Digital Elevation Surface LiDAR Points (QGIS Surface Cloud) ---
    const lidarDensity = 64
    for (let ix = 0; ix <= lidarDensity; ix++) {
      const u = ix / lidarDensity
      const x = -terrainSpanX + u * (terrainSpanX * 2)
      for (let iz = 0; iz <= lidarDensity; iz++) {
        const v = iz / lidarDensity
        const z = -terrainSpanZ + v * (terrainSpanZ * 2)
        const y = getTerrainHeight(x, z)
        const hNorm = (y - minElev) / elevRange
        const norm = getTerrainNormal(x, z)

        // Subtle gradient: Deep abyss in valleys to radiant celestial cyan on summits
        const surfCol = new THREE.Color(0x041830).lerp(new THREE.Color(0x38bdf8), Math.pow(hNorm, 1.1))
        addPoint(x, y, z, norm, surfCol, 0.038, 1, hNorm)
      }
    }

    // --- 4. SAP2000 Geotechnical Finite Element (FEA) Soil Mesh ---
    const feaGridX = 14
    const feaGridZ = 14
    const feaLayers = 5

    for (let ix = 0; ix < feaGridX; ix++) {
      const x = -2.8 + (ix / (feaGridX - 1)) * 5.6
      for (let iz = 0; iz < feaGridZ; iz++) {
        const z = -2.8 + (iz / (feaGridZ - 1)) * 5.6
        const surfaceY = getTerrainHeight(x, z)
        const bedrockY = -1.55
        const norm = getTerrainNormal(x, z)

        for (let layer = 1; layer <= feaLayers; layer++) {
          const depthRatio = layer / (feaLayers + 1)
          const nodeY = THREE.MathUtils.lerp(surfaceY, bedrockY, depthRatio)
          const hNorm = (nodeY - minElev) / elevRange

          const isShearZone = depthRatio > 0.25 && depthRatio < 0.65
          const nodeCol = isShearZone ? new THREE.Color(0xf59e0b) : new THREE.Color(0x041830)
          addPoint(x, nodeY, z, norm, nodeCol, 0.046, 2, hNorm)
        }
      }
    }

    // --- 5. Civil Engineering Slope Stabilization: Deep Soil Nails & Anchor Piles ---
    const anchorRows = [
      { x: -0.2, z: -0.6 },
      { x: 0.4, z: -0.4 },
      { x: 1.0, z: -0.2 },
      { x: -0.4, z: 0.2 },
      { x: 0.2, z: 0.4 },
      { x: 0.8, z: 0.6 },
      { x: 1.4, z: 0.8 },
      { x: 0.0, z: 1.1 },
      { x: 0.6, z: 1.3 },
    ]

    const nailLinePositions: number[] = []

    anchorRows.forEach(({ x, z }) => {
      const topY = getTerrainHeight(x, z)
      const drillLength = 1.45
      const angle = 0.61
      const steps = 18

      const tipX = x - Math.cos(angle) * drillLength * 0.7
      const tipY = topY - Math.sin(angle) * drillLength
      const tipZ = z + Math.sin(angle * 0.5) * drillLength * 0.3

      nailLinePositions.push(x, topY, z, tipX, tipY, tipZ)

      const anchorNorm = getTerrainNormal(x, z)
      for (let s = 0; s <= steps; s++) {
        const t = s / steps
        const px = x - Math.cos(angle) * (drillLength * t) * 0.7
        const py = topY - Math.sin(angle) * (drillLength * t)
        const pz = z + Math.sin(angle * 0.5) * (drillLength * t) * 0.3
        const hNorm = (py - minElev) / elevRange

        const isAnchorHead = s === 0
        const ptColor = isAnchorHead ? new THREE.Color(0xffffff) : new THREE.Color(0x34d399)
        const ptSize = isAnchorHead ? 0.078 : 0.052
        addPoint(px, py, pz, anchorNorm, ptColor, ptSize, 3, hNorm)
      }
    })

    // --- 6. Terraced Retaining Wall & Foundation Slab Boundary ---
    const slabX1 = -0.6
    const slabX2 = 1.2
    const slabZ1 = -0.5
    const slabZ2 = 0.9
    const slabY = getTerrainHeight((slabX1 + slabX2) * 0.5, (slabZ1 + slabZ2) * 0.5) + 0.05
    const slabNorm = new THREE.Vector3(0, 1, 0)

    for (let sx = slabX1; sx <= slabX2; sx += 0.12) {
      for (let sz = slabZ1; sz <= slabZ2; sz += 0.12) {
        const isBorder =
          Math.abs(sx - slabX1) < 0.08 ||
          Math.abs(sx - slabX2) < 0.08 ||
          Math.abs(sz - slabZ1) < 0.08 ||
          Math.abs(sz - slabZ2) < 0.08

        if (isBorder) {
          addPoint(sx, slabY, sz, slabNorm, new THREE.Color(0xffffff), 0.058, 3, (slabY - minElev) / elevRange)
        }
      }
    }

    // --- 7. Vertical Foundation Boreholes / Deep Bored Piles ---
    const pileLocations = [
      [-0.4, -0.3],
      [0.2, -0.3],
      [0.8, -0.3],
      [-0.4, 0.4],
      [0.2, 0.4],
      [0.8, 0.4],
    ]
    pileLocations.forEach(([px, pz]) => {
      const py = getTerrainHeight(px, pz)
      nailLinePositions.push(px, py, pz, px, -1.55, pz)
    })

    // Convert to Three.js BufferGeometry
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(posList, 3))
    geometry.setAttribute('aNormal', new THREE.Float32BufferAttribute(normList, 3))
    geometry.setAttribute('aColor', new THREE.Float32BufferAttribute(colList, 3))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizeList, 1))
    geometry.setAttribute('aType', new THREE.Float32BufferAttribute(typeList, 1))
    geometry.setAttribute('aHeightNorm', new THREE.Float32BufferAttribute(heightNormList, 1))
    geometry.setAttribute('aLightVal', new THREE.Float32BufferAttribute(lightValList, 1))
    geometry.setAttribute('aPhase', new THREE.Float32BufferAttribute(phaseList, 1))

    // -------------------------------------------------------------------------
    // Custom Shader: Physical Light & Shade (Gelap Terang) + 60 FPS Laser Scan
    // -------------------------------------------------------------------------
    const vertexShader = `
      attribute vec3 aNormal;
      attribute vec3 aColor;
      attribute float size;
      attribute float aType; // 0: Grid, 1: Contour, 2: FEA, 3: Anchor
      attribute float aHeightNorm;
      attribute float aLightVal;
      attribute float aPhase;

      uniform float uTime;
      uniform float uProgress;
      uniform float uPulseBurst;
      uniform float uSeismicAmp;
      uniform vec2 uHoverOffset;

      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vec3 pos = position;

        // Interactive mouse tilt parallax
        pos.x += uHoverOffset.x * 0.32;
        pos.y += uHoverOffset.y * 0.32;

        // --- Continuous 60 FPS Planar LiDAR Laser Scanline ---
        float scanNormalized = (pos.x + 3.6) / 7.2;
        float scanDelta = scanNormalized - uProgress;
        float scanFactor = smoothstep(0.08, -0.01, scanDelta);

        // Sub-surface points and contour lines dissolve/crystallize smoothly
        if (aType > 0.5) {
          float lift = (1.0 - scanFactor) * 0.45 + sin(uTime * 2.4 + aPhase * 6.28) * 0.03;
          vec3 ghostPos = pos + vec3(
            sin(aPhase * 6.28) * 0.10 * (1.0 - scanFactor),
            lift,
            cos(aPhase * 6.28) * 0.10 * (1.0 - scanFactor)
          );
          pos = mix(ghostPos, pos, scanFactor);
        }

        // --- Dynamic Seismic Shear Wave (SAP2000 Response Spectrum) ---
        if (uSeismicAmp > 0.01) {
          float shearDepth = clamp(1.0 - aHeightNorm, 0.0, 1.0);
          float wave = sin(uTime * 9.0 - pos.y * 3.8 + aPhase * 1.5) * 0.07 * uSeismicAmp * shearDepth;
          pos.x += wave;
          pos.z += cos(uTime * 7.5 - pos.y * 3.2) * 0.035 * uSeismicAmp * shearDepth;
        }

        // Pulse burst ripple
        if (uPulseBurst > 0.5) {
          float pulse = sin(uTime * 14.0 + aPhase * 6.28) * 0.02;
          pos.y += pulse;
        }

        // Laser scanline illumination glow
        float scanGlow = exp(-pow(scanDelta * 22.0, 2.0)) * (1.0 - smoothstep(0.96, 1.0, uProgress));

        // --- Dynamic Light Physics Shading (Gelap Terang) ---
        // Light vector comes from top-left (upper-left front)
        vec3 worldNormal = normalize((modelMatrix * vec4(aNormal, 0.0)).xyz);
        vec3 lightVector = normalize(vec3(-0.55, 0.78, 0.30));
        float dynamicDiffuse = max(0.0, dot(worldNormal, lightVector));

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vec3 viewDir = normalize(-mvPosition.xyz);
        // Fresnel rim highlight on highland crests facing camera
        float fresnel = pow(1.0 - max(0.0, dot(worldNormal, viewDir)), 3.0) * aHeightNorm;

        // Physical illumination factor (blending precomputed AO with dynamic lighting)
        float illumination = mix(aLightVal, dynamicDiffuse, 0.32) + fresnel * 0.40;
        illumination = clamp(illumination, 0.08, 1.0);

        // Chiaroscuro high-contrast curve: deep shadow in valleys, gleaming on summits
        float contrastLight = pow(illumination, 1.25);

        vec3 col = aColor;

        // High summits facing light: bright luminous white/cyan boost
        if (aHeightNorm > 0.65) {
          col = mix(col, vec3(1.10, 1.35, 1.65), contrastLight * 0.65);
        } else if (aHeightNorm < 0.35) {
          // Deep valley in shadow: muted oceanic navy
          col *= mix(0.35, 0.85, contrastLight);
        }

        // Anchors radiate emerald green when stabilized
        if (aType > 2.5) {
          float anchorGlow = 0.5 + 0.5 * sin(uTime * 4.0 + aPhase * 6.28);
          col = mix(col, vec3(0.20, 0.95, 0.60), anchorGlow * 0.6);
        }

        // Apply scanline laser highlight
        col = mix(col * 0.35, col, scanFactor);
        col = mix(col, vec3(0.40, 1.30, 1.70), scanGlow * 0.95);

        // Physical alpha: Highlands are crisp (0.95-1.0), valleys sink into shadows (0.25-0.55)
        float baseAlpha = mix(0.30, 0.98, pow(aHeightNorm, 0.85) * contrastLight);
        float alpha = mix(baseAlpha * 0.20, baseAlpha, scanFactor);
        alpha = max(alpha, scanGlow * 0.98);
        if (aType < 0.5) alpha *= 0.38; // Subtle floor datum grid

        // Subtle organic starlight twinkle
        float twinkle = sin(uTime * 2.8 + aPhase * 6.28) * 0.10;
        col += vec3(twinkle * 0.12);

        vColor = col * 1.40;
        vAlpha = alpha;

        float sizeMultiplier = aType > 2.5 ? 1.25 : (aType > 1.5 ? 1.10 : 1.00);
        gl_PointSize = size * sizeMultiplier * (1160.0 / -mvPosition.z);
        gl_PointSize = clamp(gl_PointSize, 2.2, 7.8);
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
        uPulseBurst: uniformsRef.current.uPulseBurst,
        uSeismicAmp: uniformsRef.current.uSeismicAmp,
        uHoverOffset: uniformsRef.current.uHoverOffset,
        pointTexture: { value: particleTexture },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const pointCloud = new THREE.Points(geometry, material)
    blueprintGroup.add(pointCloud)

    // --- 8. Crisp CAD Vector Line Segments for Anchors & Piles ---
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(nailLinePositions, 3))
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    })
    const anchorLines = new THREE.LineSegments(lineGeo, lineMat)
    blueprintGroup.add(anchorLines)

    // Holographic CAD datum lines & geodetic boundary markers
    const gridHelper = new THREE.GridHelper(9, 18, 0x0284c7, 0x0369a1)
    gridHelper.position.set(0, -1.60, 0)
    // @ts-ignore
    gridHelper.material.transparent = true
    // @ts-ignore
    gridHelper.material.opacity = 0.16
    blueprintGroup.add(gridHelper)

    // -------------------------------------------------------------------------
    // Mouse Parallax & Smooth 60 FPS Animation Loop
    // -------------------------------------------------------------------------
    let targetRotY = 0.48
    let targetRotX = 0.22
    let currentRotY = 0.48
    let currentRotX = 0.22

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetRotY = 0.48 + nx * 0.26
      targetRotX = 0.22 + ny * 0.16
      uniformsRef.current.uHoverOffset.value.set(nx * 0.2, ny * 0.2)
    }

    window.addEventListener('mousemove', handleMouseMove)

    let animId: number
    const clock = new THREE.Clock()
    let smoothProgress = 1.0
    let smoothSeismic = 0.0

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()
      uniformsRef.current.uTime.value = elapsed

      // Scroll-driven dissolve removed: terrain stays formed.
      const targetP = targetProgressRef.current
      smoothProgress += (targetP - smoothProgress) * 0.12
      uniformsRef.current.uProgress.value = smoothProgress

      // Smooth seismic amplitude damping
      const targetS = targetSeismicRef.current
      smoothSeismic += (targetS - smoothSeismic) * 0.10
      uniformsRef.current.uSeismicAmp.value = smoothSeismic

      // Smooth camera tilt
      currentRotY += (targetRotY - currentRotY) * 0.04
      currentRotX += (targetRotX - currentRotX) * 0.04

      // Subtle ambient orbital drift
      const ambientOrbit = Math.sin(elapsed * 0.32) * 0.07
      blueprintGroup.rotation.y = currentRotY + ambientOrbit
      blueprintGroup.rotation.x = currentRotX
      blueprintGroup.position.y = -0.05 + Math.sin(elapsed * 0.45) * 0.02

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
      lineGeo.dispose()
      lineMat.dispose()
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
