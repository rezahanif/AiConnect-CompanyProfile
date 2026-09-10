import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function AmbientDotsCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / (container.clientHeight || 1),
      0.1,
      1000
    )
    camera.position.set(0, 0, 7.5)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // --- 2. High-Res Optical Starlight Glow Texture ---
    const createGlowTexture = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 64
      canvas.height = 64
      const ctx = canvas.getContext('2d')
      if (!ctx) return null

      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)')
      gradient.addColorStop(0.20, 'rgba(235, 250, 255, 0.95)')
      gradient.addColorStop(0.45, 'rgba(120, 215, 255, 0.75)')
      gradient.addColorStop(0.70, 'rgba(40, 130, 235, 0.35)')
      gradient.addColorStop(0.90, 'rgba(15, 45, 140, 0.10)')
      gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0)')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 64, 64)

      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      return texture
    }

    const particleTexture = createGlowTexture()

    // --- 3. Key Lighting Parameters (Studio upper-left spotlight matching Hero) ---
    const keyLightPos = new THREE.Vector3(-4.5, 4.2, 5.0)
    const keyLightDir = new THREE.Vector3(0.58, -0.48, -0.65).normalize()
    const spotParams = new THREE.Vector2(
      Math.cos(28 * (Math.PI / 180)),
      Math.cos(75 * (Math.PI / 180))
    )

    // --- 4. Stardust Dot Cloud (4,200 Points - Balanced, Visible Celestial Galaxy) ---
    const totalDots = 4200
    const positions = new Float32Array(totalDots * 3)
    const colors = new Float32Array(totalDots * 3)
    const sizes = new Float32Array(totalDots)
    const twinklePhases = new Float32Array(totalDots)
    const twinkleSpeeds = new Float32Array(totalDots)
    const velocitiesY = new Float32Array(totalDots)
    const velocitiesX = new Float32Array(totalDots)

    const cWhite = new THREE.Color(0.98, 0.99, 1.0)
    const cCyan = new THREE.Color(0.35, 0.94, 1.0)
    const cElectricSky = new THREE.Color(0.22, 0.72, 1.0)
    const cDeepCobalt = new THREE.Color(0.16, 0.42, 0.95)

    for (let i = 0; i < totalDots; i++) {
      const idx = i * 3
      const x = (Math.random() - 0.5) * 19.0
      const y = (Math.random() - 0.5) * 11.0
      const z = (Math.random() - 0.5) * 3.8

      positions[idx] = x
      positions[idx + 1] = y
      positions[idx + 2] = z

      const r = Math.random()
      let col = cCyan
      if (r < 0.28) {
        col = cWhite
      } else if (r < 0.72) {
        col = cCyan
      } else {
        col = cElectricSky
      }

      colors[idx] = col.r
      colors[idx + 1] = col.g
      colors[idx + 2] = col.b

      sizes[i] = 0.038 + Math.random() * 0.042
      twinklePhases[i] = Math.random() * Math.PI * 2
      twinkleSpeeds[i] = 0.9 + Math.random() * 2.2
      velocitiesY[i] = 0.024 + Math.random() * 0.065
      velocitiesX[i] = (Math.random() - 0.5) * 0.015
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('aTwinklePhase', new THREE.BufferAttribute(twinklePhases, 1))
    geometry.setAttribute('aTwinkleSpeed', new THREE.BufferAttribute(twinkleSpeeds, 1))

    const vertexShader = `
      attribute float size;
      attribute float aTwinklePhase;
      attribute float aTwinkleSpeed;
      
      uniform float uTime;
      uniform vec3 uLightPos;
      uniform vec3 uLightDir;
      uniform vec2 uSpotParams;

      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

        // Key-light beam illumination (identical to Hero starlight)
        vec4 worldDustPos4 = modelMatrix * vec4(position, 1.0);
        vec3 worldDustPos = worldDustPos4.xyz;
        vec3 toDust = worldDustPos - uLightPos;
        float dustDist = length(toDust);
        vec3 dustRay = toDust / max(dustDist, 0.001);
        float dustSpotCos = dot(dustRay, normalize(uLightDir));
        float dustSpot = smoothstep(uSpotParams.y * 0.85, uSpotParams.x, dustSpotCos);
        float dustDistDecay = 1.0 / (1.0 + 0.045 * dustDist);
        float dustBeam = dustSpot * dustDistDecay;
        
        float twinkle = 0.76 + 0.24 * sin(uTime * aTwinkleSpeed + aTwinklePhase);
        vec3 dustColor = mix(color * 0.90, vec3(0.96, 0.99, 1.0), dustBeam * 0.60);
        vColor = dustColor * twinkle * (0.95 + dustBeam * 0.85);
        vAlpha = 0.52 + dustBeam * 0.32;

        float pSize = size * (1.05 + dustBeam * 0.95) * (460.0 / -mvPosition.z);
        gl_PointSize = clamp(pSize, 2.4, 6.5);
        gl_Position = projectionMatrix * mvPosition;
      }
    `

    const fragmentShader = `
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vec4 tex = texture2D(pointTexture, gl_PointCoord);
        gl_FragColor = vec4(vColor, vAlpha) * tex;
      }
    `

    const material = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: particleTexture },
        uTime: { value: 0 },
        uLightPos: { value: keyLightPos },
        uLightDir: { value: keyLightDir },
        uSpotParams: { value: spotParams },
      },
      vertexShader,
      fragmentShader,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const pointCloud = new THREE.Points(geometry, material)
    scene.add(pointCloud)

    // --- 5. Interactive Mouse Parallax ---
    let targetCamX = 0
    let targetCamY = 0
    let currentCamX = 0
    let currentCamY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      targetCamX = nx * 0.45
      targetCamY = -ny * 0.30
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // --- 6. Animation Loop ---
    let animId = 0
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      const elapsedTime = clock.getElapsedTime()

      material.uniforms.uTime.value = elapsedTime

      const pos = geometry.attributes.position.array as Float32Array

      for (let i = 0; i < totalDots; i++) {
        const idx = i * 3
        pos[idx + 1] += velocitiesY[i] * delta
        pos[idx] += velocitiesX[i] * delta

        if (pos[idx + 1] > 5.6) {
          pos[idx + 1] = -5.6
          pos[idx] = (Math.random() - 0.5) * 19.0
        }
      }

      geometry.attributes.position.needsUpdate = true

      currentCamX += (targetCamX - currentCamX) * 0.05
      currentCamY += (targetCamY - currentCamY) * 0.05
      camera.position.x = currentCamX
      camera.position.y = currentCamY
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    animate()

    // --- 6. Resize Handling ---
    const handleResize = () => {
      if (!container) return
      const width = container.clientWidth
      const height = container.clientHeight
      if (width === 0 || height === 0) return
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    // --- 7. Cleanup ---
    return () => {
      cancelAnimationFrame(animId)
      resizeObserver.disconnect()
      window.removeEventListener('mousemove', handleMouseMove)
      geometry.dispose()
      material.dispose()
      if (particleTexture) particleTexture.dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden"
    />
  )
}
