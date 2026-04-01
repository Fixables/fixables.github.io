import type { ExperienceEntry } from '@/types/experience'

export const experience: ExperienceEntry[] = [
  // ── Education ──────────────────────────────────────────────
  {
    id: 'ubc-education',
    type: 'education',
    organization: 'University of British Columbia',
    role: 'B.A.Sc. Electrical Engineering',
    location: 'Vancouver, BC',
    startDate: 'Sept 2023',
    endDate: 'May 2027',
    highlights: [
      'Indonesia Maju Scholarship Awardee — CAD $400,000+ full-ride, funded by Indonesia\'s Ministry of Education (MoECRT).',
      'Dean\'s List.',
      'Faculty of Applied Science International Student Scholarship.',
      'Kenneth George VanSacker Memorial Scholarship.',
    ],
    tags: ['STM32', 'FreeRTOS', 'Control Systems', 'Power Electronics', 'Verilog'],
    scholarship: {
      amount: 'CAD $400,000+',
      description: 'Indonesia Maju Scholarship — full-ride covering tuition, housing, and living expenses for the full degree.',
    },
  },

  // ── Work & Design Teams ────────────────────────────────────
  {
    id: 'ubc-elec201-ta',
    type: 'work',
    organization: 'UBC Electrical & Computer Engineering',
    role: 'ELEC 201 Teaching Assistant',
    location: 'Vancouver, BC',
    startDate: 'Sept 2025',
    endDate: 'Present',
    highlights: [
      'Led lab sessions for 50+ students in circuit fundamentals — SC/OC tests, Thevenin equivalents, circuit design, power calculation, and breadboard troubleshooting.',
      'Mentored students on transistors, diodes, rectifiers, 555 timer oscillators, and op-amps by comparing real vs. theoretical circuit behaviour.',
      'Invigilated midterm exams and assisted with WebWork assessments.',
    ],
    tags: ['Teaching', 'Circuit Analysis', 'Electronics', 'Mentoring'],
  },
  {
    id: 'steamoji',
    type: 'work',
    organization: 'Steamoji Kerrisdale',
    role: 'Technician & Facilitator',
    location: 'Vancouver, BC',
    startDate: 'May 2025',
    endDate: 'Sept 2025',
    highlights: [
      'Repaired and maintained digital fabrication tools including 3D pens, 3D printers, and a Glowforge laser cutter — saving over $1,000 in replacement costs.',
      'Taught 50+ students (ages 5–14) in Arduino, robotics, programming, soldering, 3D design, and digital fabrication during summer camps.',
    ],
    tags: ['Arduino', 'Robotics', '3D Printing', 'Laser Cutting', 'Teaching'],
    logo: '/assets/steamoji.png',
    logoUrl: 'https://steamoji.com/',
  },
  {
    id: 'open-robotics',
    type: 'design-team',
    organization: 'Open Robotics, UBC',
    role: 'Firmware Co-Lead — Haptic Knob & Robocup@Home',
    location: 'Vancouver, BC',
    startDate: 'Sept 2023',
    endDate: 'Present',
    highlights: [
      'Developed ESP32 firmware using dual-core FreeRTOS to coordinate motor control, sensor sampling, and SPI OLED display tasks with deterministic timing.',
      'Implemented closed-loop BLDC motor control using current sensing, encoder feedback, and PID/FOC to generate haptic torque emulating R, L, C, and diode behaviour.',
      'Generated technical documentation including system block diagrams, I/O definitions, signal mapping, and test procedures for cross-team integration.',
    ],
    tags: ['ESP32', 'FreeRTOS', 'FOC', 'PID', 'BLDC', 'Altium', 'C++'],
    logo: '/assets/ubc_open_robotics_logo.jpeg',
    logoUrl: 'https://openrobotics.ca/',
  },
  {
    id: 'tjahya-elektronik',
    type: 'work',
    organization: 'Tjahya Elektronik',
    role: 'Electrical Technician & Customer Service Rep',
    location: 'Kintamani, Bali',
    startDate: 'Jan 2016',
    endDate: 'Sept 2023',
    highlights: [
      'Followed structured troubleshooting workflows — visual inspection, staged power-up, signal probing, component substitution — and maintained clear service notes.',
      'Diagnosed and repaired 100+ devices including CRT/LED TVs, speakers, and appliances, restoring full functionality and extending lifespan by up to 50%.',
      'Upgraded 20+ legacy speaker systems by integrating Bluetooth modules, redesigning control PCBs, and modifying casings.',
    ],
    tags: ['Electronics Repair', 'SMD Soldering', 'Oscilloscope', 'Fault Diagnosis', 'PCB Rework'],
    logo: '/assets/tjahya.jpeg',
    logoUrl: 'https://maps.app.goo.gl/TETcxMwJH3gHsx8H8',
  },
]
