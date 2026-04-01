export interface SkillCategory {
  id: string
  label: string
  color: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'firmware',
    label: 'Firmware & RTOS',
    color: '#38bdf8',
    skills: ['C', 'C++', 'FreeRTOS', 'CMSIS', 'STM32 HAL', 'ARM Cortex-M', 'Bare Metal'],
  },
  {
    id: 'hardware',
    label: 'PCB & Hardware',
    color: '#86efac',
    skills: ['Altium Designer', 'KiCad', '4-Layer PCB', 'Schematic Capture', 'DFM', 'SMD Soldering'],
  },
  {
    id: 'motor-control',
    label: 'Motor Control',
    color: '#f59e0b',
    skills: ['FOC', 'PID Control', 'H-Bridge', 'BLDC', 'DC Motor', 'Encoder Feedback', 'DRV8313'],
  },
  {
    id: 'peripherals',
    label: 'Peripherals & Protocols',
    color: '#a78bfa',
    skills: ['UART', 'SPI', 'I2C', 'CAN Bus', 'ADC', 'PWM', 'DMA', 'Timers'],
  },
  {
    id: 'instrumentation',
    label: 'Test & Instrumentation',
    color: '#fb7185',
    skills: ['Oscilloscope', 'Logic Analyzer', 'Multimeter', 'Bench PSU', 'JTAG/SWD', 'PCB Repair'],
  },
  {
    id: 'software',
    label: 'Software & Tools',
    color: '#34d399',
    skills: ['Python', 'Git', 'Linux', 'STM32CubeIDE', 'VS Code', 'Make', 'GDB'],
  },
]
