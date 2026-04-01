import type { ProjectData } from '@/types/project'

export const projects: ProjectData[] = [
  {
    slug: 'haptic-knob',
    title: 'Haptic Feedback Knob',
    tagline: 'Field-oriented controlled BLDC motor with configurable haptic detents and FreeRTOS firmware',
    category: 'firmware',
    tags: ['STM32', 'FreeRTOS', 'FOC', 'BLDC', 'C', 'Motor Control', 'Embedded'],
    date: '2024',
    featured: true,
    coverImage: '/assets/img/haptic-knob-cover.jpg',
    images: ['/assets/img/haptic-knob-cover.jpg'],
    summary:
      'A haptic feedback rotary encoder using field-oriented control (FOC) on a BLDC gimbal motor. Custom firmware implements multiple haptic modes — detents, springs, friction — configurable at runtime via serial. Runs FreeRTOS with dedicated PID and communication tasks.',
    sections: {
      problem:
        'Off-the-shelf encoders give no physical feedback. The goal was to create a knob that can simulate detents, spring centering, or friction — purely through torque control on a BLDC motor.',
      goals: [
        'Implement FOC for smooth, silent torque control at low RPM',
        'Support multiple haptic profiles selectable at runtime',
        'Run under FreeRTOS with real-time constraints',
        'Position accuracy better than 0.5 degrees using magnetic encoder',
      ],
      designDecisions:
        'FOC was chosen over simple PWM control for torque smoothness — critical for natural-feeling haptics. A DRV8313 gate driver provides three-phase output. Position sensing uses an AS5600 magnetic encoder over I2C. FreeRTOS separates the 20kHz current control loop from the communication task.',
      validation:
        'Tested across 5 haptic profiles with oscilloscope verification of phase currents. Position tracking verified against reference encoder. Latency measured at under 2ms from input to haptic response.',
      results:
        'Smooth, silent haptic feedback across all tested profiles. FOC eliminated the audible cogging noise present in simpler PWM approaches.',
    },
    links: [{ label: 'GitHub', url: 'https://github.com/fixables' }],
  },
  {
    slug: 'robomaestro',
    title: 'RoboMaestro PCB',
    tagline: 'Custom 4-layer motor controller PCB designed in Altium Designer for multi-axis robotic actuation',
    category: 'pcb',
    tags: ['Altium Designer', 'PCB Design', 'Motor Control', 'STM32', 'H-Bridge', 'Embedded'],
    date: '2024',
    featured: true,
    coverImage: '/assets/img/robomaestro-cover.jpg',
    images: ['/assets/img/robomaestro-cover.jpg'],
    model3d: '/assets/models/robomaestro.glb',
    summary:
      'A custom 4-layer PCB for multi-axis DC motor control. Designed in Altium Designer with integrated H-bridge drivers, quadrature encoder interfaces, and STM32 microcontroller. Purpose-built for robotic actuation with clean power separation and EMI considerations.',
    sections: {
      problem:
        'Off-the-shelf motor controller boards impose pin and layout constraints that conflict with multi-axis robotic designs. A custom PCB allows tight integration between MCU, drivers, and sensors.',
      goals: [
        'Support 4 independent DC motor channels with encoder feedback',
        'Integrate STM32 for real-time closed-loop control',
        'Clean 4-layer stack-up with dedicated power and ground planes',
        'Designed for ease of assembly and in-circuit programming',
      ],
      pcbHighlights:
        '4-layer stack: signal / GND / PWR / signal. H-bridge drivers placed close to motor connectors to minimize switching loop area. Decoupling caps within 1mm of driver supply pins. STM32 programming header exposed for easy firmware flashing.',
      results:
        'Board assembled and functional. All 4 motor channels verified. Encoder reading confirmed via UART debug output.',
    },
    links: [{ label: 'GitHub', url: 'https://github.com/fixables' }],
  },
  {
    slug: 'coin-picking-robot',
    title: 'Coin Picking Robot',
    tagline: 'Autonomous coin-sorting robot with vision-based detection and pneumatic pick-and-place',
    category: 'robotics',
    tags: ['Robotics', 'Computer Vision', 'OpenCV', 'Python', 'Pneumatics', 'Servo', 'Embedded'],
    date: '2023',
    featured: true,
    coverImage: '/assets/img/coin-robot-cover.jpg',
    images: ['/assets/img/coin-robot-cover.jpg'],
    summary:
      'An autonomous robot that detects, picks, and sorts coins by denomination using computer vision and a pneumatic gripper. Camera-based coin identification feeds a motion controller to position the arm over detected coins.',
    sections: {
      problem:
        'Design and build an autonomous system capable of identifying and sorting coins by denomination without human intervention.',
      goals: [
        'Reliable coin detection under varying lighting',
        'Sub-5mm positioning accuracy for pick operation',
        'Sort at minimum 10 coins per minute',
      ],
      results:
        'Successfully demonstrated 95%+ detection accuracy across test conditions. Achieved sorting rate of 12 coins/minute.',
    },
    links: [{ label: 'GitHub', url: 'https://github.com/fixables' }],
  },
  {
    slug: 'piano-bot',
    title: 'Piano Bot (ELEC 391)',
    tagline: 'STM32-based robot that physically plays a piano keyboard using DC motors with closed-loop position control',
    category: 'embedded',
    tags: ['STM32', 'FreeRTOS', 'PID', 'DC Motor', 'Encoder', 'C', 'RTOS', 'Embedded'],
    date: '2025',
    featured: false,
    coverImage: '/assets/img/piano-bot-cover.jpg',
    images: ['/assets/img/piano-bot-cover.jpg'],
    summary:
      'An STM32H7-based robot that physically plays piano keys using DC motors with quadrature encoder feedback. FreeRTOS manages concurrent PID control loops for two independent motor axes. Hardware encoder timers provide position sensing.',
    sections: {
      problem:
        'Automate physical piano key actuation with precise force and position control using a microcontroller and DC motors.',
      designDecisions:
        'STM32H753 provides enough timer peripherals for dual hardware encoder input and dual PWM output. FreeRTOS separates encoder reading, PID computation, and serial logging into concurrent tasks. Hardware encoder mode (TIM3, TIM4) avoids software interrupt overhead.',
      results: 'Encoder feedback and motor direction control verified. PID loop under active tuning.',
    },
    links: [{ label: 'GitHub', url: 'https://github.com/fixables' }],
  },
  {
    slug: 'electronics-repair',
    title: 'Electronics Repair & Instrumentation',
    tagline: '7 years of hands-on electronics fault diagnosis and repair at Tjahya Elektronik',
    category: 'embedded',
    tags: ['Fault Diagnosis', 'Soldering', 'Oscilloscope', 'Multimeter', 'PCB Repair', 'Power Electronics'],
    date: '2017–2024',
    featured: false,
    coverImage: '/assets/img/repair-cover.jpg',
    images: [],
    summary:
      'Seven years of practical electronics diagnosis and repair at Tjahya Elektronik. Work covered consumer electronics, power supplies, motor drives, and industrial control boards. Developed strong intuition for circuit failure modes and systematic fault isolation.',
    sections: {
      problem:
        'Diagnose and repair a wide range of electronic failures across consumer, industrial, and power electronics equipment.',
      results:
        'Thousands of repair cycles completed. Strong practical knowledge of failure modes in power supplies, motor drives, and mixed-signal circuits.',
    },
    links: [],
  },
  {
    slug: 'rtos-data-logger',
    title: 'RTOS Data Logger',
    tagline: 'FreeRTOS-based multi-channel data acquisition with SD card logging and UART streaming',
    category: 'firmware',
    tags: ['FreeRTOS', 'STM32', 'ADC', 'SD Card', 'UART', 'C', 'Embedded'],
    date: '2023',
    featured: false,
    coverImage: '/assets/img/logger-cover.jpg',
    images: [],
    summary:
      'A multi-channel data logger built on FreeRTOS. ADC samples are timestamped and written to SD card via SPI while simultaneously streaming over UART. Task scheduling ensures no samples are dropped under concurrent load.',
    sections: {
      designDecisions:
        'Double-buffered DMA ADC transfer decouples sampling from storage. FreeRTOS queue passes filled buffers to the logger task. File system uses FatFS over SPI.',
      results:
        'Continuous logging at 1kHz across 4 channels confirmed with no data loss over 8-hour test runs.',
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
