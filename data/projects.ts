import type { ProjectData } from '@/types/project'

export const projects: ProjectData[] = [
  {
    slug: 'haptic-knob',
    title: 'Haptic Knob',
    tagline: 'BLDC haptic interface that lets you feel circuit behaviour — R, L, C, diode — through torque feedback',
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
      'A haptic feedback rotary knob using closed-loop BLDC motor control. The user physically feels the behaviour of an RLC circuit by turning the knob — inductance, resistance, capacitance, and diode characteristics are encoded as torque profiles in real time.',
    sections: {
      problem:
        'Circuits are normally invisible — you measure them with probes and plots. The goal was a knob that lets you physically feel circuit element behaviour: resistance as velocity damping, capacitance as a position spring, inductance as resistance to acceleration, and a diode as one-way blocking.',
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
  {
    slug: 'robomaestro',
    title: 'RoboMaestro',
    tagline: 'Discrete MOSFET H-bridge motor driver with 2-layer Altium PCB for PWM motor control',
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
      'A discrete MOSFET H-bridge motor driver designed from scratch in Altium. Focused on gate-drive integrity, level shifting, and noise-aware PCB layout for reliable PWM operation and dead-time control.',
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
  {
    slug: 'coin-picking-robot',
    title: 'Coin Picking Robot',
    tagline: 'Multi-MCU robot with JDY-40 wireless, autonomous FSM coin pickup, and joystick manual override',
    category: 'robotics',
    tags: ['EFM8LB1', 'MSP430', 'LPC824', 'PWM', 'FSM', 'JDY-40', 'Embedded C'],
    date: '2025',
    featured: true,
    coverImage: '/assets/coin-picking.JPG',
    images: ['/assets/coin-picking.JPG'],
    summary:
      'A multi-microcontroller robotic system with JDY-40 wireless communication. Supports autonomous coin collection via a finite state machine and manual remote control via joystick with LCD feedback.',
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
  {
    slug: 'smart-energy-meter',
    title: 'Smart Energy Meter',
    tagline: 'IoT energy monitor using ESP32, current/voltage sensors, and real-time power factor calculation',
    category: 'embedded',
    tags: ['ESP32', 'IoT', 'SCT-013', 'ZMPT101B', 'TFT Display', 'Python', 'Power Measurement'],
    date: '2025',
    featured: false,
    coverImage: '',
    images: [],
    summary:
      'An IoT-enabled energy monitoring system using ESP32, SCT-013 current sensor, and ZMPT101B voltage module. Computes real-time RMS voltage, current, power, and power factor with a TFT display. Includes a Python analytics pipeline for visualisation and anomaly detection.',
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
  {
    slug: 'reflow-oven',
    title: 'Reflow Oven Controller',
    tagline: '8051 FSM reflow controller with K-type thermocouple front-end, SSR, and ±2°C thermal accuracy',
    category: 'embedded',
    tags: ['8051', 'Assembly', 'FSM', 'Thermocouple', 'Op-Amp', 'Python', 'SSR'],
    date: '2025',
    featured: false,
    coverImage: '/assets/reflow-oven.jpg',
    images: ['/assets/reflow-oven.jpg'],
    summary:
      'A reflow oven controller on an 8051. K-type thermocouple signal conditioning (op-amp amplification + filtering) feeds an FSM controller driving a solid-state relay. Python/Excel logging with live strip-chart visualisation achieved ±2°C accuracy.',
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
  {
    slug: 'oscilloscope-multimeter',
    title: 'Oscilloscope & Multimeter',
    tagline: '555 timer-based measurement system for voltage, resistance, and capacitance with Python visualisation',
    category: 'embedded',
    tags: ['8051', '555 Timer', 'C', 'Python', 'Serial', 'Measurement', 'Calibration'],
    date: '2025',
    featured: false,
    coverImage: '/assets/oscilloscope-multimeter.png',
    images: ['/assets/oscilloscope-multimeter.png'],
    summary:
      'A 555 timer-based measurement circuit paired with a microcontroller. Measures voltage, resistance, and capacitance via frequency-shift sensing — ~1mV, ~10Ω, ~1pF resolution. Python visualisation for real-time plotting and calibration.',
    sections: {
      designDecisions:
        '555 timer oscillator shifts frequency proportionally to the measured component. MCU captures the frequency, computes the electrical parameter in C, and streams over serial. Python plots readings in real time for calibration and verification.',
      results: 'Measurement resolution of ~1mV / ~10Ω / ~1pF verified against bench instruments. Real-time Python plots updated smoothly.',
    },
    links: [],
  },
  {
    slug: 'alarm-clock-8051',
    title: 'Alarm Clock in 8051',
    tagline: '8051 clock with alarm and buzzer using hardware timer interrupts for accurate timekeeping',
    category: 'embedded',
    tags: ['8051', 'Assembly', 'Interrupts', 'Timer', 'GPIO'],
    date: '2024',
    featured: false,
    coverImage: '/assets/alarm-clock.jpg',
    images: ['/assets/alarm-clock.jpg', '/assets/alarm-clock.png'],
    summary:
      'A digital clock with alarm functionality on an 8051. Hardware timer interrupts keep accurate time. Buttons set the alarm, and a buzzer fires at the trigger time. Written in 8051 assembly.',
    sections: {
      designDecisions:
        'Timer interrupts drive the timekeeping loop to avoid drift from polling. Button debounce handled in software.',
      results: 'Accurate timekeeping verified over multi-hour tests. Alarm triggers reliably.',
    },
    links: [],
  },
  {
    slug: 'risc-machine',
    title: 'RISC Machine',
    tagline: 'Designed a RISC CPU in Verilog, simulated with ModelSim, and synthesised on DE1-SoC',
    category: 'software',
    tags: ['Verilog', 'FPGA', 'DE1-SoC', 'ModelSim', 'Quartus', 'Digital Design'],
    date: '2024',
    featured: false,
    coverImage: '',
    images: [],
    summary:
      'A simple RISC CPU implemented in Verilog and targeted at the DE1-SoC FPGA. Designed with a standard fetch-decode-execute pipeline, simulated in ModelSim, and synthesised with Quartus.',
    sections: {
      results: 'CPU executed all test programs correctly. Timing constraints met for target clock frequency.',
    },
    links: [],
  },
  {
    slug: 'mini-powerbank',
    title: 'Mini Power Bank',
    tagline: 'Compact USB power bank built with Li-ion battery and boost converter',
    category: 'pcb',
    tags: ['Power Electronics', 'Li-ion', 'Boost Converter', 'USB', 'PCB'],
    date: '2022',
    featured: false,
    coverImage: '/assets/mini-powerbank.jpg',
    images: ['/assets/mini-powerbank.jpg', '/assets/mini-powerbank-inside.jpg', '/assets/mini-powerbank-inside2.jpg'],
    summary:
      'A hand-built USB power bank using a Li-ion cell and a boost converter module. Designed for compact form factor with USB-A output and charge-through micro-USB input.',
    sections: {
      results: 'Powers phones and small USB devices reliably. Fits in a shirt pocket.',
    },
    links: [],
  },
  {
    slug: 'inventory-analysis',
    title: 'Inventory Analysis System',
    tagline: 'Excel tool for real-time stock tracking, low-stock alerts, and sales analytics',
    category: 'software',
    tags: ['Excel', 'VBA', 'Data Analysis', 'Automation'],
    date: '2020',
    featured: false,
    coverImage: '/assets/inventory-analysis.png',
    images: ['/assets/inventory-analysis.png'],
    summary:
      'An Excel-based inventory management tool built for Tjahya Elektronik. Tracks stock in real time, fires low-stock alerts, and generates sales summaries automatically.',
    sections: {
      results: 'Reduced manual stock-checking time significantly. Prevented several out-of-stock situations.',
    },
    links: [],
  },
  {
    slug: 'cashier-system',
    title: 'Spreadsheet Cashier System',
    tagline: 'Google Sheets POS system tracking transactions and balances for a retail electronics store',
    category: 'software',
    tags: ['Google Sheets', 'Apps Script', 'POS', 'Automation'],
    date: '2019',
    featured: false,
    coverImage: '/assets/cashier-system.png',
    images: ['/assets/cashier-system.png'],
    summary:
      'A Google Sheets-based point-of-sale system for Tjahya Elektronik. Records each transaction, calculates change, tracks daily totals, and flags discrepancies.',
    sections: {
      results: 'Replaced manual cashbook with near-zero arithmetic errors.',
    },
    links: [],
  },
  {
    slug: 'the-claw',
    title: 'The Claw',
    tagline: 'Joystick-controlled mechanical claw driven by servos for dexterity training and object gripping',
    category: 'robotics',
    tags: ['Servo', 'Joystick', 'Arduino', 'Mechanical', 'Robotics'],
    date: '2021',
    featured: false,
    coverImage: '/assets/the-claw.jpg',
    images: ['/assets/the-claw.jpg'],
    summary:
      'A joystick-controlled mechanical claw driven by hobby servos. Built as a dexterity training tool and general-purpose gripper. Finger positions map proportionally to joystick input.',
    sections: {
      results: 'Successfully gripped a range of objects. Smooth servo response with no oscillation.',
    },
    links: [],
  },
  {
    slug: 'audio-led',
    title: 'Audio-Responsive LED',
    tagline: 'LED matrix that pulses to music volume, creating a live light effect from audio amplitude',
    category: 'embedded',
    tags: ['LED', 'Audio', 'ADC', 'Arduino', 'Analog'],
    date: '2020',
    featured: false,
    coverImage: '',
    images: [],
    summary:
      'An LED matrix that reacts to the amplitude of audio input. A microphone picks up sound, an ADC samples the level, and the LED brightness and pattern respond in real time.',
    sections: {
      results: 'Visually responsive to music with no perceptible latency.',
    },
    links: [],
  },
  {
    slug: 'elec301-amplifiers',
    title: 'BJT Amplifier Analysis',
    tagline: 'LTSpice simulation and hand analysis of RC filters, CE/CB/CC BJT amplifiers, and frequency response',
    category: 'software',
    tags: ['LTSpice', 'BJT', 'SPICE', 'Analog Design', 'Bode Plot', 'ELEC301'],
    date: '2025',
    featured: false,
    coverImage: '',
    images: [],
    summary:
      'ELEC301 Mini Project 1 — Frequency response analysis of a four-pole RC bandpass filter using OC/SC time constants. Hand-calculated and SPICE-simulated pole locations compared against LTSpice Bode plots. Extended to CE, CB, and CC BJT amplifier configurations with Miller\'s theorem, midband gain, and input/output resistance analysis.',
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
  {
    slug: 'elec301-cascode',
    title: 'Cascode Amplifier & Butterworth Filter Design',
    tagline: 'Designed a 2N3904 cascode amplifier and 3rd-order Butterworth active filter from specs to simulation',
    category: 'software',
    tags: ['LTSpice', 'BJT', 'Cascode', 'Active Filter', 'Butterworth', 'ELEC301'],
    date: '2025',
    featured: false,
    coverImage: '',
    images: [],
    summary:
      'ELEC301 Mini Project 2 — Full design flow for a two-transistor 2N3904 cascode amplifier meeting Rout = 2.5 kΩ, Rin ≥ 3.5 kΩ, |AM| ≥ 50 V/V, ωL,3dB ≤ 1200 rad/s. Separate design of a 3rd-order Butterworth low-pass active filter at 10 kHz cutoff, plus stability analysis of an oscillator via root locus.',
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
  {
    slug: 'kinetic-led',
    title: 'Kinetic-Powered LED',
    tagline: 'Hand-crank dynamo powering LEDs — a demonstration of motion-to-light energy conversion',
    category: 'embedded',
    tags: ['Generator', 'Rectifier', 'LED', 'Power Electronics'],
    date: '2019',
    featured: false,
    coverImage: '',
    images: [],
    summary:
      'A hand-crank dynamo connected to a bridge rectifier and capacitor, smoothing the output to drive LEDs. Built to demonstrate mechanical-to-electrical energy conversion.',
    sections: {
      results: 'LEDs light up reliably from moderate cranking speed. Clean DC output confirmed with multimeter.',
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
