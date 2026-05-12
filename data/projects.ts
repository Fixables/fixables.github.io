import type { ProjectData } from '@/types/project'

export const projects: ProjectData[] = [
  // ── 1. Haptic Knob ────────────────────────────────────────────────
  {
    slug: 'haptic-knob',
    title: 'Haptic Knob',
    tagline: 'BLDC knob that lets you feel circuits — capacitors spring back, inductors resist acceleration, diodes block in reverse',
    category: 'firmware',
    tags: ['ESP32', 'BLDC', 'FOC', 'PID', 'C++', 'FreeRTOS', 'Motor Control'],
    date: '2024',
    status: 'Ongoing',
    role: 'Solo — hardware design, PCB layout, firmware (FreeRTOS + FOC), and mechanical',
    featured: true,
    coverImage: '',
    images: [],
    model3d: '/assets/models/haptic-knob.glb',
    summary:
      "Here's the idea: what if a capacitor felt like a spring? An inductor like resistance to acceleration? A diode like a one-way ratchet? That's exactly what this knob does. It's a 3-phase BLDC motor running Field-Oriented Control on an ESP32, and the firmware computes a real-time torque command that mimics circuit behaviour. Turn it past zero and it springs back (V = Q/C). Spin it fast and it pushes back like a damper (V = Rω). The motor becomes a haptic voltage source. The math is just the electrical-to-mechanical analogy from first-year physics — the fun part is that with a tight control loop (~1 kHz, < 2 ms latency), it actually feels right.",
    sections: {
      problem:
        "Circuits are normally invisible — you see them on an oscilloscope, never in your hand. I wanted a knob that lets you feel circuit element behaviour directly: resistance as velocity damping, capacitance as a position spring, inductance as resistance to acceleration, and a diode as one-way blocking. The hard constraint was that it had to be smooth and silent — any cogging noise or PWM whine would instantly break the illusion, which meant six-step commutation was out and FOC was the only real option.",
      goals: [
        'Implement FOC for smooth, silent torque control at low RPM',
        'Encode R, L, C, RLC, and diode behaviour as distinct haptic torque profiles',
        'Run under real-time constraints using dual-core FreeRTOS on ESP32-PICO',
        'Integrate SSI encoder, SPI current ADC, and SPI OLED display with clean task separation',
      ],
      designDecisions:
        'FOC chosen over six-step commutation for torque smoothness — cogging noise from simpler PWM approaches would break the haptic illusion. Dual-core FreeRTOS gives Core 0 full ownership of the deterministic 1 kHz control loop; Core 1 handles all non-real-time work (OLED, telemetry, watchdog). Kalman filtering used for velocity estimation instead of finite-difference to suppress encoder quantisation noise at low speeds.',
      validation:
        'Phase currents verified on oscilloscope for three-phase balance. End-to-end haptic latency measured at < 2 ms. All five haptic profiles (R, L, C, RLC, Diode) tested subjectively for naturalness. FOC confirmed to eliminate cogging noise present in six-step commutation.',
      results:
        'Smooth, silent haptic feedback across all profiles. < 2 ms end-to-end latency. FOC eliminated cogging noise. Haptic analogies feel perceptually correct: the capacitor profile genuinely feels like winding a spring, the diode profile blocks motion in one direction.',
    },
    specs: [
      { label: 'MCU', value: 'ESP32-PICO-D4' },
      { label: 'Motor type', value: 'Gimbal BLDC (3-phase)' },
      { label: 'Motor control', value: 'Field-Oriented Control (FOC)' },
      { label: 'Control loop rate', value: '~1 kHz (ControlTask, Core 0)' },
      { label: 'End-to-end haptic latency', value: '< 2 ms' },
      { label: 'Position sensing', value: 'SSI magnetic encoder via SPI' },
      { label: 'Current sensing', value: 'External SPI ADC — low-side shunt resistors' },
      { label: 'State estimation', value: 'Kalman filter (θ and ω)' },
      { label: 'Display', value: 'SPI OLED' },
      { label: 'RTOS', value: 'FreeRTOS — dual-core (Core 0: control, Core 1: UI)' },
      { label: 'Language', value: 'C++ — PlatformIO / ESP-IDF' },
      { label: 'Haptic profiles', value: 'Resistor, Capacitor, Inductor, RLC, Diode' },
    ],
    process: [
      {
        title: 'Electrical-to-mechanical analogy',
        description:
          'Mapped circuit variables to knob kinematics: voltage → torque, current → angular velocity, charge → angular displacement. This one-to-one mapping gives each element a clean torque equation: V=IR → T=Rω (resistor), V=Q/C → T=θ/C (capacitor), V=L·di/dt → T=L·α (inductor). The RLC model combines all three.',
      },
      {
        title: 'FOC firmware architecture',
        description:
          'Core 0 runs the deterministic 1 kHz control loop: SSI encoder read (SPI) → Kalman filter for θ and ω → haptic model computes desired current → SPI ADC reads measured current → PID current controller → motor driver output. Core 1 handles OLED refresh, serial telemetry, and watchdog heartbeat monitoring.',
      },
      {
        title: 'Haptic profile encoding',
        description:
          'Each circuit law becomes a q-axis torque command injected into the FOC loop. R profile uses angular velocity (T=Rω), C profile uses displacement (T=θ/C), L profile uses acceleration (T=Lα), RLC combines all three for damped oscillator behaviour, Diode enforces asymmetric one-way motion by applying a large opposing torque in the blocked direction.',
      },
      {
        title: 'Validation and tuning',
        description:
          'Phase currents verified on oscilloscope for three-phase balance. Haptic latency measured at < 2 ms end-to-end. Profiles tuned subjectively — physically accurate equations do not always feel intuitive, so parameters were adjusted iteratively. Watchdog task with latched fault flags proved essential for catching control loop stalls during development.',
      },
    ],
    lessons: [
      'FOC becomes intuitive when you stop thinking about "3-phase control" and think about current control in a rotating d/q reference frame — torque is simply the q-axis current, cleanly decoupled from flux.',
      'Kalman filtering for velocity estimation dramatically outperforms finite-difference differentiation, especially at low speeds where encoder quantisation noise dominates.',
      'Dual-core FreeRTOS is a natural fit for real-time control: Core 0 owns the deterministic loop with no blocking I/O, Core 1 handles everything else. Clear core ownership prevents preemption surprises.',
      'Haptic feel is deeply subjective. Physically accurate equations do not always feel perceptually correct — tuning required real hands on the knob, not just oscilloscope traces.',
      'Design watchdog tasks from day one, not bolted on later. A latched fault flag saved hours of debugging when the control loop stalled silently during early firmware development.',
    ],
    links: [{ label: 'GitHub', url: 'https://github.com/Fixables' }],
    subsystems: [
      {
        label: 'Hardware',
        icon: 'CircuitBoard',
        summary: 'ESP32-PICO, current sensing, encoder, SPI OLED, power supply',
        body: 'The board centres on an ESP32-PICO-D4 with integrated flash. Three-phase current is sensed on each leg via low-side shunt resistors read by the ADC. A magnetic encoder reads rotor position for FOC. An SPI OLED displays active haptic profile. Power flows through a 3.3 V LDO and a separate gate-drive rail for the BLDC bridge.',
        tags: ['ESP32-PICO', 'Current Sensing', 'Magnetic Encoder', 'SPI', 'OLED'],
        defaultOpen: true,
      },
      {
        label: 'Firmware',
        icon: 'Cpu',
        summary: 'Dual-core FreeRTOS, FOC loop, haptic profile encoding',
        body: 'Core 0 runs the real-time FOC loop at ~10 kHz: read encoder → compute d/q currents → PI current controllers → inverse Park/Clarke → SVPWM. Core 1 handles haptic profile logic, OLED refresh, and USB Serial. Profiles encode R (damping), L (velocity spring), C (position spring), and diode (asymmetric friction) as torque commands injected into the FOC q-axis.',
        tags: ['FreeRTOS', 'FOC', 'PID', 'SVPWM', 'C++'],
      },
      {
        label: 'Mechanical',
        icon: 'Wrench',
        summary: 'Motor mount, knob shaft coupling, housing',
        body: 'A gimbal BLDC motor is coupled to the knob shaft via a 3D-printed press-fit hub. The housing clamps the motor at a precise axial offset to minimise wobble. The knob cap is turned on a lathe for consistent feel. All structural parts are PLA with M3 heat-set inserts for durability.',
        tags: ['3D Printing', 'PLA', 'BLDC Gimbal Motor'],
      },
      {
        label: 'Testing',
        icon: 'FlaskConical',
        summary: 'Oscilloscope phase current verification, haptic profile latency',
        body: 'Phase currents were verified on an oscilloscope to confirm balanced three-phase excitation. End-to-end haptic latency (input → torque response) was measured at under 2 ms. Haptic profiles were evaluated subjectively for naturalness across R, L, C, RLC, and diode modes. FOC confirmed to eliminate cogging noise present in simpler six-step commutation.',
        tags: ['Oscilloscope', 'Latency Measurement', 'FOC Verification'],
      },
    ],
  },

  // ── 2. RoboMaestro ────────────────────────────────────────────────
  {
    slug: 'robomaestro',
    title: 'RoboMaestro',
    tagline: 'Discrete MOSFET H-bridge motor driver — built in Altium because off-the-shelf drivers hide all the interesting parts',
    category: 'pcb',
    tags: ['Altium Designer', 'H-Bridge', 'MOSFET', 'Gate Driver', 'PWM', 'Power Electronics', 'PCB'],
    date: '2025',
    featured: true,
    coverImage: '',
    images: [],
    model3d: '/assets/models/robomaestro.glb',
    fabStats: {
      layers: 2,
      dimensions: '— mm',
      minTrace: '0.2 mm',
      minVia: '0.3 mm drill',
      surface: 'HASL',
      manufacturer: 'JLCPCB',
    },
    pcbLayers: [
      { name: 'Top',    label: 'Top Layer',    url: '/assets/projects/robomaestro/layers/top.png',    color: '#c87533', defaultVisible: true },
      { name: 'Bottom', label: 'Bottom Layer', url: '/assets/projects/robomaestro/layers/bottom.png', color: '#4169e1', defaultVisible: true },
    ],
    summary:
      "Most motor driver projects slap an L298N on a breadboard and call it done — but that hides every interesting decision. So I designed one from scratch in Altium: discrete N-channel MOSFETs in an H-bridge, bootstrap circuits for the high-side gate drive, level shifters from 3.3 V logic to 12 V gate domain, and the kind of decoupling network you only learn about after you've watched a half-bridge ring like crazy on an oscilloscope. The board is a 2-layer Altium design with deliberate plane separation: power on the bottom (≥5 A traces), logic on top, ground pour tying it all together. The point was less 'spin a motor' and more 'understand exactly why fast switching is hard.'",
    sections: {
      designDecisions:
        'Discrete MOSFET H-bridge chosen for full control over gate-drive timing and dead-time. Gate-drive networks with decoupling suppression reduce switching noise. Level shifting handles high-side drive.',
      pcbHighlights:
        '2-layer PCB in Altium. Gate-drive networks with decoupling suppression to reduce noise and improve switching robustness. Power and signal planes carefully separated.',
      results: 'PCB fabricated and under bring-up testing. PWM switching verified on bench.',
    },
    links: [
      { label: 'GitHub', url: 'https://github.com/Fixables' },
      { label: 'Schematic PDF', url: '/assets/projects/robomaestro/schematic.pdf' },
    ],
    subsystems: [
      {
        label: 'Hardware',
        icon: 'CircuitBoard',
        summary: 'MOSFET H-bridge, gate-drive network, decoupling, level shifting',
        body: 'Discrete N-channel MOSFETs form the full H-bridge. High-side gate drive is handled by a bootstrap circuit to overcome the source-follower threshold. Gate resistors and Schottky snubbers damp ringing on fast PWM edges. Bulk and ceramic decoupling capacitors are placed close to each MOSFET to suppress supply bounce. Level shifting bridges the 3.3 V logic signal to the 12 V gate drive domain.',
        tags: ['MOSFET', 'Gate Driver', 'Bootstrap', 'Level Shifting', 'Decoupling'],
        defaultOpen: true,
      },
      {
        label: 'PCB Layout',
        icon: 'Layers',
        summary: '2-layer Altium board, power/signal separation, trace widths',
        body: 'Designed as a 2-layer board in Altium Designer. High-current power traces (motor supply and return) are on the bottom layer with widths calculated for ≥5 A. Gate-drive and logic signals are kept on the top layer and routed away from the switching nodes. A solid ground pour ties both layers and minimises the high-frequency loop area on each half-bridge.',
        tags: ['Altium Designer', '2-Layer PCB', 'Power Layout', 'Ground Pour'],
      },
      {
        label: 'Testing',
        icon: 'FlaskConical',
        summary: 'PWM switching verification, bring-up status',
        body: 'PWM switching waveforms verified on oscilloscope at 20 kHz — confirmed dead-time insertion and clean gate transitions. Current draw measured under resistive load. Board is currently in bring-up; motor spin-up under closed-loop control is the next milestone.',
        tags: ['Oscilloscope', 'PWM Verification', 'Bring-Up'],
      },
    ],
  },

  // ── 3. Coin Picking Robot ─────────────────────────────────────────
  {
    slug: 'coin-picking-robot',
    title: 'Coin Picking Robot',
    tagline: 'Three MCUs, a wireless joystick, and an FSM that hunts coins — basically an over-engineered scavenger',
    category: 'robotics',
    tags: ['EFM8LB1', 'MSP430', 'LPC824', 'PWM', 'FSM', 'JDY-40', 'Embedded C'],
    date: '2025',
    featured: true,
    coverImage: '/assets/coin-picking.JPG',
    images: ['/assets/coin-picking.JPG'],
    summary:
      "Three microcontrollers, two operating modes, and a JDY-40 wireless link talking between them. The EFM8LB1 handles motors and sensors, the MSP430 takes care of power, and an LPC824 runs comms. In autonomous mode, an FSM searches for coins, drives over to pick them up, and dodges obstacles with an ultrasonic. In manual mode, you drive it like an RC car with a joystick + LCD remote — complete with turn signals, a headlamp, and a laser alignment guide because once you have a robot, you might as well give it features. Surprisingly reliable across the test arena.",
    sections: {
      designDecisions:
        'Three separate MCUs handle different subsystems — EFM8LB1 for motor/sensor control, MSP430 for power management, LPC824 for comms. JDY-40 wireless links the remote controller to the robot. FSM handles autonomous mode switching cleanly.',
      goals: [
        'Autonomous coin detection and pickup via finite state machine',
        'Manual remote control via joystick with LCD feedback',
        'JDY-40 wireless communication between controller and robot',
        'PWM motor control with ISR-driven real-time response',
      ],
      challenges:
        'Integrating three MCUs with different peripherals required careful protocol design. Wireless link reliability tested across the arena. Ultrasonic obstacle detection integrated for autonomous safety.',
      results:
        'Successfully demonstrated both autonomous and manual modes. Wireless link reliable across test arena. Integrated robustness features: ultrasonic obstacle detector, light-sensitive headlamp, laser alignment guide, coin-counting laser, and turn-signal LEDs.',
    },
    links: [{ label: 'GitHub', url: 'https://github.com/Fixables' }],
  },

  // ── 4. Smart Energy Meter ─────────────────────────────────────────
  {
    slug: 'smart-energy-meter',
    title: 'Smart Energy Meter',
    tagline: 'ESP32 energy monitor — real-time RMS, power factor, and a Python pipeline that catches the weird stuff',
    category: 'embedded',
    tags: ['ESP32', 'IoT', 'SCT-013', 'ZMPT101B', 'TFT Display', 'Python', 'Power Measurement'],
    date: '2025',
    featured: false,
    coverImage: '',
    images: [],
    summary:
      "An ESP32 reads a non-invasive SCT-013 current clamp and a ZMPT101B voltage sensor, then computes RMS, real power, and power factor in firmware. A TFT shows live readings, and a Python backend on the other side logs everything and runs anomaly detection — useful for spotting the kind of weird load behaviour you'd otherwise never notice (like that one appliance that draws way more than it should). Verified against a bench power analyser. It's the kind of project where the firmware is straightforward but the calibration is where you spend half your time.",
    sections: {
      designDecisions:
        'SCT-013 non-invasive current transformer and ZMPT101B voltage sensor feed ADC inputs on the ESP32. RMS computation done in firmware. TFT display shows live readings. Python backend handles long-term logging and analytics.',
      goals: [
        'Real-time RMS voltage, current, power, and power factor measurement',
        'TFT display for live readings',
        'IoT data pipeline for remote monitoring',
        'Python analytics with anomaly detection and short-term forecasting',
      ],
      results: 'Live readings verified against bench power analyser. Python dashboard operational with anomaly detection.',
    },
    links: [{ label: 'GitHub', url: 'https://github.com/Fixables' }],
  },

  // ── 5. Reflow Oven Controller ─────────────────────────────────────
  {
    slug: 'reflow-oven',
    title: 'Reflow Oven Controller',
    tagline: '8051 reflow controller — thermocouple, op-amp, SSR, and a lot of fighting with thermal drift to hit ±2°C',
    category: 'embedded',
    tags: ['8051', 'Assembly', 'FSM', 'Thermocouple', 'Op-Amp', 'Python', 'SSR'],
    date: '2025',
    featured: false,
    coverImage: '/assets/reflow-oven.jpg',
    images: ['/assets/reflow-oven.jpg'],
    summary:
      "Built a reflow controller on an 8051 because I wanted to actually understand the whole signal chain — K-type thermocouple → op-amp amplification → low-pass filter → ADC → FSM → SSR. The fun part was the analog front-end: thermocouples output millivolts, so any noise or offset directly shows up as temperature error. After a few iterations of op-amp tuning and cold-junction compensation, I got it to ±2°C tracking the reflow profile. Bonus: a Python script logs the curve live, and there's a little jingle when the board hits peak. Used it to actually reflow SMD boards.",
    sections: {
      designDecisions:
        'K-type thermocouple front-end uses op-amp amplification and low-pass filtering for clean readings. 8051 FSM drives a solid-state relay for PWM heating control. User interface via LCD and buttons with adjustable reflow parameters. Python handles logging and live strip-chart plotting.',
      goals: [
        'Accurate thermal profile tracking for SMD reflow',
        '±2°C temperature accuracy via calibrated thermocouple front-end',
        'Safety abort feature for over-temperature conditions',
        'Python/Excel data logging with live visualisation',
      ],
      results: '±2°C temperature accuracy verified. Successfully reflowed SMD test boards. Completion jingle and animated LCD messages for operator feedback.',
    },
    links: [],
  },

  // ── 6. Oscilloscope & Multimeter ──────────────────────────────────
  {
    slug: 'oscilloscope-multimeter',
    title: 'Oscilloscope & Multimeter',
    tagline: '555 timer turned into a poor man\'s V/R/C meter — ~1 mV / ~10 Ω / ~1 pF resolution',
    category: 'embedded',
    tags: ['8051', '555 Timer', 'C', 'Python', 'Serial', 'Measurement', 'Calibration'],
    date: '2025',
    featured: false,
    coverImage: '/assets/oscilloscope-multimeter.png',
    images: ['/assets/oscilloscope-multimeter.png'],
    summary:
      "Most multimeters do this with a dedicated ADC. I wanted to do it with a 555. The trick is that a 555's oscillation frequency shifts proportionally to whatever component you drop into its RC network — so by reading the frequency on an MCU and applying the right calibration curve, you get a working measurement system for voltage, resistance, and capacitance. Resolution came out to ~1 mV / ~10 Ω / ~1 pF, verified against bench gear. Python plots everything live. It's not a Fluke, but it taught me way more about measurement than buying one ever would.",
    sections: {
      designDecisions:
        '555 timer oscillator shifts frequency proportionally to the measured component. MCU captures the frequency, computes the electrical parameter in C, and streams over serial. Python plots readings in real time for calibration and verification.',
      results: 'Measurement resolution of ~1mV / ~10Ω / ~1pF verified against bench instruments. Real-time Python plots updated smoothly.',
    },
    links: [],
  },

  // ── 7. ELEC301 — Cascode Amplifier & Butterworth Filter ───────────
  {
    slug: 'elec301-cascode',
    title: 'Cascode Amplifier & Butterworth Filter Design',
    tagline: '2N3904 cascode meeting tight specs + 3rd-order Butterworth LPF + root-locus oscillator analysis',
    category: 'software',
    tags: ['LTSpice', 'BJT', 'Cascode', 'Active Filter', 'Butterworth', 'ELEC301'],
    date: '2025',
    featured: false,
    coverImage: '',
    images: [],
    summary:
      "Coursework that turned into a real design exercise. The spec was tight: dual 2N3904 cascode, V_CC = 20 V, R_out = 2.5 kΩ ± 10%, R_in ≥ 3.5 kΩ, |A_M| ≥ 50 V/V, and a low-frequency 3 dB point ≤ 1200 rad/s. I biased it from scratch, sized every coupling and bypass cap from the spec, then verified the DC operating point and the Bode plot in LTSpice. Separately I designed a 3rd-order Butterworth low-pass at 10 kHz from standard coefficient tables, and used root locus to analyse oscillator stability. The whole thing taught me more about analog design than any lecture did.",
    sections: {
      problem:
        'Design a cascode BJT amplifier meeting strict gain, impedance, and bandwidth specs. Separately, design a 3rd-order Butterworth active filter and analyse oscillator stability using root locus.',
      goals: [
        'Bias a dual 2N3904 cascode for VCC = 20V with specified DC operating point',
        'Meet Rout = 2.5 kΩ ± 250Ω, Rin ≥ 3.5 kΩ, |AM| ≥ 50 V/V, ωL ≤ 1200 rad/s',
        'Design a 3rd-order Butterworth LPF with 3dB cutoff at 10 kHz',
        'Verify all designs in LTSpice with Bode plots and DC operating point simulation',
      ],
      designDecisions:
        'Cascode topology chosen for its high output impedance (≈ RC) and good high-frequency response. Bias resistors derived from Vcc voltage division and current budget. Coupling and bypass capacitors sized from lower cutoff frequency spec. Butterworth filter coefficients normalised from standard tables, then frequency-scaled to 10 kHz with chosen capacitor values.',
      validation:
        'DC operating points verified against hand calculations. Bode plots confirm gain and cutoff frequency specs are met. Root locus analysis shows stable and marginally oscillating conditions for the feedback oscillator.',
      results:
        'Cascode amplifier met all design specs: Rout = 2.5 kΩ, |AM| ≥ 50 V/V, ωL within spec. Butterworth filter 3dB point confirmed at 10 kHz in simulation. Oscillator root locus correctly predicts marginal stability at the design frequency.',
    },
    links: [
      { label: 'Full Report (PDF)', url: '/assets/projects/elec301-cascode/report.pdf' },
    ],
  },

  // ── 8. ELEC301 — BJT Amplifier Analysis ───────────────────────────
  {
    slug: 'elec301-amplifiers',
    title: 'BJT Amplifier Analysis',
    tagline: 'OC/SC time constants on a 4-pole RC filter + Miller\'s theorem on CE/CB/CC BJTs, all verified in LTSpice',
    category: 'software',
    tags: ['LTSpice', 'BJT', 'SPICE', 'Analog Design', 'Bode Plot', 'ELEC301'],
    date: '2025',
    featured: false,
    coverImage: '',
    images: [],
    summary:
      "Another ELEC301 mini project, this one all about frequency response. I used the open-circuit / short-circuit (OC/SC) time constant method to find all four poles of an RC bandpass filter by hand, then verified them in LTSpice. After that I ran CE, CB, and CC BJT amplifiers through the same kind of analysis — using Miller's theorem to decouple the feedback capacitance for high-frequency poles, then comparing calculated midband gain and I/O impedances against simulation. Poles landed at 14.2 Hz, 312.6 Hz, 5.90 MHz, and 38.6 MHz — hand calculations and SPICE agreed within a small margin. Good reminder that hand analysis still matters in an era where everyone reaches for simulation first.",
    sections: {
      problem:
        'Analyse a four-pole RC bandpass filter and three BJT amplifier topologies. Predict pole locations analytically using OC/SC method, then verify with LTSpice AC sweep.',
      goals: [
        'Find all poles of a 4-element RC bandpass filter using OC and SC time constants',
        'Simulate CE, CB, and CC amplifier configurations in LTSpice',
        'Apply Miller\'s theorem to approximate high-frequency pole locations',
        'Compare calculated midband gain and I/O resistances against SPICE simulation',
      ],
      designDecisions:
        'Used the open-circuit/short-circuit (OC/SC) time constant method to approximate pole frequencies without solving the full transfer function. Miller\'s theorem used to decouple the feedback capacitance for high-frequency analysis. All simulations run in LTSpice with decade AC sweeps from 1 mHz to 1 THz.',
      validation:
        'Simulated poles matched calculated values within acceptable margin. Error analysis documented for each topology. CE vs CB input/output impedance comparison confirmed textbook trade-offs.',
      results:
        'RC filter poles identified at 14.2 Hz, 312.6 Hz, 5.90 MHz, and 38.6 MHz — consistent across both methods. BJT amplifier I/O resistances and gains verified in simulation.',
    },
    links: [
      { label: 'Full Report (PDF)', url: '/assets/projects/elec301-amplifiers/report.pdf' },
    ],
  },

  // ── 9. Alarm Clock in 8051 ────────────────────────────────────────
  {
    slug: 'alarm-clock-8051',
    title: 'Alarm Clock in 8051',
    tagline: '8051 alarm clock written in assembly — hardware timer interrupts, button debounce, no drift',
    category: 'embedded',
    tags: ['8051', 'Assembly', 'Interrupts', 'Timer', 'GPIO'],
    date: '2024',
    featured: false,
    coverImage: '/assets/alarm-clock.jpg',
    images: ['/assets/alarm-clock.jpg', '/assets/alarm-clock.png'],
    summary:
      "An 8051 alarm clock written in assembly. The whole thing is timer-interrupt-driven — no polling, because that's exactly how you get drift — and the buttons are debounced in software. You set the time, set the alarm, the buzzer fires when it should. Tested for accuracy over multi-hour runs with no measurable drift. Writing it in assembly forced me to actually understand what the timer registers and ISRs were doing, instead of letting Arduino abstractions hide it from me.",
    sections: {
      designDecisions:
        'Timer interrupts drive the timekeeping loop to avoid drift from polling. Button debounce handled in software.',
      results: 'Accurate timekeeping verified over multi-hour tests. Alarm triggers reliably.',
    },
    links: [],
  },

  // ── 10. RISC Machine ──────────────────────────────────────────────
  {
    slug: 'risc-machine',
    title: 'RISC Machine',
    tagline: 'RISC CPU in Verilog — fetch / decode / execute on a DE1-SoC, simulated in ModelSim, synthesised in Quartus',
    category: 'software',
    tags: ['Verilog', 'FPGA', 'DE1-SoC', 'ModelSim', 'Quartus', 'Digital Design'],
    date: '2024',
    featured: false,
    coverImage: '',
    images: [],
    summary:
      "Designed a simple RISC CPU in Verilog from the ground up — register file, ALU, control unit, fetch-decode-execute pipeline, the whole stack. Simulated each module in ModelSim, then synthesised the whole thing onto a DE1-SoC FPGA via Quartus and ran test programs on real hardware. Timing constraints met for the target clock. It's the kind of project that finally makes 'how does a CPU actually work' click — you stop thinking of CPUs as magic and start thinking of them as a really well-organised state machine.",
    sections: {
      results: 'CPU executed all test programs correctly. Timing constraints met for target clock frequency.',
    },
    links: [],
  },

  // ── 11. Mini Power Bank ───────────────────────────────────────────
  {
    slug: 'mini-powerbank',
    title: 'Mini Power Bank',
    tagline: 'Hand-built USB power bank — Li-ion + boost converter, small enough for a shirt pocket',
    category: 'pcb',
    tags: ['Power Electronics', 'Li-ion', 'Boost Converter', 'USB', 'PCB'],
    date: '2022',
    featured: false,
    coverImage: '/assets/mini-powerbank.jpg',
    images: ['/assets/mini-powerbank.jpg', '/assets/mini-powerbank-inside.jpg', '/assets/mini-powerbank-inside2.jpg'],
    summary:
      "Built this before I really knew what PCB layout meant. A Li-ion cell, a boost converter board, a USB-A output, and a micro-USB charge-through port — all packed into something that actually fits in a shirt pocket. Charges phones and small USB devices reliably. Looking back I'd redesign half of it, but at the time it taught me about battery safety, current limiting, and the difference between 'works on the bench' and 'survives being thrown in a backpack.'",
    sections: {
      results: 'Powers phones and small USB devices reliably. Fits in a shirt pocket.',
    },
    links: [],
  },

  // ── 12. The Claw ──────────────────────────────────────────────────
  {
    slug: 'the-claw',
    title: 'The Claw',
    tagline: 'Joystick-controlled servo claw — direct proportional control, no oscillation, surprisingly grippy',
    category: 'robotics',
    tags: ['Servo', 'Joystick', 'Arduino', 'Mechanical', 'Robotics'],
    date: '2021',
    featured: false,
    coverImage: '/assets/the-claw.jpg',
    images: ['/assets/the-claw.jpg'],
    summary:
      "Three hobby servos, a joystick, an Arduino, and a 3D-printed frame. Finger positions track joystick input proportionally — push the stick further, the fingers close further. No oscillation, no jitter, just clean direct control. Built it as a dexterity toy and ended up using it to grip pretty much anything within reach. Still works.",
    sections: {
      results: 'Successfully gripped a range of objects. Smooth servo response with no oscillation.',
    },
    links: [],
  },

  // ── 13. Audio-Responsive LED ──────────────────────────────────────
  {
    slug: 'audio-led',
    title: 'Audio-Responsive LED',
    tagline: 'Microphone → ADC → LED matrix — lights pulse with whatever\'s playing, no perceptible lag',
    category: 'embedded',
    tags: ['LED', 'Audio', 'ADC', 'Arduino', 'Analog'],
    date: '2020',
    featured: false,
    coverImage: '',
    images: [],
    summary:
      "A microphone picks up ambient sound, the ADC samples the level, and an LED matrix brightens / patterns in response — real-time enough that there's no perceptible lag between the beat and the lights. The interesting part isn't the LED side, it's the analog front-end: mic bias, AC coupling, envelope detection. Once that part is clean, everything downstream is easy.",
    sections: {
      results: 'Visually responsive to music with no perceptible latency.',
    },
    links: [],
  },

  // ── 14. Inventory Analysis System ─────────────────────────────────
  {
    slug: 'inventory-analysis',
    title: 'Inventory Analysis System',
    tagline: 'Excel + VBA tool I built for my family\'s electronics shop — real-time stock, alerts, sales analytics',
    category: 'software',
    tags: ['Excel', 'VBA', 'Data Analysis', 'Automation'],
    date: '2020',
    featured: false,
    coverImage: '/assets/inventory-analysis.png',
    images: ['/assets/inventory-analysis.png'],
    summary:
      "An Excel + VBA tool I built for my family's electronics shop in Bali. Tracks stock levels in real time, fires low-stock alerts before things sell out, and generates sales summaries automatically. Replaced a lot of manual paperwork and caught a few out-of-stock situations before they cost us a sale. Not glamorous, but useful — and a reminder that 'engineering' includes spreadsheets when that's what the problem actually needs.",
    sections: {
      results: 'Reduced manual stock-checking time significantly. Prevented several out-of-stock situations.',
    },
    links: [],
  },

  // ── 15. Kinetic-Powered LED ───────────────────────────────────────
  {
    slug: 'kinetic-led',
    title: 'Kinetic-Powered LED',
    tagline: 'Hand-crank dynamo → bridge rectifier → cap → LEDs. Physics demo, the old-school way.',
    category: 'embedded',
    tags: ['Generator', 'Rectifier', 'LED', 'Power Electronics'],
    date: '2019',
    featured: false,
    coverImage: '',
    images: [],
    summary:
      "A hand-crank dynamo wired to a bridge rectifier and a smoothing capacitor, driving LEDs. The classic 'see physics happen in real time' demo. Crank fast enough and the LEDs light up cleanly — multimeter confirms the DC out of the cap is reasonably smooth. One of the first circuits I built that wasn't straight out of a textbook.",
    sections: {
      results: 'LEDs light up reliably from moderate cranking speed. Clean DC output confirmed with multimeter.',
    },
    links: [],
  },

  // ── 16. Spreadsheet Cashier System ────────────────────────────────
  {
    slug: 'cashier-system',
    title: 'Spreadsheet Cashier System',
    tagline: 'Google Sheets POS for the family shop — transactions, balances, daily totals, near-zero arithmetic errors',
    category: 'software',
    tags: ['Google Sheets', 'Apps Script', 'POS', 'Automation'],
    date: '2019',
    featured: false,
    coverImage: '/assets/cashier-system.png',
    images: ['/assets/cashier-system.png'],
    summary:
      "A Google Sheets-based point-of-sale system I built for my family's shop, Tjahya Elektronik. Records every transaction, calculates change, tracks daily totals, and flags discrepancies the moment they show up. Replaced the manual cashbook we'd been using forever — and dropped arithmetic errors to nearly zero. Built with Apps Script, deployed on a shared spreadsheet so anyone in the shop could use it from any device. Worked so well it stayed in production for years.",
    sections: {
      results: 'Replaced manual cashbook with near-zero arithmetic errors.',
    },
    links: [],
  },
]

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(): ProjectData[] {
  return projects.filter((p) => p.featured)
}

export function getProjectsByCategory(category: string): ProjectData[] {
  if (category === 'all') return projects
  return projects.filter((p) => p.category === category)
}
