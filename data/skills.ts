export interface SkillCategory {
  id: string
  label: string
  color: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'programming',
    label: 'Programming',
    color: '#38bdf8',
    skills: ['C', 'C++', 'Python', 'MATLAB', 'ARM Assembly', 'Verilog', 'Arduino'],
  },
  {
    id: 'embedded',
    label: 'Embedded & Firmware',
    color: '#86efac',
    skills: ['ESP32', 'STM32', '8051', 'FreeRTOS', 'UART', 'SPI', 'I2C', 'PWM', 'Microbit'],
  },
  {
    id: 'hardware',
    label: 'CAD & Simulation',
    color: '#f59e0b',
    skills: ['Altium Designer', 'LTSpice', 'Simulink', 'Quartus', 'ModelSim', 'OnShape', 'Tinkercad'],
  },
  {
    id: 'instrumentation',
    label: 'Instrumentation',
    color: '#fb7185',
    skills: ['Oscilloscope', 'Multimeter', 'Function Generator', 'Bench PSU', 'Soldering (SMT & THT)'],
  },
  {
    id: 'fabrication',
    label: 'Fabrication',
    color: '#a78bfa',
    skills: ['PCB Assembly', 'Drilling', 'Filing', 'Wiring', 'Mechanical Assembly', 'SMD Rework'],
  },
  {
    id: 'tools',
    label: 'Collaboration & Tools',
    color: '#34d399',
    skills: ['Git', 'Excel', 'Word', 'Teams', 'Documentation', 'Project Management'],
  },
]
