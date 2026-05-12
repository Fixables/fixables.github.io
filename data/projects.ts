import type { ProjectData } from "@/types/project";

export const projects: ProjectData[] = [
  // ── 1. Haptic Knob ────────────────────────────────────────────────
  {
    slug: "haptic-knob",
    title: "Haptic Knob",
    tagline:
      "BLDC knob that lets you feel circuits — capacitors spring back, inductors resist acceleration, diodes block in reverse",
    category: "firmware",
    tags: [
      "ESP32-S3",
      "BLDC",
      "FOC",
      "SimpleFOC",
      "FreeRTOS",
      "C++",
      "Motor Control",
    ],
    date: "2024",
    status: "Ongoing",
    role: "Firmware Co-Lead — designed and implemented the full firmware stack: FreeRTOS task architecture, SimpleFOC integration, haptic model encoding, and hardware drivers (MT6701 encoder, MCP3204 ADC)",
    featured: true,
    coverImage: "/assets/projects/haptic-knob/knob_assembled.jpeg",
    images: [
      "/assets/projects/haptic-knob/knob_assembled.jpeg",
      "/assets/projects/haptic-knob/knob_casing.jpeg",
      "/assets/projects/haptic-knob/pcb_corner.png",
      "/assets/projects/haptic-knob/pcb_corner_components.png",
    ],
    model3d: "/assets/projects/haptic-knob/3dPCB.obj",
    schematics: [
      "/assets/projects/haptic-knob/03-04-26%20Full%20System%20Block%20Diagram-Full%20System.drawio.png",
      "/assets/projects/haptic-knob/03-04-26%20Full%20System%20Block%20Diagram-FOC%20and%20Current%20Controller.drawio.png",
      "/assets/projects/haptic-knob/03-04-26%20Full%20System%20Block%20Diagram-Motor%20Driver.drawio.png",
    ],
    schematic: "/assets/projects/haptic-knob/Schematics%20Print%20-%2003-18-26.pdf",
    pcbLayers: [
      {
        name: "Top",
        label: "Top",
        url: "/assets/projects/haptic-knob/PCB%20Rev1/PCB%20Rev1-1.png",
        color: "#c87533",
        defaultVisible: true,
      },
      {
        name: "Bottom",
        label: "Bottom",
        url: "/assets/projects/haptic-knob/PCB%20Rev1/PCB%20Rev1-2.png",
        color: "#4169e1",
        defaultVisible: true,
      },
    ],
    summary:
      "Here's the idea: what if a capacitor felt like a spring? An inductor like resistance to acceleration? A diode like a one-way ratchet? That's exactly what this knob does. It's a 3-phase BLDC motor running Field-Oriented Control on an ESP32-S3, and the firmware computes a real-time torque command that mimics circuit behaviour. Turn it past zero and it springs back (V = Q/C). Spin it fast and it pushes back like a damper (V = Rω). The motor becomes a haptic voltage source. The math is just the electrical-to-mechanical analogy from first-year physics — the fun part is that with a tight control loop (1 kHz inner / 200 Hz haptic model), it actually feels right.",
    sections: {
      problem:
        "Circuits are normally invisible — you see them on an oscilloscope, never in your hand. I wanted a knob that lets you feel circuit element behaviour directly: resistance as velocity damping, capacitance as a position spring, inductance as resistance to acceleration, and a diode as one-way blocking. The hard constraint was that it had to be smooth and silent — any cogging noise or PWM whine would instantly break the illusion, which meant six-step commutation was out and FOC was the only real option.",
      goals: [
        "Implement FOC via SimpleFOC for smooth, silent torque control at low RPM",
        "Encode R, L, C, RLC, and Diode behaviour as distinct haptic torque profiles",
        "Run the control loop deterministically at 1 kHz using FreeRTOS on ESP32-S3",
        "Integrate MT6701 SSI encoder, MCP3204 SPI current ADC, and watchdog safety monitoring",
      ],
      designDecisions:
        "FOC chosen over six-step commutation for torque smoothness — cogging noise from simpler PWM approaches would break the haptic illusion. A merged single-task architecture (ControlTask on Core 0) runs both the 1 kHz inner motor loop and the 200 Hz haptic model update using a deterministic counter, avoiding cross-task scheduling jitter. Low-pass filters with deadbands clean up encoder quantisation noise in velocity and acceleration signals. A WatchdogTask monitors heartbeat timestamps and latches a fault flag to stop the motor if the control loop stalls.",
      validation:
        "Phase currents verified on oscilloscope for three-phase balance. End-to-end haptic latency measured at < 2 ms. All five haptic profiles (R, L, C, RLC, Diode) tested subjectively for naturalness. FOC confirmed to eliminate cogging noise present in six-step commutation. Watchdog fault latch tested by deliberately stalling the control loop.",
      results:
        "Smooth, silent haptic feedback across all five profiles. < 2 ms end-to-end latency. FOC eliminated cogging. Haptic analogies feel perceptually correct: the capacitor profile genuinely feels like winding a spring, the diode profile hard-blocks motion in one direction.",
    },
    specs: [
      { label: "MCU", value: "ESP32-S3 (FH4R2)" },
      { label: "Motor type", value: "Gimbal BLDC — 7 pole pairs" },
      {
        label: "Motor control",
        value: "Field-Oriented Control via SimpleFOC v2.3.4",
      },
      {
        label: "Inner control loop",
        value: "1 kHz (1 ms, vTaskDelayUntil, Core 0)",
      },
      {
        label: "Haptic model rate",
        value: "200 Hz (every 5th inner-loop cycle)",
      },
      { label: "Haptic latency", value: "< 2 ms end-to-end" },
      {
        label: "Position sensor",
        value: "MT6701 magnetic encoder — SSI via SPI",
      },
      {
        label: "Current sensing",
        value: "MCP3204 12-bit SPI ADC — low-side shunts (10.7 mΩ, 50× gain)",
      },
      {
        label: "Supply voltage",
        value: "5 V — driver limit 3 V, max current 2 A",
      },
      { label: "Torque constant", value: "0.035 N·m/A" },
      {
        label: "RTOS",
        value:
          "FreeRTOS — ControlTask (P5), TelemetryTask (P2), WatchdogTask (P3)",
      },
      {
        label: "Haptic profiles",
        value: "Resistor, Capacitor, Inductor, RLC, Diode",
      },
      {
        label: "Language / toolchain",
        value: "C++ — PlatformIO + Arduino framework",
      },
    ],
    process: [
      {
        title: "Electrical-to-mechanical analogy",
        description:
          "Mapped circuit variables to knob kinematics: voltage → torque, current → angular velocity, charge → angular displacement. This gives each element a clean torque equation: V=IR → T=Rω (resistor), V=Q/C → T=k·(θ−θ₀) (capacitor spring), V=L·di/dt → T=L·α (inductor). The RLC model integrates a virtual RLC ODE using forward Euler each model update step.",
      },
      {
        title: "Merged-loop FreeRTOS architecture",
        description:
          "Instead of separate RTOS tasks for the motor loop and haptic model, everything runs in one deterministic ControlTask pinned to Core 0 at priority 5. Every 1 ms: read hardware state, apply current command. Every 5th cycle (200 Hz): call computeActiveModelCommand() to refresh the haptic torque setpoint. This eliminates inter-task scheduling jitter between two tightly-coupled loops. TelemetryTask (Core 1, P2) handles serial I/O; WatchdogTask (P3) monitors heartbeat timestamps.",
      },
      {
        title: "Signal filtering for haptic naturalness",
        description:
          "Raw encoder velocity from SimpleFOC is noisy at low speeds. Each haptic model runs its inputs through a first-order low-pass filter (τ = 30 ms for velocity, 15 ms for acceleration) then applies a deadband before computing torque. Without this, the inductor and RLC models chatter badly at rest. Parameters are runtime-configurable over serial so they can be tuned without reflashing.",
      },
      {
        title: "Haptic profile encoding",
        description:
          "Each profile is a self-contained function that takes a MeasuredState snapshot and a RuntimeConfig, returns a HapticCommand (desired q-axis current). The Capacitor model auto-zeros theta_origin on boot so the spring starts at rest wherever the knob sits. The Diode model gates torque: no resistance below a velocity threshold, then scales proportionally above it — one-way blocking. The RLC model maintains virtualCurrent and virtualCapVoltage state across updates, integrating the circuit ODE in real time.",
      },
      {
        title: "Safety: watchdog and fault latching",
        description:
          "WatchdogTask wakes every 50 ms and checks control_last_heartbeat_us. If the control loop misses more than a few ticks, it sets fault_latched in SystemState. The ControlTask checks this flag every cycle — if latched, it calls stopMotor() instead of applying current. This two-stage design (detect → latch → safe-stop) proved essential during early development when the loop stalled silently and the motor would otherwise run away at max current.",
      },
    ],
    lessons: [
      'FOC becomes intuitive when you stop thinking about "3-phase control" and think about current control in the d/q rotating frame — torque is just the q-axis current, cleanly decoupled from flux. SimpleFOC abstracts the Clarke/Park/SVPWM machinery so you can focus on what the current command should actually be.',
      "A merged single-task loop (inner + outer in one FreeRTOS task with a counter) is often cleaner than two separate tasks for tightly-coupled control loops — no cross-task jitter, no shared-memory synchronisation between the two loops.",
      "Low-pass filter + deadband is sufficient for haptic velocity/acceleration signals. The haptic feel degrades much more from bad deadband tuning than from the choice of filter order.",
      'Haptic feel is deeply subjective. Physically accurate equations do not always feel perceptually correct — the capacitor spring constant and inductor inertia value needed significant empirical tuning to feel "right" in-hand.',
      "Build the watchdog and fault latch before you need them, not after. A latched fault flag saved hours of debugging when the control loop stalled silently during early firmware bringup and the motor tried to run away.",
      "Auto-zeroing theta_origin on boot (to current shaft angle) is non-negotiable for spring-based models. Without it, a randomly positioned knob sees a large displacement the instant control enables and the motor instantly hits current limits.",
    ],
    links: [{ label: "GitHub", url: "https://github.com/Fixables" }],
    subsystems: [
      {
        label: "Hardware",
        icon: "CircuitBoard",
        summary:
          "ESP32-S3, MT6701 encoder, MCP3204 ADC, 3-phase gate driver, 5 V supply",
        body: "The board centres on an ESP32-S3 (FH4R2 package). Rotor position is read by an MT6701 magnetic encoder over SSI (SPI bus 2). Three-phase currents are sensed via 10.7 mΩ low-side shunts amplified 50× and digitised by an MCP3204 12-bit SPI ADC (SPI bus 1). Gate drive runs from a dedicated rail; the logic side is 3.3 V from an LDO.",
        tags: ["ESP32-S3", "MT6701", "MCP3204", "SPI", "Current Sensing"],
        defaultOpen: true,
      },
      {
        label: "Firmware",
        icon: "Cpu",
        summary: "FreeRTOS merged control loop, SimpleFOC, 5 haptic models",
        body: "ControlTask (Core 0, priority 5) runs the merged 1 kHz / 200 Hz loop: read MT6701 angle via SSI → SimpleFOC FOC update → read MCP3204 phase currents → compute haptic torque command (200 Hz) → apply q-axis current setpoint. TelemetryTask handles serial runtime config. WatchdogTask monitors heartbeat timestamps and latches a fault flag to trigger safe-stop if the control loop stalls.",
        tags: ["FreeRTOS", "SimpleFOC", "FOC", "PID", "C++"],
      },
      {
        label: "Haptic Models",
        icon: "Zap",
        summary: "R, L, C, RLC, Diode — circuit laws as torque commands",
        body: 'Each of the five haptic modes is a self-contained model function. Resistor: T = −R·ω (velocity damping). Capacitor: T = −k·(θ−θ₀) − b·ω (position spring with damping). Inductor: T = −L·α − d·ω (acceleration resistance). Diode: threshold-gated one-way torque. RLC: full virtual circuit ODE integrated each model step, mapping angular velocity to "voltage" and computing current through a virtual R, L, C network whose state persists across updates.',
        tags: [
          "Resistor",
          "Capacitor",
          "Inductor",
          "Diode",
          "RLC",
          "Low-pass Filter",
        ],
      },
      {
        label: "Testing",
        icon: "FlaskConical",
        summary:
          "Oscilloscope phase verification, haptic latency, profile tuning",
        body: "Phase currents were verified on an oscilloscope to confirm balanced three-phase excitation. End-to-end haptic latency (input → torque response) measured at < 2 ms. Profiles were tuned iteratively by feel — physical accuracy alone is not enough, each model needed empirical parameter adjustment. A Python serial tuner script allows runtime gain changes without reflashing.",
        tags: ["Oscilloscope", "Latency Measurement", "Python", "Serial Tuner"],
      },
    ],
  },

  // ── 2. RoboMaestro ────────────────────────────────────────────────
  {
    slug: "robomaestro",
    title: "RoboMaestro",
    tagline:
      "Discrete MOSFET H-bridge motor driver — built in Altium because off-the-shelf drivers hide all the interesting parts",
    category: "pcb",
    tags: [
      "Altium Designer",
      "H-Bridge",
      "MOSFET",
      "Gate Driver",
      "PWM",
      "Power Electronics",
      "PCB",
    ],
    date: "2025",
    featured: true,
    coverImage: "/assets/projects/robomaestro/pcb_thumbnail.jpeg",
    images: [
      "/assets/projects/robomaestro/pcbtop.jpeg",
      "/assets/projects/robomaestro/pcb_on.jpeg",
      "/assets/projects/robomaestro/pcb_wbox.jpeg",
      "/assets/projects/robomaestro/pcb_thumbnail.jpeg",
    ],
    models3d: [
      { label: "Assembly", url: "/assets/projects/robomaestro/robomaestro.glb" },
      { label: "H-Bridge PCB", url: "/assets/projects/robomaestro/Hbridge.pdf.obj" },
      { label: "Actuator PCB", url: "/assets/projects/robomaestro/actuator.pdf.obj" },
      { label: "Motherboard", url: "/assets/projects/robomaestro/motherboard.pdf.obj" },
    ],
    schematics: [
      "/assets/projects/robomaestro/motherboard_schematics.png",
      "/assets/projects/robomaestro/power_schematics.png",
      "/assets/projects/robomaestro/actuator_schematics.png",
    ],
    schematic: "/assets/projects/robomaestro/schematic.pdf",
    fabStats: {
      layers: 2,
      dimensions: "— mm",
      minTrace: "0.2 mm",
      minVia: "0.3 mm drill",
      surface: "HASL",
      manufacturer: "JLCPCB",
    },
    pcbLayerGroups: [
      {
        label: "H-Bridge PCB",
        layers: [
          { name: "Top", label: "Top Copper", url: "/assets/projects/robomaestro/hbridge_layers/top.png", color: "#c87533", defaultVisible: true },
          { name: "Bottom", label: "Bottom Copper", url: "/assets/projects/robomaestro/hbridge_layers/bottom.png", color: "#4169e1", defaultVisible: true },
        ],
      },
      {
        label: "Motherboard",
        layers: [
          { name: "Top", label: "Top", url: "/assets/projects/robomaestro/motherboard_layers/motherboard_layers-1.png", color: "#c87533", defaultVisible: true },
          { name: "Bottom", label: "Bottom", url: "/assets/projects/robomaestro/motherboard_layers/motherboard_layers-2.png", color: "#4169e1", defaultVisible: true },
        ],
      },
      {
        label: "Actuator PCB",
        layers: [
          { name: "Top", label: "Top", url: "/assets/projects/robomaestro/actuator_layers/actuator_layers-1.png", color: "#c87533", defaultVisible: true },
          { name: "Bottom", label: "Bottom", url: "/assets/projects/robomaestro/actuator_layers/actuator_layers-2.png", color: "#4169e1", defaultVisible: true },
        ],
      },
    ],
    summary:
      "Most motor driver projects slap an L298N on a breadboard and call it done — but that hides every interesting decision. So I designed one from scratch in Altium: discrete N-channel MOSFETs in an H-bridge, bootstrap circuits for the high-side gate drive, level shifters from 3.3 V logic to 12 V gate domain, and the kind of decoupling network you only learn about after you've watched a half-bridge ring like crazy on an oscilloscope. The board is a 2-layer Altium design with deliberate plane separation: power on the bottom (≥5 A traces), logic on top, ground pour tying it all together. The point was less 'spin a motor' and more 'understand exactly why fast switching is hard.'",
    sections: {
      designDecisions:
        "Discrete MOSFET H-bridge chosen for full control over gate-drive timing and dead-time. Gate-drive networks with decoupling suppression reduce switching noise. Level shifting handles high-side drive.",
      pcbHighlights:
        "2-layer PCB in Altium. Gate-drive networks with decoupling suppression to reduce noise and improve switching robustness. Power and signal planes carefully separated.",
      results:
        "PCB fabricated and under bring-up testing. PWM switching verified on bench.",
    },
    links: [
      { label: "GitHub", url: "https://github.com/Fixables" },
      {
        label: "Schematic PDF",
        url: "/assets/projects/robomaestro/schematic.pdf",
      },
    ],
    subsystems: [
      {
        label: "Hardware",
        icon: "CircuitBoard",
        summary:
          "MOSFET H-bridge, gate-drive network, decoupling, level shifting",
        body: "Discrete N-channel MOSFETs form the full H-bridge. High-side gate drive is handled by a bootstrap circuit to overcome the source-follower threshold. Gate resistors and Schottky snubbers damp ringing on fast PWM edges. Bulk and ceramic decoupling capacitors are placed close to each MOSFET to suppress supply bounce. Level shifting bridges the 3.3 V logic signal to the 12 V gate drive domain.",
        tags: [
          "MOSFET",
          "Gate Driver",
          "Bootstrap",
          "Level Shifting",
          "Decoupling",
        ],
        defaultOpen: true,
      },
      {
        label: "PCB Layout",
        icon: "Layers",
        summary: "2-layer Altium board, power/signal separation, trace widths",
        body: "Designed as a 2-layer board in Altium Designer. High-current power traces (motor supply and return) are on the bottom layer with widths calculated for ≥5 A. Gate-drive and logic signals are kept on the top layer and routed away from the switching nodes. A solid ground pour ties both layers and minimises the high-frequency loop area on each half-bridge.",
        tags: ["Altium Designer", "2-Layer PCB", "Power Layout", "Ground Pour"],
      },
      {
        label: "Testing",
        icon: "FlaskConical",
        summary: "PWM switching verification, bring-up status",
        body: "PWM switching waveforms verified on oscilloscope at 20 kHz — confirmed dead-time insertion and clean gate transitions. Current draw measured under resistive load. Board is currently in bring-up; motor spin-up under closed-loop control is the next milestone.",
        tags: ["Oscilloscope", "PWM Verification", "Bring-Up"],
      },
    ],
  },

  // ── 3. BrewBox ────────────────────────────────────────────────────
  {
    slug: "brew-box",
    title: "BrewBox",
    tagline:
      "IoT fermentation monitor — temperature, pH, dissolved oxygen, and CO₂ through a galvanically isolated modular sensor hub",
    category: "pcb",
    tags: [
      "Altium Designer",
      "ESP32",
      "ADM3260",
      "Isolated I2C",
      "IoT",
      "Sensors",
      "PCB",
      "Fermentation",
    ],
    date: "2025",
    status: "Ongoing",
    role: "Instrumentation Team — designed the motherboard PCB (schematic, layout, isolation architecture) and developed sensor front-ends, calibration procedures, and data-processing routines",
    featured: true,
    coverImage: "/assets/projects/BrewBox/TopPCB_out.png",
    images: [
      "/assets/projects/BrewBox/TopPCB_out.png",
      "/assets/projects/BrewBox/RealLife_PCB_Photo.JPG",
      "/assets/projects/BrewBox/PCB_andTheTeam.JPG",
      "/assets/projects/BrewBox/Input_Power_Schematic.png",
      "/assets/projects/BrewBox/Isolator_Schematics.png",
      "/assets/projects/BrewBox/Sensors_Schematics.png",
    ],
    model3d: "/assets/projects/BrewBox/brewbox.glb",
    schematics: [
      "/assets/projects/BrewBox/Input_Power_Schematic.png",
      "/assets/projects/BrewBox/Isolator_Schematics.png",
      "/assets/projects/BrewBox/Sensors_Schematics.png",
    ],
    fabStats: {
      layers: 2,
      dimensions: "— mm",
      minTrace: "0.2 mm",
      minVia: "0.3 mm drill",
      surface: "HASL",
      manufacturer: "JLCPCB",
    },
    pcbLayers: [
      {
        name: "Top",
        label: "Top View",
        url: "/assets/projects/BrewBox/brewbox1.0_toplayer.png",
        color: "#c87533",
        defaultVisible: true,
      },
      {
        name: "Bottom",
        label: "Bottom View",
        url: "/assets/projects/BrewBox/brewbox1.0-botlayer.png",
        color: "#4169e1",
        defaultVisible: true,
      },
    ],
    summary:
      "Fermentation is basically chemistry happening in a bucket — and if you want to make it repeatable, you need eyes on it. BrewBox is an IoT platform for small-scale brewing that tracks temperature, pH, dissolved oxygen, and CO₂ activity in real time and ships the data wirelessly to a monitoring dashboard. My side of it was the instrumentation: designing the 2-layer motherboard in Altium, building the sensor front-ends, and making the whole thing stable in a humid, variable-temperature environment. The board architecture is modular — an ESP32 carrier at the centre, edge-connector slots for plug-in sensor boards — so different sensor combinations can be assembled without touching the main board. The isolation piece was the most interesting: sensors sitting in conductive liquid can have significant ground offsets relative to the electronics, so I used the ADM3260 to galvanically isolate every I2C line, with integrated isolated power so no separate converter is needed.",
    sections: {
      problem:
        "Fermentation environments are electrically hostile — sensors sitting in conductive wort or must can carry ground offsets large enough to latch up or damage an MCU if connected directly. On top of that, humidity, temperature swings, and long unattended runs mean the system has to be stable and repeatable across multiple batches, not just a one-shot demo. We needed a platform that could acquire clean data from four different sensor types and push it wirelessly to a dashboard, while being modular enough that the sensor payload could change between experiments.",
      goals: [
        "Galvanically isolate all sensor I2C lines from the ESP32 using the ADM3260 (isolated I2C + integrated isolated power)",
        "Design a modular motherboard: ESP32 carrier + edge-connector slots for swappable sensor boards",
        "Develop and calibrate sensor front-ends for temperature, pH, dissolved oxygen, and CO₂ activity",
        "Ensure stable, repeatable measurements in humid, variable-temperature fermentation conditions",
        "Transmit data wirelessly to a monitoring dashboard for real-time process insight",
      ],
      designDecisions:
        "ADM3260 chosen because it integrates I2C isolation and an isolated 3.3 V supply in one package — no separate isolated converter needed. Modular edge-connector architecture lets sensor boards swap independently; a failed module is replaced without touching the motherboard. Ground planes are fully separated across both layers with a creepage gap. Sensor calibration is done per-module with stored coefficients, so drift in one sensor type does not affect others.",
      schematicHighlights:
        "Three schematic sheets: (1) input power — 5 V input, 3.3 V non-isolated MCU rail; (2) ADM3260 isolation network — SDA/SCL isolation with integrated 3.3 V isolated supply for sensor side; (3) sensor interface — edge connectors, isolated I2C pull-ups, per-module protection. The ADM3260 sheet was the most iterated — decoupling placement and enable-pin sequencing both needed refinement after the first board spin.",
      pcbHighlights:
        "2-layer board in Altium. Non-isolated (MCU) and isolated (sensor) ground pours are physically separated by a creepage gap across both layers. Sensor connectors are clustered at one board edge to confine isolated-side routing. All ADM3260 decoupling placed within 0.5 mm of the IC pins.",
      validation:
        "Both power rails verified before any sensor connection. I2C communication confirmed across the isolation barrier with a logic analyser. Sensor modules (temperature and pH first, then DO and CO₂) validated individually. Measurements cross-checked against reference instruments across multiple test batches to confirm repeatability. Ground isolation verified by measuring the potential between the two ground planes under live sensor load.",
      results:
        "Platform operational across multiple fermentation test batches. Sensor readings stable and repeatable across temperature swings and humidity. Wireless data transmission to dashboard confirmed. Calibration procedures documented and repeatable by other team members. Modular architecture validated — sensor board swap takes under two minutes without touching the motherboard.",
    },
    specs: [
      { label: "MCU", value: "ESP32 (carrier module)" },
      {
        label: "Isolation IC",
        value: "ADM3260 — isolated I2C + integrated isolated 3.3 V",
      },
      { label: "Isolation type", value: "Galvanic — capacitive (ADM3260)" },
      {
        label: "Communication",
        value: "Isolated I2C (sensor side) + Wi-Fi (dashboard)",
      },
      {
        label: "Sensors",
        value: "Temperature, pH, Dissolved Oxygen, CO₂ activity",
      },
      {
        label: "Environment",
        value: "Humid, variable-temperature fermentation vessel",
      },
      { label: "PCB", value: "2-layer, designed in Altium Designer" },
      { label: "Manufacturer", value: "JLCPCB" },
      {
        label: "Architecture",
        value: "Modular — ESP32 carrier + edge-connector sensor boards",
      },
      {
        label: "Output",
        value: "Real-time wireless data to monitoring dashboard",
      },
    ],
    process: [
      {
        title: "Instrumentation architecture",
        description:
          "Started from the sensor side: what are we measuring, what are the electrical characteristics of each sensor, and what does each need from the interface circuit? pH and DO sensors have their own electrochemical quirks (high source impedance, reference electrode considerations). Temperature is straightforward. CO₂ was approached indirectly via activity correlation. Centralised everything onto one ESP32 hub via I2C, with the isolation barrier between the sensor connectors and the MCU bus.",
      },
      {
        title: "PCB design — isolation and layout",
        description:
          "Three schematic sheets in Altium: input power, ADM3260 isolation network, sensor interface. The layout challenge was ground separation — the non-isolated and isolated pours had to be fully separate across both layers with a physical creepage gap. ADM3260 decoupling capacitors placed within 0.5 mm. Sensor connectors clustered at one board edge to keep isolated routing short and away from the MCU.",
      },
      {
        title: "Sensor calibration and front-end development",
        description:
          "Each sensor type required its own calibration procedure. Temperature was calibrated against a reference thermometer. pH was two-point calibrated with buffer solutions. Dissolved oxygen was calibrated at air saturation and zero-oxygen reference. All coefficients stored per-module so they travel with the sensor board. Measurement routines were tuned for sampling integrity and noise rejection in the humid, electrically noisy fermentation environment.",
      },
      {
        title: "Validation across batches",
        description:
          "Ran the platform through multiple fermentation test batches rather than just bench tests. Cross-checked sensor readings against reference instruments at several points per batch. Verified that calibration held stable across temperature swings. Dashboard data transmission was monitored for dropouts. Calibration procedures and test reports were documented so other team members could run validation without needing to be in the loop for every batch.",
      },
    ],
    lessons: [
      "Sensor calibration in a real environment is completely different from bench calibration. Temperature gradients inside a fermentation vessel, humidity on connectors, and vibration from CO₂ outgassing all show up as drift that a clean-bench cal will miss.",
      "The ADM3260 is genuinely elegant — isolated I2C and isolated 3.3 V supply in one package. The datasheet layout recommendations for decoupling are worth following precisely; even small deviations caused signal integrity issues on the first board spin.",
      "Ground separation in a 2-layer board is a layout discipline, not just a schematic concern. The mental model that helped: treat isolated and non-isolated regions as two separate boards that share a substrate — zero copper connection between them, no exceptions.",
      "Modular architectures need a locked interface contract from day one. We defined the sensor module pinout early and committed to it — any mid-project change would have broken boards already in fabrication.",
      "Documenting calibration procedures as you go (not at the end) pays off. When the second team member had to run validation independently, clean docs meant the process took an afternoon instead of a week of back-and-forth.",
    ],
    links: [{ label: "BIOT", url: "https://ubcbiot.com/" }],
    subsystems: [
      {
        label: "Isolation",
        icon: "Zap",
        summary:
          "ADM3260 — galvanic I2C isolation + integrated 3.3 V isolated supply",
        body: "The ADM3260 provides capacitive galvanic isolation on SDA and SCL, and an integrated isolated DC/DC converter powering the sensor side at 3.3 V. This is the key protection layer: sensors in conductive liquid can carry ground offsets large enough to damage the ESP32 without it. One IC replaces what would otherwise be a separate isolated transformer, rectifier, regulator, and two I2C buffer ICs.",
        tags: [
          "ADM3260",
          "Isolated I2C",
          "Galvanic Isolation",
          "Integrated Isolated Power",
        ],
        defaultOpen: true,
      },
      {
        label: "PCB",
        icon: "Layers",
        summary:
          "2-layer Altium board — separated ground planes, modular edge connectors",
        body: "2-layer board in Altium Designer. Non-isolated (MCU) and isolated (sensor) ground pours are physically separated by a creepage gap across both layers — no copper bridge, no shared via. Sensor connectors cluster at one edge to confine isolated-side routing. ADM3260 decoupling placed within 0.5 mm of the IC. Fabricated at JLCPCB.",
        tags: ["Altium Designer", "2-Layer PCB", "Ground Separation", "JLCPCB"],
      },
      {
        label: "Sensors",
        icon: "CircuitBoard",
        summary:
          "Temperature, pH, DO, CO₂ — calibrated front-ends, plug-in boards",
        body: "Each sensor type is on its own plug-in board connecting via edge connector. Front-end circuits handle the impedance and signal conditioning specific to each sensor. Calibration coefficients are stored per module. Temperature uses a reference thermometer cal. pH uses two-point buffer solution cal. DO is calibrated at air saturation. CO₂ activity is inferred indirectly. All modules tested for stability across temperature swings and humidity.",
        tags: [
          "Temperature",
          "pH",
          "Dissolved Oxygen",
          "CO₂",
          "Calibration",
          "Modular",
        ],
      },
      {
        label: "Data & Wireless",
        icon: "Cpu",
        summary:
          "ESP32 acquisition hub — real-time wireless to monitoring dashboard",
        body: "The ESP32 polls all sensor modules over isolated I2C, runs calibration correction, and transmits data wirelessly to a monitoring dashboard. Data-processing routines handle sampling integrity and noise filtering. The system runs unattended across multi-day fermentation batches with stable readout.",
        tags: ["ESP32", "Wi-Fi", "IoT", "Data Processing", "Dashboard"],
      },
    ],
  },

  // ── 4. Coin Picking Robot ─────────────────────────────────────────
  {
    slug: "coin-picking-robot",
    title: "Coin Picking Robot",
    tagline:
      "Three MCUs, a wireless joystick, and an FSM that hunts coins — basically an over-engineered scavenger",
    category: "robotics",
    tags: ["EFM8LB1", "MSP430", "LPC824", "PWM", "FSM", "JDY-40", "Embedded C"],
    date: "2025",
    featured: true,
    coverImage: "/assets/coin-picking.JPG",
    images: ["/assets/coin-picking.JPG"],
    summary:
      "Three microcontrollers, two operating modes, and a JDY-40 wireless link talking between them. The EFM8LB1 handles motors and sensors, the MSP430 takes care of power, and an LPC824 runs comms. In autonomous mode, an FSM searches for coins, drives over to pick them up, and dodges obstacles with an ultrasonic. In manual mode, you drive it like an RC car with a joystick + LCD remote — complete with turn signals, a headlamp, and a laser alignment guide because once you have a robot, you might as well give it features. Surprisingly reliable across the test arena.",
    sections: {
      designDecisions:
        "Three separate MCUs handle different subsystems — EFM8LB1 for motor/sensor control, MSP430 for power management, LPC824 for comms. JDY-40 wireless links the remote controller to the robot. FSM handles autonomous mode switching cleanly.",
      goals: [
        "Autonomous coin detection and pickup via finite state machine",
        "Manual remote control via joystick with LCD feedback",
        "JDY-40 wireless communication between controller and robot",
        "PWM motor control with ISR-driven real-time response",
      ],
      challenges:
        "Integrating three MCUs with different peripherals required careful protocol design. Wireless link reliability tested across the arena. Ultrasonic obstacle detection integrated for autonomous safety.",
      results:
        "Successfully demonstrated both autonomous and manual modes. Wireless link reliable across test arena. Integrated robustness features: ultrasonic obstacle detector, light-sensitive headlamp, laser alignment guide, coin-counting laser, and turn-signal LEDs.",
    },
    links: [{ label: "GitHub", url: "https://github.com/Fixables" }],
  },

  // ── 4. Smart Energy Meter ─────────────────────────────────────────
  // {
  //   slug: "smart-energy-meter",
  //   title: "Smart Energy Meter",
  //   tagline:
  //     "ESP32 energy monitor — real-time RMS, power factor, and a Python pipeline that catches the weird stuff",
  //   category: "embedded",
  //   tags: [
  //     "ESP32",
  //     "IoT",
  //     "SCT-013",
  //     "ZMPT101B",
  //     "TFT Display",
  //     "Python",
  //     "Power Measurement",
  //   ],
  //   date: "2025",
  //   featured: false,
  //   coverImage: "",
  //   images: [],
  //   summary:
  //     "An ESP32 reads a non-invasive SCT-013 current clamp and a ZMPT101B voltage sensor, then computes RMS, real power, and power factor in firmware. A TFT shows live readings, and a Python backend on the other side logs everything and runs anomaly detection — useful for spotting the kind of weird load behaviour you'd otherwise never notice (like that one appliance that draws way more than it should). Verified against a bench power analyser. It's the kind of project where the firmware is straightforward but the calibration is where you spend half your time.",
  //   sections: {
  //     designDecisions:
  //       "SCT-013 non-invasive current transformer and ZMPT101B voltage sensor feed ADC inputs on the ESP32. RMS computation done in firmware. TFT display shows live readings. Python backend handles long-term logging and analytics.",
  //     goals: [
  //       "Real-time RMS voltage, current, power, and power factor measurement",
  //       "TFT display for live readings",
  //       "IoT data pipeline for remote monitoring",
  //       "Python analytics with anomaly detection and short-term forecasting",
  //     ],
  //     results:
  //       "Live readings verified against bench power analyser. Python dashboard operational with anomaly detection.",
  //   },
  //   links: [{ label: "GitHub", url: "https://github.com/Fixables" }],
  // },

  // ── 5. Reflow Oven Controller ─────────────────────────────────────
  {
    slug: "reflow-oven",
    title: "Reflow Oven Controller",
    tagline:
      "8051 reflow controller — K-type thermocouple, op-amp front-end, SSR PWM, FSM, Python strip chart, and a jingle on completion",
    category: "embedded",
    tags: [
      "EFM8LB1",
      "8051",
      "Assembly",
      "FSM",
      "Thermocouple",
      "Op-Amp",
      "SSR",
      "PWM",
      "Python",
      "UART",
    ],
    date: "2025",
    featured: false,
    coverImage: "/assets/reflow-oven.jpg",
    images: ["/assets/reflow-oven.jpg"],
    summary:
      "A reflow oven controller built in 8051 assembly for ELEC 291 Project 1, as part of a six-person team. The hardware chain: K-type thermocouple outputs microvolts, an op-amp circuit amplifies and filters the signal with cold-junction compensation, and the EFM8LB1 ADC reads the result. A finite state machine (FSM) written in assembly drives a solid-state relay (SSR) via PWM to control a 1500W toaster oven through the preheat, soak, reflow, and cooling stages. Reflow profile parameters (soak temperature, soak time, reflow temperature, reflow time) are all user-adjustable via LCD and pushbuttons. Temperature data streams over UART to a Python strip-chart running on a laptop. Safety: if the oven fails to reach 50°C within 60 seconds of starting, the controller aborts and throws an error. Bonus features include a safety LED that turns green when it is safe to open the oven, and a jingle that plays on cycle completion. Used it to actually reflow SMD test boards.",
    sections: {
      problem:
        "SMD reflow requires following a precise thermal profile: ramp to soak, hold, ramp to peak, then controlled cooling. The hard parts are the analog front-end (thermocouples put out microvolts, so noise and offset directly cause temperature error) and the control logic (the FSM must track the oven through four distinct phases, handle early abort, and give the user real-time feedback). The whole thing had to be written in 8051 assembly, with a Python backend for data logging.",
      goals: [
        "K-type thermocouple front-end with op-amp amplification, low-pass filtering, and cold-junction compensation",
        "FSM in assembly driving SSR via PWM through preheat, soak, reflow, and cooling phases",
        "Adjustable reflow profile parameters via LCD and pushbuttons",
        "UART serial output to Python strip-chart for live temperature logging",
        "Safety abort if oven fails to reach 50°C within 60 seconds of start",
        "Safety LED indicator and completion jingle as bonus features",
      ],
      designDecisions:
        "The thermocouple signal chain was iterated several times: the op-amp gain and low-pass filter cutoff were tuned to balance noise rejection with response time. Cold-junction compensation corrects for the ambient temperature at the connector. The FSM uses six states (Standby, Set Parameters, Preheat, Soak, Reflow, Cooling) with transitions triggered by temperature thresholds and timers. PWM duty cycle is adjusted by the FSM based on current temperature vs. target. Each team member owned one or two subsystems and integrated them into the main board only after individual testing was complete.",
      validation:
        "Thermocouple accuracy verified by comparing ADC-computed temperature against a reference multimeter reading of the op-amp output voltage. PWM output verified on oscilloscope. Full reflow cycle tested multiple times with temperature logged via Python and exported to Excel for profile comparison. Safety abort tested by deliberately blocking the oven's heat path. Completion jingle and LCD animations tested independently before integration.",
      results:
        "Controller tracked the reflow profile within spec. Successfully reflowed SMD test boards. Safety abort triggered correctly in all tests. Python strip-chart logged clean temperature curves for post-run analysis. Completion jingle plays on every successful cycle.",
    },
    specs: [
      { label: "MCU", value: "EFM8LB1 (8051-compatible)" },
      { label: "Language", value: "8051 Assembly (CrossIDE)" },
      { label: "Temperature sensor", value: "K-type thermocouple, microvolts range" },
      { label: "Analog front-end", value: "Op-amp amplification + low-pass filter + cold-junction compensation" },
      { label: "Heater control", value: "SSR (solid-state relay) driven by PWM from 8051" },
      { label: "Load", value: "1500W toaster oven" },
      { label: "Reflow phases", value: "Preheat, Soak, Reflow, Cooling (all durations and temps adjustable)" },
      { label: "Serial output", value: "UART to Python live strip-chart" },
      { label: "Safety", value: "Auto-abort if oven fails to reach 50°C within 60 s" },
      { label: "Bonus features", value: "Safety LED (green = safe to open), completion jingle, LCD animations" },
    ],
    process: [
      {
        title: "Analog front-end design and calibration",
        description:
          "The thermocouple voltage is amplified by an op-amp circuit with cold-junction compensation to correct for the ambient temperature at the connector. The output is passed through a low-pass filter before reaching the ADC. Calibration involved comparing the ADC-computed temperature against a known reference and adjusting the gain and offset coefficients in firmware until the error was within spec.",
      },
      {
        title: "FSM design",
        description:
          "The controller has six states: Standby, Set Parameters, Preheat, Soak, Reflow, and Cooling. In Standby the user sets soak temperature, soak time, reflow temperature, and reflow time via pushbuttons. START transitions to Preheat, where the SSR runs at high PWM until the soak target is reached. The FSM then times the soak, ramps to reflow temperature, holds for the reflow duration, then cuts the SSR and lets the oven cool. A timer running in the Preheat state triggers the safety abort if 50°C is not reached within 60 seconds.",
      },
      {
        title: "Python data logging and strip-chart",
        description:
          "Temperature data is sent over UART as ASCII every second. A Python script reads the serial port, plots the live temperature curve, and saves the data to a CSV for post-run comparison against the target reflow profile. A separate Python script was used during development for validation charting of thermocouple accuracy.",
      },
      {
        title: "Integration and testing",
        description:
          "Each subsystem was tested standalone before integration. The thermocouple front-end was verified against a multimeter. PWM output was scoped. The full reflow cycle was run multiple times and the output logs were compared against the target profile. The safety abort was deliberately triggered in testing. The completion jingle and LCD animations were the last features integrated.",
      },
    ],
    lessons: [
      "Analog signal chain calibration is iterative. The thermocouple front-end needed several rounds of gain and offset adjustment before the temperature error was small enough to use. Starting with bench measurements at known temperatures speeds this up.",
      "FSM design in assembly is cleaner than it sounds. A state variable in RAM with a jump table is effectively the same structure as a switch-case FSM in C, and the assembly version makes the state transitions explicit.",
      "The safety abort feature paid for itself in testing. We deliberately tried to trigger it, and it fired correctly every time. Having it there from the start meant we were not nervous about running the oven unattended.",
      "Python for live data logging is a natural fit for 8051 projects. The MCU sends raw numbers over UART; Python handles all the plotting and CSV export without any code on the embedded side.",
    ],
    links: [],
  },

  // ── 6. 555 Timer Capacitance Meter ────────────────────────────────
  {
    slug: "oscilloscope-multimeter",
    title: "555 Timer Capacitance Meter",
    tagline:
      "555 astable oscillator + non-8051 MCU -- capacitance 1 nF to 1 uF, measured by reading oscillation frequency",
    category: "embedded",
    tags: [
      "555 Timer",
      "ATMega328P",
      "C",
      "LCD",
      "Frequency Measurement",
      "Calibration",
      "ELEC291",
    ],
    date: "2025",
    featured: false,
    coverImage: "/assets/oscilloscope-multimeter.png",
    images: ["/assets/oscilloscope-multimeter.png"],
    summary:
      "A capacitance meter built from a 555 timer and a non-8051 microcontroller for ELEC 291 Lab 6. The 555 is wired as an astable oscillator: the oscillation frequency is inversely proportional to the capacitance in the RC network (f = 1 / (1.386 * R * C)). Dropping in an unknown capacitor shifts the frequency, and the MCU measures that frequency and back-calculates the capacitance. Working range is 1 nF to 1 uF, with the result shown on a 16x2 LCD. The whole program is written in C targeting one of the non-8051 processors from the Project 2 kit (ATMega328P, MSP430G2553, PIC32MX130, LPC824, or STM32L051). Calibration was done against known capacitor values.",
    sections: {
      problem:
        "Lab 6 required a capacitance meter using an actual 555 IC, a non-8051 MCU (C only, no assembly), and a 16x2 LCD. The measurement range was 1 nF to 1 uF. The 555 astable mode encodes capacitance as a frequency shift -- the challenge is choosing the right R values for the full range and doing accurate frequency measurement on the MCU.",
      goals: [
        "Wire a 555 timer in astable mode so oscillation frequency tracks the unknown capacitance",
        "Measure the 555 output frequency using a hardware timer on a non-8051 MCU",
        "Compute capacitance from the astable equation f = 1 / (1.386 * R * C)",
        "Display the result in nF or uF on a 16x2 LCD",
        "Calibrate against known capacitor values across the 1 nF to 1 uF range",
      ],
      designDecisions:
        "Fixed resistor values were chosen so the 555 output frequency stays in a range the MCU timer handles accurately across the full 1 nF to 1 uF span. The MCU uses hardware timer input capture to timestamp the 555 output edges directly, which is more accurate than a software polling loop. The C program inverts the astable formula to extract capacitance and selects nF or uF units for the LCD based on the computed value.",
      validation:
        "Calibrated against decade capacitor values from 1 nF to 1 uF. Readings were compared against a bench meter. The R constant in firmware was adjusted until error was within a few percent across the full range.",
      results:
        "Working capacitance meter reading 1 nF to 1 uF on the LCD. Readings verified against bench instruments. Demonstrated to lab TA.",
    },
    specs: [
      { label: "MCU", value: "Non-8051 (ATMega328P / MSP430 / PIC32 / LPC824 / STM32L051)" },
      { label: "Language", value: "C" },
      { label: "Measurement IC", value: "NE555 single timer, astable configuration" },
      { label: "Measurement range", value: "1 nF to 1 uF" },
      { label: "Frequency formula", value: "f = 1 / (1.386 * R * C)" },
      { label: "Display", value: "16x2 LCD" },
      { label: "Frequency measurement", value: "Hardware timer input capture" },
    ],
    process: [
      {
        title: "555 astable circuit and R selection",
        description:
          "The 555 is wired in astable mode with fixed resistors and the unknown capacitor setting the RC time constant. R values were chosen so the frequency output spans a range the MCU timer can resolve accurately from 1 nF to 1 uF without overflow at small capacitances or excessive period at large ones.",
      },
      {
        title: "MCU frequency measurement",
        description:
          "The MCU timer input capture records the timestamp of each 555 output edge. The period is computed from consecutive edge timestamps and converted to frequency using the known timer clock frequency. This avoids the jitter that a software polling loop would introduce.",
      },
      {
        title: "Capacitance computation and display",
        description:
          "The C program applies C = 1 / (1.386 * R * f) to get capacitance, selects nF or uF units, and updates the LCD. A short averaging window over several period measurements smooths out cycle-to-cycle variation.",
      },
    ],
    lessons: [
      "The 555 astable formula directly gives capacitance from frequency -- the hard part is R selection so the frequency range is measurable across the full span. A quick spreadsheet calculation of frequency at 1 nF and 1 uF for a given R before soldering saves time.",
      "Hardware timer input capture is more accurate than software frequency counting for this application. Any interrupt latency or loop overhead in a software counter shows up as measurement error.",
      "Calibration against known values is necessary even when the formula is correct. Resistor tolerances and the 555's non-ideal thresholds shift the constant, and firmware adjustment is faster than sourcing precise resistors.",
    ],
    links: [],
  },

  // ── 7. ELEC301 — Cascode Amplifier & Butterworth Filter ───────────
  {
    slug: "elec301-cascode",
    title: "Cascode Amplifier & Butterworth Filter Design",
    tagline:
      "Dual 2N3904 cascode achieving 157 V/V (43.9 dB) + 3rd-order Butterworth LPF + root-locus oscillator analysis",
    category: "software",
    tags: [
      "LTSpice",
      "2N3904",
      "Cascode",
      "BJT",
      "Active Filter",
      "Butterworth",
      "Root Locus",
      "ELEC301",
    ],
    date: "2025",
    featured: false,
    coverImage: "/assets/projects/elec301-cascode/thumbnail.png",
    images: [
      "/assets/projects/elec301-cascode/thumbnail.png",
      "/assets/projects/elec301-cascode/poles.gif",
    ],
    reportUrl: "/assets/projects/elec301-cascode/report.pdf",
    summary:
      "ELEC 301 Mini Project 2 -- three problems in one report. Problem 1: design a dual 2N3904 cascode amplifier from scratch meeting tight midband specs (VCC = 20 V, Rout = 2.5 kOhm +/- 250 Ohm, Rin >= 3.5 kOhm, |AM| >= 50 V/V, omega_L <= 1200 rad/s). I biased both transistors by dividing VCC into quarters (VE1 = 5 V, VC1 = VE2 = 10 V, VC2 = 15 V), derived the bias resistors from the current budget (RC = RE = 2.5 kOhm, IC = 2 mA, gm = 80 mS, r_pi = 3.75 kOhm), then sized the coupling and bypass capacitors from the cutoff spec. The calculated midband gain came out to 157.3 V/V (43.9 dB). LTSpice verified the DC operating point and Bode plot: fL3dB at ~90 Hz and fH3dB at ~6.6 MHz. Problem 2: a second BJT amplifier variant analysis. Problem 3: a 3rd-order Butterworth low-pass filter with 3 dB cutoff at 10 kHz designed from coefficient tables, plus root locus analysis of a feedback oscillator.",
    sections: {
      problem:
        "Three-part design project. First: design a dual 2N3904 cascode amplifier meeting Rout = 2.5 kOhm +/- 250 Ohm, Rin >= 3.5 kOhm, |AM| >= 50 V/V, omega_L <= 1200 rad/s. Second: BJT amplifier analysis with biasing and impedance verification. Third: 3rd-order Butterworth LPF with 3 dB cutoff at 10 kHz, and root locus analysis of a feedback oscillator to identify marginal stability.",
      goals: [
        "Bias dual 2N3904 cascode with VCC = 20 V using quarter-VCC voltage division: VE1 = 5 V, VC1 = VE2 = 10 V, VC2 = 15 V",
        "Derive RC = RE = 2.5 kOhm, RB1 = 46.4 kOhm, RB2 = 25.5 kOhm, RB3 = 30 kOhm, gm = 80 mS, r_pi = 3.75 kOhm",
        "Add R1 = 560 Ohm in series with RS to meet Rin >= 3.5 kOhm (total Rin = 3.508 kOhm)",
        "Size CE = CC1 = CC2 = 120 uF from the cutoff frequency spec (omega_L <= 1200 rad/s)",
        "Design 3rd-order Butterworth LPF with cutoff at 10 kHz using normalised coefficient tables",
        "Verify everything in LTSpice: DC operating point, Bode plot, pole locations, root locus",
      ],
      designDecisions:
        "The cascode topology gives Rout approximately equal to RC since the cascode output impedance is much larger. This means the RC = 2.5 kOhm selection directly satisfies the Rout spec. Both transistors are biased at IC = 2 mA with the emitter voltage of each stage at 1/4, 2/4, 3/4 VCC, ensuring forward-biased BEJs and reverse-biased CBJs. R1 = 560 Ohm was added in series with RS to boost Rin above the 3.5 kOhm minimum. CE dominates the lower cutoff frequency pole because its effective resistance is small (about 14 Ohm), so CE is sized first and CC1/CC2 can use the same value. The Butterworth filter coefficients are normalised to 1 rad/s then frequency-scaled to 10 kHz by dividing all capacitor values by the cutoff frequency.",
      validation:
        "LTSpice .op command verified DC operating points against hand calculations: Q1 (VC = 9.972 V, VB = 5.665 V, VE = 4.993 V, IC = 1.991 mA), Q2 (VC = 15.039 V, VB = 10.645 V, VE = 9.972 V, IC = 1.984 mA). Simulated Bode plot confirms fL3dB at ~90 Hz and fH3dB at ~6.6 MHz, meeting the omega_L <= 1200 rad/s spec. Simulated midband gain 43.601 dB vs calculated 43.934 dB. Root locus verified marginal stability conditions for the oscillator.",
      results:
        "Cascode amplifier met all specs: Rout = 2.5 kOhm, Rin = 3.508 kOhm, |AM| = 157.3 V/V = 43.9 dB, fL3dB ~90 Hz. Butterworth filter 3 dB point confirmed at 10 kHz in simulation. Oscillator root locus correctly identifies marginal stability at the design frequency. The poles GIF in the gallery shows the frequency response and pole locations.",
    },
    specs: [
      { label: "Circuit", value: "Dual 2N3904 cascode amplifier" },
      { label: "Supply voltage", value: "VCC = 20 V" },
      { label: "Bias voltages", value: "VE1 = 5 V, VC1 = VE2 = 10 V, VC2 = 15 V" },
      { label: "Collector current", value: "IC = 2 mA (both transistors)" },
      { label: "Transconductance", value: "gm = 80 mS, r_pi = 3.75 kOhm" },
      { label: "Key resistors", value: "RC = RE = 2.5 kOhm, RB1 = 46.4 kOhm, RB2 = 25.5 kOhm, RB3 = 30 kOhm, R1 = 560 Ohm" },
      { label: "Capacitors", value: "CE = CC1 = CC2 = 120 uF" },
      { label: "Midband gain", value: "|AM| = 157.3 V/V = 43.9 dB (calc) / 43.6 dB (sim)" },
      { label: "Input resistance", value: "Rin = 3.508 kOhm (meets >= 3.5 kOhm spec)" },
      { label: "Output resistance", value: "Rout = RC = 2.5 kOhm" },
      { label: "Bandwidth", value: "fL3dB ~90 Hz, fH3dB ~6.6 MHz" },
      { label: "Filter", value: "3rd-order Butterworth LPF, 3 dB at 10 kHz" },
      { label: "Simulation tool", value: "LTSpice (AC sweep + .op operating point)" },
    ],
    process: [
      {
        title: "Transistor biasing",
        description:
          "Divided VCC into quarters to set stable bias points: VE1 = 1/4 VCC = 5 V, VC1 = VE2 = 2/4 VCC = 10 V, VC2 = 3/4 VCC = 15 V. Set VBE = 0.7 V for each transistor. Derived IC = 2 mA from VCC and RC. Used beta = 300 from 2N3904 datasheet to find IB = 6.6 uA and IE. Set bias current I1 = 0.1 * IE for stable operation and derived RB1, RB2, RB3 from Ohm's law. Found gm = IC/VT = 80 mS and r_pi = beta/gm = 3.75 kOhm.",
      },
      {
        title: "Input resistance fix and capacitor sizing",
        description:
          "Initial Rin = RB3//RB2//r_pi = 2.948 kOhm fell short of the 3.5 kOhm spec. Added R1 = 560 Ohm in series with RS to bring Rin up to 3.508 kOhm. For capacitors, CE dominates the lower cutoff pole because its effective resistance is ~14 Ohm vs. several kOhm for CC1 and CC2. Set the cutoff at omega = 600 rad/s (50% of the 1200 rad/s max) to give margin. Computed CE = 116 uF, rounded to the standard 120 uF. Used 120 uF for CC1 and CC2 as well since CE dominates.",
      },
      {
        title: "LTSpice verification",
        description:
          "Built the full cascode circuit in LTSpice with standard resistor values. Ran .op to verify DC operating point against hand calculations -- all node voltages and branch currents agreed within 1%. Ran AC sweep from 1 mHz to 1 THz with 1000 steps per decade. Bode plot confirmed midband gain of 43.601 dB, fL3dB at ~90 Hz and fH3dB at ~6.6 MHz.",
      },
      {
        title: "Butterworth filter and root locus",
        description:
          "Designed the 3rd-order Butterworth filter using normalised coefficient tables. Chose capacitor values, then computed the required resistors by frequency-scaling the normalised design to 10 kHz. Verified the 3 dB point in LTSpice AC simulation. For the oscillator, plotted the root locus and identified the gain at which the closed-loop poles cross the imaginary axis (marginal stability).",
      },
    ],
    lessons: [
      "The cascode's Rout being approximately RC makes the output resistance spec almost trivially satisfied once RC is chosen. The tricky part is that increasing RC to hit Rout also reduces gain headroom because AM depends on RC // RL.",
      "When Rin falls short, adding a resistor in series with RS is the cleanest fix. It increases Rin by exactly that resistor value and does not disturb any of the bias currents.",
      "CE dominates the lower cutoff frequency because its effective resistance (1/gm // RE/(beta+1)) is much smaller than the resistance seen by CC1 or CC2. Sizing CE first, then using the same value for CC1 and CC2, is safe and simpler.",
      "LTSpice .op for DC operating point verification before running AC sweeps saves debugging time. If the bias is wrong, the small-signal parameters are wrong, and the Bode plot will be off in a way that is hard to diagnose from frequency response alone.",
    ],
    links: [
      {
        label: "Full Report (PDF)",
        url: "/assets/projects/elec301-cascode/report.pdf",
      },
    ],
  },

  // ── 8. ELEC301 — BJT Amplifier Analysis ───────────────────────────
  {
    slug: "elec301-amplifiers",
    title: "BJT Amplifier Frequency Analysis",
    tagline:
      "OC/SC time constants on a 4-pole RC bandpass + Miller's theorem on CE/CB/CC BJTs -- poles at 14.2 Hz, 312.6 Hz, 5.9 MHz, 38.6 MHz",
    category: "software",
    tags: ["LTSpice", "BJT", "OC/SC Method", "Miller's Theorem", "Bode Plot", "Frequency Response", "ELEC301"],
    date: "2025",
    featured: false,
    coverImage: "/assets/projects/elec301-amplifiers/thumbnail.png",
    images: ["/assets/projects/elec301-amplifiers/thumbnail.png"],
    reportUrl: "/assets/projects/elec301-amplifiers/report.pdf",
    summary:
      "ELEC 301 Mini Project 1 -- frequency response analysis across four problems. Problem 1: a four-pole RC bandpass filter with component values R1=50 Ohm, R2=R3=R4=500 Ohm, C1=20 uF, C2=100 pF, C3=500 nF, C4=100 pF. I used the open-circuit / short-circuit (OC/SC) time constant method to find all four poles by hand without solving the full transfer function. C3 dominates the low-frequency cutoff (tau_C3 = 522.7 us, fc3 = 304.5 Hz), and the combined high-frequency cutoff from C2 and C4 comes out to 6.01 MHz. LTSpice AC sweep confirmed poles at 14.22 Hz, 312.6 Hz, 5.90 MHz, and 38.61 MHz -- close agreement with the OC/SC method. Problem 1B validated the method by sweeping C3 across five values and comparing calculated vs simulated cutoff frequencies. Problems 2-4 analyse a transconductance amplifier and CE/CB/CC BJT configurations using Miller's theorem to decouple the feedback capacitance and find high-frequency poles.",
    sections: {
      problem:
        "Four-part frequency response analysis project. Problem 1: find all four poles of an RC bandpass filter analytically using OC/SC time constants, then verify in LTSpice. Problem 1B: validate by parametrically sweeping C3 and tracking the cutoff shift. Problems 2-4: analyse a transconductance amplifier and CE/CB/CC BJT amplifiers using Miller's theorem for high-frequency pole approximation and OC/SC for the full pole set.",
      goals: [
        "Apply OC/SC time constant method to find all four poles of a 4-element RC bandpass filter",
        "Identify the dominant LF capacitor (C3: tau = 522.7 us, fc = 304.5 Hz) and dominant HF capacitors (C2, C4)",
        "Verify LTSpice AC sweep poles against OC/SC hand calculations",
        "Problem 1B: parametrically sweep C3 from 500 nF to 10 uF and confirm LF cutoff tracks inversely",
        "Apply Miller's theorem to a transconductance amplifier (k = -G*R3//R4 = -100) to find high-frequency poles",
        "Compare CE, CB, and CC BJT configurations for midband gain, Rin, and Rout",
      ],
      designDecisions:
        "The OC/SC method avoids solving the full transfer function by treating each capacitor individually while shorting or open-circuiting the others. C1 and C3 are LF capacitors (large value, block at low frequency), C2 and C4 are HF capacitors (small value, short at high frequency). For the LF analysis: open C2/C4, short C3 to find tau_C1, then short C1 and open C2/C4 to find tau_C3. tau_C3 is dominant (304.5 Hz vs 20.8 Hz for tau_C1). For HF: short C1/C3, open C4 to find tau_C2, open C2/C3 to find tau_C4. Both are similar magnitude, so the combined tau_3dB = sqrt(tau_C2^2 + tau_C4^2) = 26.45 ns gives f3dB = 6.01 MHz. Miller's theorem for the transconductance amplifier: k = -G*(R3//R4) = -0.1 * 1000 = -100, so C_in = C3/(1-k) and C_out = C3*k/(k-1).",
      validation:
        "LTSpice AC sweep from 1 mHz to 1000 GHz with 1000 steps/decade. Midband gain of -7.23 dB identified. Cutoff frequencies read from the Bode plot at midband - 3 dB. Simulated poles: 14.22 Hz, 312.6 Hz, 5.90 MHz, 38.61 MHz. Calculated poles: 20.8 Hz (C1), 304.5 Hz (C3, dominant), 36.6 MHz (C2), 6.1 MHz (C4), combined HF f3dB = 6.01 MHz. Problem 1B error table: at C3 = 500 nF, error = 2.6%; at C3 = 10 uF, error grows to 49.6% because the OC/SC approximation breaks down as C3 approaches the same order as the other capacitors.",
      results:
        "Four poles located at 14.22 Hz, 312.6 Hz, 5.90 MHz, and 38.61 MHz -- consistent between OC/SC hand analysis and LTSpice. C3 confirmed as the dominant LF pole. Combined HF cutoff at 6.01 MHz (calculated) vs 5.90 MHz (simulated), 1.86% error. Miller's theorem gave k = -100 for the transconductance stage. CE/CB/CC BJT resistance comparison confirmed textbook impedance trade-offs across all three topologies.",
    },
    specs: [
      { label: "Filter topology", value: "4-pole RC bandpass" },
      { label: "Component values", value: "R1=50 Ohm, R2=R3=R4=500 Ohm, C1=20 uF, C2=100 pF, C3=500 nF, C4=100 pF" },
      { label: "Midband gain", value: "-7.23 dB" },
      { label: "LF poles (simulated)", value: "14.22 Hz, 312.6 Hz" },
      { label: "HF poles (simulated)", value: "5.90 MHz, 38.61 MHz" },
      { label: "Dominant LF pole", value: "C3: tau = 522.7 us, fc = 304.5 Hz" },
      { label: "Combined HF f3dB", value: "6.01 MHz (calc) / 5.90 MHz (sim) -- 1.86% error" },
      { label: "Analysis method", value: "OC/SC time constants + Miller's theorem" },
      { label: "Simulation tool", value: "LTSpice AC sweep, 1 mHz to 1 THz, 1000 steps/decade" },
      { label: "Transconductance amp", value: "G = 0.1 S, k = -100 (Miller's theorem)" },
    ],
    process: [
      {
        title: "OC/SC time constant method for the 4-pole RC filter",
        description:
          "For each LF capacitor, open all HF capacitors and short the other LF capacitors, then compute tau = R_eq * C. C3 sees R_eq = R1//R2 + R3 + R4 = 522.7 kOhm, giving tau_C3 = 522.7 us and fc = 304.5 Hz. C1 sees R_eq = R1 + R2//(R3+R4) = 369.2 Ohm, giving fc = 20.8 Hz. C3 dominates. For HF capacitors, short all LF caps and open the other HF caps. Computed tau_C2 = 4.35 ns (fc = 36.6 MHz) and tau_C4 = 26.09 ns (fc = 6.1 MHz). Combined: tau_3dB = sqrt(tau_C2^2 + tau_C4^2) = 26.45 ns, giving f3dB = 6.01 MHz.",
      },
      {
        title: "LTSpice verification and pole identification",
        description:
          "Built the RC filter in LTSpice and ran an AC sweep from 1 mHz to 1000 GHz. The Bode magnitude plot shows the bandpass shape. The midband gain was -7.23 dB, so the cutoff points were read at -10.23 dB. LTSpice cursors identified the four pole locations at 14.22 Hz, 312.6 Hz, 5.90 MHz, and 38.61 MHz -- within a few percent of the OC/SC predictions for the dominant poles.",
      },
      {
        title: "Problem 1B: parametric C3 sweep",
        description:
          "Varied C3 from 500 nF to 10 uF in five steps and recorded the simulated and calculated LF cutoff frequency at each value. At 500 nF the error was 2.6%, growing to 49.6% at 10 uF. This shows the OC/SC approximation is accurate when C3 is clearly the dominant capacitor but degrades when C3 becomes comparable in value to C1.",
      },
      {
        title: "Miller's theorem and BJT amplifier analysis",
        description:
          "For the transconductance amplifier, the feedback capacitor C3 bridges input and output. Miller's theorem splits it into Cin = C3/(1-k) and Cout = C3*k/(k-1) where k = -G*(R3//R4) = -100. Applied OC/SC to the resulting uncoupled circuit to find the pole locations. For CE/CB/CC BJT amplifiers, computed Rin and Rout from the small-signal model and compared against LTSpice simulations at each topology.",
      },
    ],
    lessons: [
      "The OC/SC method gives useful pole approximations without solving the full transfer function. The key insight is that each capacitor's time constant can be computed independently when the others are shorted or opened. The method is accurate when one pole is clearly dominant and loses accuracy when poles are close together.",
      "C3 = 500 nF is the dominant LF pole because its effective resistance (R1//R2 + R3 + R4 = 1045 Ohm) is much larger than what C1 sees (370 Ohm). Always check both time constants before assuming one dominates.",
      "LTSpice AC sweep is fast to set up for pole verification. The trick is setting the sweep range wide enough (1 mHz to 1 THz for this circuit) to see all four poles clearly on the Bode plot.",
      "Miller's theorem only works cleanly when the local gain k is well-defined. For the transconductance stage, k = -100 is large enough that C_in = C3/101 is much smaller than C3, which is why the HF pole location shifts significantly from its short-circuit position.",
    ],
    links: [
      {
        label: "Full Report (PDF)",
        url: "/assets/projects/elec301-amplifiers/report.pdf",
      },
    ],
  },

  // ── 9. Alarm Clock in 8051 ────────────────────────────────────────
  {
    slug: "alarm-clock-8051",
    title: "Alarm Clock in 8051",
    tagline:
      "N76E003 alarm clock in assembly — three concurrent ISRs, 12-hour AM/PM display, pushbutton-settable time and alarm",
    category: "embedded",
    tags: ["N76E003", "8051", "Assembly", "ISR", "Timer", "LCD", "GPIO"],
    date: "2024",
    featured: false,
    coverImage: "/assets/alarm-clock.jpg",
    images: [
      "/assets/alarm-clock.jpg",
      "/assets/alarm-clock.png",
      "/assets/projects/alarm-clock-8051/lab2.mp4",
      "/assets/projects/alarm-clock-8051/lab2_2.mp4",
    ],
    summary:
      "An alarm clock written in assembly for the N76E003 (8051-compatible) microcontroller, built for ELEC 291 Lab 2. The whole design is interrupt-driven: Timer 2 fires every 500 ms to increment the BCD time variables, Timer 0 generates a 2 kHz square wave at pin P1.7 for the speaker alarm. Three ISRs run concurrently while the main loop handles the LCD refresh and pushbutton debounce. The clock displays hours, minutes, and seconds in 12-hour AM/PM format on a 4-bit LCD. You can set the current time and the alarm time independently using the pushbuttons. When the alarm matches the current time, the speaker fires. No polling anywhere in the timekeeping path, which is what keeps it drift-free over multi-hour runs.",
    sections: {
      problem:
        "The lab required building an alarm clock entirely in 8051 assembly, using hardware timer interrupts for timekeeping and a speaker for the alarm. The constraints: 12-hour AM/PM display, pushbutton-settable time and alarm, no drift from polling. Everything had to be structured so the main loop could handle the display and buttons without blocking the ISRs.",
      goals: [
        "Use Timer 2 ISR to increment BCD time variables every 500 ms without polling drift",
        "Use Timer 0 ISR to generate a 2 kHz square wave at P1.7 for the speaker alarm",
        "Display HH:MM:SS in 12-hour AM/PM format on a 4-bit LCD",
        "Allow pushbutton setting of current time (hours, minutes, seconds, AM/PM) and alarm time independently",
        "Trigger speaker when alarm matches current time",
      ],
      designDecisions:
        "Three concurrent ISRs handle all time-critical work: Timer 2 at 500 ms for the BCD clock increment, Timer 0 at 2 kHz for the speaker square wave, and a 1 ms P0.4 toggle used for oscilloscope verification during testing. The main loop exclusively handles LCD refresh and debounced pushbutton reads. BCD storage for hours, minutes, and seconds means the display conversion is just a nibble split, keeping the main loop fast. The 12-hour rollover and AM/PM flag flip are handled inside the Timer 2 ISR.",
      validation:
        "The 500 ms tick was verified with an oscilloscope on P0.4 (1 ms toggle), and the 2 kHz speaker output was confirmed clean at P1.7. Clock accuracy was tested over several hours with no measurable drift. Alarm trigger was tested by setting the alarm a few minutes ahead and confirming the speaker fired at the correct time. The demo videos in the gallery show the clock running in real time.",
      results:
        "Accurate timekeeping over multi-hour test runs with no measurable drift. Alarm triggers reliably at the set time. All three ISRs run concurrently without timing conflicts.",
    },
    specs: [
      { label: "MCU", value: "N76E003 (8051-compatible, 16 MHz)" },
      { label: "Language", value: "8051 Assembly (A51 assembler, CrossIDE)" },
      { label: "Timekeeping ISR", value: "Timer 2 — 500 ms BCD tick (auto-reload mode)" },
      { label: "Speaker ISR", value: "Timer 0 — 2 kHz square wave at P1.7" },
      { label: "Display", value: "16x2 LCD, 4-bit interface" },
      { label: "Time format", value: "12-hour HH:MM:SS with AM/PM" },
      { label: "Input", value: "Pushbuttons on P1.5, P1.6 — time and alarm setting" },
      { label: "Alarm output", value: "Mini speaker via P1.7" },
    ],
    process: [
      {
        title: "ISR architecture planning",
        description:
          "Mapped out which timers to use before writing any code. Timer 2 in auto-reload mode handles the 500 ms BCD tick. Timer 0 in mode 1 toggles P1.7 every 250 µs for the 2 kHz speaker output. Both ISRs save and restore the accumulator and PSW. The main loop runs in a tight spin between ISR firings, handling only the LCD and buttons.",
      },
      {
        title: "BCD timekeeping and 12-hour rollover",
        description:
          "Hours, minutes, and seconds are stored as BCD pairs in internal RAM. Each Timer 2 ISR fires increments seconds by one BCD unit, with carry logic for 60-second and 60-minute rollovers. At 12:00:00, hours rolls back to 01:00:00 and the AM/PM flag flips. The display just splits each BCD byte into two nibbles, keeping it fast enough that the main loop never falls behind the ISRs.",
      },
      {
        title: "Pushbutton debounce and time-setting UI",
        description:
          "Buttons are read in the main loop using a short delay-based debounce. Separate button presses cycle through the fields to set: current hour, minute, second, AM/PM, then alarm hour, minute, second. The LCD updates immediately on each press. The alarm comparison runs in the main loop by comparing the BCD alarm registers against the current time registers.",
      },
      {
        title: "Oscilloscope verification",
        description:
          "Before any clock testing, confirmed ISR timing on the oscilloscope. The 1 ms P0.4 toggle was measured to verify the Timer 2 reload value. The 2 kHz P1.7 square wave was confirmed clean. Only after both ISR periods were verified did multi-hour accuracy testing begin.",
      },
    ],
    lessons: [
      "ISR-driven timekeeping is fundamentally more accurate than polling loops. A polling loop's period changes with every line of code added to the main loop. An ISR fires on the hardware timer regardless of what the main loop is doing.",
      "BCD storage for clock variables is worth using in assembly. Binary-to-decimal conversion inside an ISR is slow and error-prone. BCD lets the display code be a trivial nibble split.",
      "Oscilloscope verification of timer reload values before integration saves debugging time. If the tick is wrong, everything downstream is wrong, and it is hard to tell from the display alone.",
      "Three concurrent ISRs require careful register save/restore discipline. Forgetting to push and pop the accumulator or PSW causes intermittent register corruption that is hard to reproduce.",
    ],
    links: [],
  },

  // ── 10. RISC Machine ──────────────────────────────────────────────
  // {
  //   slug: "risc-machine",
  //   title: "RISC Machine",
  //   tagline:
  //     "RISC CPU in Verilog — fetch / decode / execute on a DE1-SoC, simulated in ModelSim, synthesised in Quartus",
  //   category: "software",
  //   tags: [
  //     "Verilog",
  //     "FPGA",
  //     "DE1-SoC",
  //     "ModelSim",
  //     "Quartus",
  //     "Digital Design",
  //   ],
  //   date: "2024",
  //   featured: false,
  //   coverImage: "",
  //   images: [],
  //   summary:
  //     "Designed a simple RISC CPU in Verilog from the ground up — register file, ALU, control unit, fetch-decode-execute pipeline, the whole stack. Simulated each module in ModelSim, then synthesised the whole thing onto a DE1-SoC FPGA via Quartus and ran test programs on real hardware. Timing constraints met for the target clock. It's the kind of project that finally makes 'how does a CPU actually work' click — you stop thinking of CPUs as magic and start thinking of them as a really well-organised state machine.",
  //   sections: {
  //     results:
  //       "CPU executed all test programs correctly. Timing constraints met for target clock frequency.",
  //   },
  //   links: [],
  // },

  // ── 11. Mini Power Bank ───────────────────────────────────────────
  {
    slug: "mini-powerbank",
    title: "Mini Power Bank",
    tagline:
      "Hand-built USB power bank — Li-ion + boost converter, small enough for a shirt pocket",
    category: "pcb",
    tags: ["Power Electronics", "Li-ion", "Boost Converter", "USB", "PCB"],
    date: "2022",
    featured: false,
    coverImage: "/assets/mini-powerbank.jpg",
    images: [
      "/assets/mini-powerbank.jpg",
      "/assets/mini-powerbank-inside.jpg",
      "/assets/mini-powerbank-inside2.jpg",
    ],
    summary:
      "Built this before I really knew what PCB layout meant. A Li-ion cell, a boost converter board, a USB-A output, and a micro-USB charge-through port — all packed into something that actually fits in a shirt pocket. Charges phones and small USB devices reliably. Looking back I'd redesign half of it, but at the time it taught me about battery safety, current limiting, and the difference between 'works on the bench' and 'survives being thrown in a backpack.'",
    sections: {
      results:
        "Powers phones and small USB devices reliably. Fits in a shirt pocket.",
    },
    links: [],
  },

  // ── 12. The Claw ──────────────────────────────────────────────────
  // {
  //   slug: "the-claw",
  //   title: "The Claw",
  //   tagline:
  //     "Joystick-controlled servo claw — direct proportional control, no oscillation, surprisingly grippy",
  //   category: "robotics",
  //   tags: ["Servo", "Joystick", "Arduino", "Mechanical", "Robotics"],
  //   date: "2021",
  //   featured: false,
  //   coverImage: "/assets/the-claw.jpg",
  //   images: ["/assets/the-claw.jpg"],
  //   summary:
  //     "Three hobby servos, a joystick, an Arduino, and a 3D-printed frame. Finger positions track joystick input proportionally — push the stick further, the fingers close further. No oscillation, no jitter, just clean direct control. Built it as a dexterity toy and ended up using it to grip pretty much anything within reach. Still works.",
  //   sections: {
  //     results:
  //       "Successfully gripped a range of objects. Smooth servo response with no oscillation.",
  //   },
  //   links: [],
  // },

  // ── 13. Audio-Responsive LED ──────────────────────────────────────
  // {
  //   slug: "audio-led",
  //   title: "Audio-Responsive LED",
  //   tagline:
  //     "Microphone → ADC → LED matrix — lights pulse with whatever's playing, no perceptible lag",
  //   category: "embedded",
  //   tags: ["LED", "Audio", "ADC", "Arduino", "Analog"],
  //   date: "2020",
  //   featured: false,
  //   coverImage: "",
  //   images: [],
  //   summary:
  //     "A microphone picks up ambient sound, the ADC samples the level, and an LED matrix brightens / patterns in response — real-time enough that there's no perceptible lag between the beat and the lights. The interesting part isn't the LED side, it's the analog front-end: mic bias, AC coupling, envelope detection. Once that part is clean, everything downstream is easy.",
  //   sections: {
  //     results: "Visually responsive to music with no perceptible latency.",
  //   },
  //   links: [],
  // },

  // // ── 14. Inventory Analysis System ─────────────────────────────────
  // {
  //   slug: "inventory-analysis",
  //   title: "Inventory Analysis System",
  //   tagline:
  //     "Excel + VBA tool I built for my family's electronics shop — real-time stock, alerts, sales analytics",
  //   category: "software",
  //   tags: ["Excel", "VBA", "Data Analysis", "Automation"],
  //   date: "2020",
  //   featured: false,
  //   coverImage: "/assets/inventory-analysis.png",
  //   images: ["/assets/inventory-analysis.png"],
  //   summary:
  //     "An Excel + VBA tool I built for my family's electronics shop in Bali. Tracks stock levels in real time, fires low-stock alerts before things sell out, and generates sales summaries automatically. Replaced a lot of manual paperwork and caught a few out-of-stock situations before they cost us a sale. Not glamorous, but useful — and a reminder that 'engineering' includes spreadsheets when that's what the problem actually needs.",
  //   sections: {
  //     results:
  //       "Reduced manual stock-checking time significantly. Prevented several out-of-stock situations.",
  //   },
  //   links: [],
  // },

  // ── 15. Kinetic-Powered LED ───────────────────────────────────────
  // {
  //   slug: "kinetic-led",
  //   title: "Kinetic-Powered LED",
  //   tagline:
  //     "Hand-crank dynamo → bridge rectifier → cap → LEDs. Physics demo, the old-school way.",
  //   category: "embedded",
  //   tags: ["Generator", "Rectifier", "LED", "Power Electronics"],
  //   date: "2019",
  //   featured: false,
  //   coverImage: "",
  //   images: [],
  //   summary:
  //     "A hand-crank dynamo wired to a bridge rectifier and a smoothing capacitor, driving LEDs. The classic 'see physics happen in real time' demo. Crank fast enough and the LEDs light up cleanly — multimeter confirms the DC out of the cap is reasonably smooth. One of the first circuits I built that wasn't straight out of a textbook.",
  //   sections: {
  //     results:
  //       "LEDs light up reliably from moderate cranking speed. Clean DC output confirmed with multimeter.",
  //   },
  //   links: [],
  // },

  // ── 16. Spreadsheet Cashier System ────────────────────────────────
  {
    slug: "cashier-system",
    title: "Spreadsheet Cashier System",
    tagline:
      "Google Sheets POS for the family shop — transactions, balances, daily totals, near-zero arithmetic errors",
    category: "software",
    tags: ["Google Sheets", "Apps Script", "POS", "Automation"],
    date: "2019",
    featured: false,
    coverImage: "/assets/cashier-system.png",
    images: ["/assets/cashier-system.png"],
    summary:
      "A Google Sheets-based point-of-sale system I built for my family's shop, Tjahya Elektronik. Records every transaction, calculates change, tracks daily totals, and flags discrepancies the moment they show up. Replaced the manual cashbook we'd been using forever — and dropped arithmetic errors to nearly zero. Built with Apps Script, deployed on a shared spreadsheet so anyone in the shop could use it from any device. Worked so well it stayed in production for years.",
    sections: {
      results: "Replaced manual cashbook with near-zero arithmetic errors.",
    },
    links: [],
  },
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): ProjectData[] {
  return projects.filter((p) => p.featured);
}

export function getProjectsByCategory(category: string): ProjectData[] {
  if (category === "all") return projects;
  return projects.filter((p) => p.category === category);
}
