import type { ProjectData } from '@/types/project'

export const projects: ProjectData[] = [
  {
    slug: 'haptic-knob',
    title: 'Haptic Knob',
    tagline: 'BLDC haptic interface that lets you feel circuit behaviour — R, L, C, diode — through torque feedback',
    category: 'firmware',
    tags: ['ESP32', 'BLDC', 'FOC', 'PID', 'C++', 'Motor Control', 'FreeRTOS'],
    date: '2024',
    featured: true,
    coverImage: '/assets/haptic-knob.jpg',
    images: ['/assets/haptic-knob.jpg'],
    logo: '/assets/ubc_open_robotics_logo.jpeg',
    logoUrl: 'https://openrobotics.ca/',
    summary:
      'A haptic feedback rotary knob using closed-loop BLDC motor control. The user physically feels the behaviour of an RLC circuit by turning the knob — inductance, resistance, capacitance, and diode characteristics are encoded as torque profiles in real time.',
    sections: {
      problem:
        'Off-the-shelf encoders give no physical feedback. The goal was to create a knob that simulates circuit element behaviour — detents, spring centering, damping — purely through torque control on a BLDC motor.',
      goals: [
        'Implement FOC for smooth, silent torque control at low RPM',
        'Encode R, L, C, and diode behaviour as distinct haptic profiles',
        'Run under real-time constraints on ESP32-PICO',
        'Integrate encoder feedback and SPI OLED display',
      ],
      designDecisions:
        'FOC was chosen over simple PWM for torque smoothness. Current sensing provides real-time torque feedback. Encoder feedback closes the position loop. FreeRTOS separates the control loop from display updates.',
      validation:
        'Tested across 4 haptic profiles. Position tracking verified with oscilloscope. Latency under 2ms from input to torque response.',
      results:
        'Smooth, silent haptic feedback across all profiles. FOC eliminated cogging noise present in simpler PWM approaches.',
    },
    links: [{ label: 'GitHub', url: 'https://github.com/Fixables' }],
  },
  {
    slug: 'robomaestro',
    title: 'RoboMaestro',
    tagline: 'Discrete MOSFET H-bridge motor driver with 2-layer PCB in Altium for PWM motor control',
    category: 'pcb',
    tags: ['Altium Designer', 'H-Bridge', 'MOSFET', 'Gate Driver', 'PWM', 'Power Electronics', 'PCB'],
    date: '2025',
    featured: true,
    coverImage: '',
    images: [],
    logo: '/assets/ubc-logo.png',
    logoUrl: 'https://ece.ubc.ca/',
    model3d: '/assets/models/robomaestro.glb',
    summary:
      'A discrete MOSFET H-bridge motor driver designed from scratch in Altium. Focused on gate-drive integrity, level shifting, and noise-aware PCB layout for reliable PWM operation and dead-time control.',
    sections: {
      designDecisions:
        'Discrete MOSFET H-bridge chosen over integrated drivers for full control over gate-drive timing and dead-time. Gate-drive networks with decoupling suppression reduce switching noise. Level shifting handles high-side drive.',
      pcbHighlights:
        '2-layer PCB in Altium. Gate-drive networks with decoupling suppression to reduce noise and improve switching robustness. Power and signal planes carefully separated.',
      results: 'PCB fabricated and under bring-up testing. PWM switching verified on bench.',
    },
    links: [{ label: 'GitHub', url: 'https://github.com/Fixables' }],
  },
  {
    slug: 'coin-picking-robot',
    title: 'Coin Picking Robot',
    tagline: 'Multi-MCU robot with JDY-40 wireless, autonomous FSM coin pickup, and joystick manual override',
    category: 'robotics',
    tags: ['EFM8LB1', 'MSP430', 'LPC824', 'PWM', 'FSM', 'Wireless', 'Embedded C'],
    date: '2025',
    featured: true,
    coverImage: '/assets/coin-picking.JPG',
    images: ['/assets/coin-picking.JPG'],
    logo: '/assets/ubc-logo.png',
    logoUrl: 'https://ece.ubc.ca/',
    summary:
      'A multi-microcontroller robotic system with JDY-40 wireless communication. Supports autonomous coin collection via a finite state machine and manual remote control via joystick with LCD feedback.',
    sections: {
      designDecisions:
        'Three separate MCUs handle different subsystems — EFM8LB1 for motor/sensor control, MSP430 for power management, LPC824 for comms. JDY-40 wireless link connects the remote controller to the robot. FSM handles mode switching cleanly.',
      goals: [
        'Autonomous coin detection and pickup via FSM',
        'Manual remote control via joystick with LCD feedback',
        'JDY-40 wireless communication between controller and robot',
        'PWM motor control with ISR-driven real-time response',
      ],
      results: 'Successfully demonstrated both autonomous and manual modes. Wireless link reliable across the test arena.',
    },
    links: [{ label: 'GitHub', url: 'https://github.com/Fixables' }],
  },
  {
    slug: 'reflow-oven',
    title: 'Reflow Oven Controller',
    tagline: 'Controlled a reflow oven with an 8051 MCU and relay, logging thermal profiles in Python',
    category: 'embedded',
    tags: ['8051', 'Assembly', 'Python', 'Serial', 'Thermal Control', 'Relay'],
    date: '2024',
    featured: false,
    coverImage: '/assets/reflow-oven.jpg',
    images: ['/assets/reflow-oven.jpg'],
    logo: '/assets/ubc-logo.png',
    logoUrl: 'https://ece.ubc.ca/',
    summary:
      'A reflow oven controller on an 8051. K-type thermocouple signal conditioning (op-amp amplification + filtering) feeds temperature into an FSM controller. Python/Excel logging with live strip-chart visualisation achieved ±2°C accuracy.',
    sections: {
      designDecisions:
        'K-type thermocouple front-end uses op-amp amplification and filtering for clean readings. 8051 FSM drives a solid-state relay for heating. Python handles logging and live strip-chart plotting.',
      results: '±2°C temperature accuracy verified. Successfully reflowed SMD test boards.',
    },
    links: [],
  },
  {
    slug: 'oscilloscope-multimeter',
    title: 'Oscilloscope & Multimeter',
    tagline: 'Measured voltage, resistance, and capacitance with real-time visualisation over serial and Python',
    category: 'embedded',
    tags: ['8051', 'ADC', 'Python', 'Serial', 'Measurement', 'Assembly'],
    date: '2023',
    featured: false,
    coverImage: '/assets/oscilloscope-multimeter.png',
    images: ['/assets/oscilloscope-multimeter.png'],
    logo: '/assets/ubc-logo.png',
    logoUrl: 'https://ece.ubc.ca/',
    summary:
      'A 555 timer-based measurement circuit paired with a microcontroller. Measures voltage, resistance, and capacitance via frequency-shift sensing — ~1mV, ~10Ω, ~1pF resolution. Python visualisation for real-time plotting and calibration.',
    sections: {
      designDecisions:
        '555 timer oscillator shifts frequency in response to measured component. MCU captures frequency, computes the electrical parameter in C, and streams results over serial. Python plots in real time.',
      results: 'Measurement resolution of ~1mV / ~10Ω / ~1pF verified against bench instruments.',
    },
    links: [],
  },
  {
    slug: 'alarm-clock-8051',
    title: 'Alarm Clock in 8051',
    tagline: '8051 clock with alarm and buzzer, using button inputs and hardware interrupts for timekeeping',
    category: 'embedded',
    tags: ['8051', 'Assembly', 'Interrupts', 'Timer', 'GPIO'],
    date: '2023',
    featured: false,
    coverImage: '/assets/alarm-clock.jpg',
    images: ['/assets/alarm-clock.jpg', '/assets/alarm-clock.png'],
    logo: '/assets/ubc-logo.png',
    logoUrl: 'https://ece.ubc.ca/',
    summary:
      'A digital clock with alarm functionality on an 8051. Hardware timer interrupts keep accurate time. Buttons set the alarm, and a buzzer fires at the trigger time. Written in 8051 assembly.',
    sections: {
      designDecisions:
        'Timer interrupts drive the timekeeping loop to avoid drift from polling. Button debounce handled in software.',
      results: 'Accurate timekeeping over multi-hour tests. Alarm triggers reliably.',
    },
    links: [],
  },
  {
    slug: 'risc-machine',
    title: 'RISC Machine',
    tagline: 'Designed a RISC CPU in Verilog and simulated with ModelSim on DE1-SoC',
    category: 'software',
    tags: ['Verilog', 'FPGA', 'DE1-SoC', 'ModelSim', 'Quartus', 'Digital Design'],
    date: '2024',
    featured: false,
    coverImage: '/assets/risc-machine.png',
    images: [],
    logo: '/assets/ubc-logo.png',
    logoUrl: 'https://ece.ubc.ca/',
    summary:
      'A simple RISC CPU implemented in Verilog and targeted at the DE1-SoC FPGA board. Designed with a standard fetch-decode-execute pipeline, simulated in ModelSim, and synthesised with Quartus.',
    sections: {
      results: 'CPU executed all test programs correctly. Timing constraints met for target clock frequency.',
    },
    links: [],
  },
  {
    slug: 'mini-powerbank',
    title: 'Mini Power Bank',
    tagline: 'Built a compact USB power bank with Li-ion battery and boost converter',
    category: 'pcb',
    tags: ['Power Electronics', 'Li-ion', 'Boost Converter', 'USB', 'PCB'],
    date: '2022',
    featured: false,
    coverImage: '/assets/mini-powerbank.jpg',
    images: ['/assets/mini-powerbank.jpg', '/assets/mini-powerbank-inside.jpg', '/assets/mini-powerbank-inside2.jpg'],
    summary:
      'A hand-built USB power bank using a Li-ion cell and a boost converter module. Designed for compact form factor with a USB-A output and charge-through micro-USB input.',
    sections: {
      results: 'Powered phones and small USB devices reliably. Fits in a shirt pocket.',
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
    logo: '/assets/tjahya.jpeg',
    logoUrl: 'https://maps.app.goo.gl/TETcxMwJH3gHsx8H8',
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
    logo: '/assets/tjahya.jpeg',
    logoUrl: 'https://maps.app.goo.gl/TETcxMwJH3gHsx8H8',
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
    tagline: 'Mechanical claw controlled by joystick and servos for dexterity training and object gripping',
    category: 'robotics',
    tags: ['Servo', 'Joystick', 'Mechanical', 'Arduino', 'Robotics'],
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
    tagline: 'LED matrix that pulses to music volume, creating a disco-light effect from audio amplitude',
    category: 'embedded',
    tags: ['LED', 'Audio', 'ADC', 'Arduino', 'Analog'],
    date: '2020',
    featured: false,
    coverImage: '/assets/DSCF4746-rd.png',
    images: [],
    summary:
      'An LED matrix that reacts to the amplitude of audio input. A microphone picks up sound, an ADC samples the level, and the LED brightness/pattern responds in real time.',
    sections: {
      results: 'Visually responsive to music with no perceptible latency.',
    },
    links: [],
  },
  {
    slug: 'kinetic-led',
    title: 'Kinetic-Powered LED',
    tagline: 'Hand-crank dynamo powering LEDs — a demonstration of motion-to-light energy conversion',
    category: 'embedded',
    tags: ['Generator', 'Rectifier', 'LED', 'Power Electronics'],
    date: '2019',
    featured: false,
    coverImage: '/assets/DSCF4746-rd.png',
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
