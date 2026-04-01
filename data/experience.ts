import type { ExperienceEntry } from '@/types/experience'

export const experience: ExperienceEntry[] = [
  {
    id: 'ubc-education',
    type: 'education',
    organization: 'University of British Columbia',
    role: 'BASc Electrical Engineering',
    location: 'Vancouver, BC',
    startDate: '2021',
    endDate: 'Present',
    highlights: [
      'Full-ride merit scholarship valued at CAD $400,000+',
      'Coursework: embedded systems, control systems, power electronics, digital design, signals & systems',
      'Capstone: Piano Bot — STM32H7 + FreeRTOS closed-loop motor control system',
      "Dean's List recognition",
    ],
    tags: ['STM32', 'FreeRTOS', 'Control Systems', 'Power Electronics'],
    scholarship: {
      amount: 'CAD $400,000+',
      description:
        'Full-ride merit scholarship covering tuition, housing, and living expenses for the full duration of the degree.',
    },
  },
  {
    id: 'tjahya-elektronik',
    type: 'work',
    organization: 'Tjahya Elektronik',
    role: 'Electronics Technician',
    location: 'Indonesia',
    startDate: '2017',
    endDate: '2024',
    highlights: [
      '7 years of hands-on electronics diagnosis and repair',
      'Repaired consumer electronics, power supplies, motor drives, and industrial control boards',
      'Developed systematic fault isolation methodology across diverse circuit topologies',
      'Proficient with oscilloscope, function generator, bench power supply, and soldering equipment',
      'Component-level repair including SMD rework and PCB trace repair',
    ],
    tags: ['Fault Diagnosis', 'SMD Rework', 'Oscilloscope', 'Power Electronics', 'PCB Repair'],
  },
  {
    id: 'ubc-formula',
    type: 'design-team',
    organization: 'UBC Formula Electric',
    role: 'Embedded Firmware Engineer',
    location: 'Vancouver, BC',
    startDate: '2022',
    endDate: 'Present',
    highlights: [
      'Developed CAN bus firmware for vehicle control unit in C on STM32',
      'Implemented fault detection and safe-state transitions for high-voltage battery system',
      'Collaborated with hardware team on PCB bring-up and testing',
    ],
    tags: ['STM32', 'CAN Bus', 'C', 'FreeRTOS', 'Automotive'],
  },
  {
    id: 'ubc-bionics',
    type: 'design-team',
    organization: 'UBC Bionics',
    role: 'Firmware Developer',
    location: 'Vancouver, BC',
    startDate: '2023',
    endDate: 'Present',
    highlights: [
      'Developed EMG signal acquisition firmware for prosthetic limb control',
      'Implemented real-time signal processing pipeline on ARM Cortex-M',
      'Designed SPI driver for high-speed ADC interfacing',
    ],
    tags: ['ARM Cortex-M', 'SPI', 'ADC', 'Signal Processing', 'C'],
  },
]
