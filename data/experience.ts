import type { ExperienceEntry } from '@/types/experience'

export const experience: ExperienceEntry[] = [
  // Education
  {
    id: 'ubc-education',
    type: 'education',
    organization: 'University of British Columbia',
    role: 'B.A.Sc. Electrical Engineering',
    location: 'Vancouver, BC',
    startDate: '2023',
    endDate: 'Expected 2027',
    highlights: [
      'Indonesia Maju Scholarship Awardee — full-ride, CAD $400,000+ funded by Indonesia\'s Ministry of Education.',
      'Dean\'s List.',
      'Faculty of Applied Science International Student Scholarship (CAD $8,125).',
      'Kenneth George VanSacker Memorial Scholarship (CAD $1,500).',
      'Coursework: embedded systems, control systems, power electronics, digital design, signals & systems.',
    ],
    tags: ['STM32', 'FreeRTOS', 'Control Systems', 'Power Electronics', 'Digital Design'],
    scholarship: {
      amount: 'CAD $400,000+',
      description: 'Indonesia Maju Scholarship — full-ride covering tuition, housing, and living expenses, funded by Indonesia\'s Ministry of Education, Culture, Research and Technology.',
    },
  },

  // Work & Design Teams
  {
    id: 'ubc-elec201-ta',
    type: 'work',
    organization: 'UBC Electrical and Computer Engineering',
    role: 'ELEC 201 Teaching Assistant',
    location: 'Vancouver, BC',
    startDate: 'Sept 2025',
    endDate: 'Present',
    highlights: [
      'Facilitating bi-weekly lab sessions for 40+ undergrads covering resistive networks, KVL/KCL, Thevenin equivalents, and first-order RC/RL circuits.',
      'Mentoring students on transistors, diodes, rectifiers, 555 timer oscillators, and op-amps to build practical troubleshooting intuition.',
      'Supporting midterm assessments and WebWork evaluations across lab sections.',
    ],
    tags: ['Teaching', 'Circuit Analysis', 'Electronics', 'Mentoring'],
  },
  {
    id: 'biot',
    type: 'design-team',
    organization: 'Biological Internet of Things (BIoT)',
    role: 'Instrumentation Team — BrewBox',
    location: 'Vancouver, BC',
    startDate: 'Sept 2025',
    endDate: 'Present',
    highlights: [
      'Designing and integrating environmental sensors to monitor brewing parameters: temperature, pH, dissolved oxygen, and fermentation activity.',
      'Developing the "BrewBox" — a compact IoT system consolidating sensor inputs into a microcontroller hub for real-time data acquisition, calibration, and wireless dashboard transmission.',
    ],
    tags: ['IoT', 'Sensors', 'Microcontroller', 'Embedded C', 'Wireless'],
  },
  {
    id: 'open-robotics',
    type: 'design-team',
    organization: 'Open Robotics, UBC Engineering Design Team',
    role: 'Electrical Power Team / Haptic Knob Project',
    location: 'Vancouver, BC',
    startDate: 'Sept 2023',
    endDate: 'Present',
    highlights: [
      'Designed and implemented power distribution and safety cutoff circuits for autonomous robots — >95% efficiency, <50ms emergency response.',
      'Collaborating across electrical, software, and mechanical subteams for the Robocup@Home competition.',
      'Developing a closed-loop BLDC motor control system generating haptic torque feedback that emulates RLC circuit behaviors, using current sensing, encoder feedback, and PID on the ESP32-PICO.',
      'Integrating hardware and firmware for the motor driver, encoder, and SPI OLED display.',
    ],
    tags: ['BLDC', 'FOC', 'PID', 'ESP32', 'Power Electronics', 'Robotics'],
  },
  {
    id: 'tjahya-elektronik',
    type: 'work',
    organization: 'Tjahya Elektronik, Kintamani Bali',
    role: 'Electrical Technician & Sales Rep',
    location: 'Bali, Indonesia',
    startDate: '2016',
    endDate: 'Present',
    highlights: [
      'Diagnosed and repaired 100+ electrical devices — CRT/LED TVs, speakers, household appliances — using systematic debugging and component-level replacement.',
      'Upgraded 20+ legacy speaker systems by integrating Bluetooth modules and redesigning control boards.',
      'Calibrated and installed digital and satellite TV receivers; developed an all-in-one USB config tool that reduced setup time by 80%.',
      'Managed store operations: inventory, component pricing, and supplier coordination for 200+ component SKUs.',
      'Providing ongoing remote assistance and consultation while studying full-time at UBC.',
    ],
    tags: ['Electronics Repair', 'SMD Soldering', 'Oscilloscope', 'Fault Diagnosis', 'Embedded C'],
  },
]
