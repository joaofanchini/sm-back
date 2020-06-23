const phaseEnum = {
  VE: 'VE',
  V0: 'V0',
  V1: 'V1',
  V2: 'V2',
  V3: 'V3',
  V4: 'V4',
  V5: 'V5',
  V6: 'V6',
  V7: 'V7',
  V8: 'V8',
  V9: 'V9',
  V10: 'V10',
  R1: 'R1',
  R2: 'R2',
  R3: 'R3',
  R4: 'R4',
  R5: 'R5',
  R6: 'R6',
  R7: 'R7',
  R8: 'R8',
  R9: 'R9',
  R10: 'R10',
  C: 'C',
  toArray() {
    return [
      'VE',
      'V0',
      'V1',
      'V2',
      'V3',
      'V4',
      'V5',
      'V6',
      'V7',
      'V8',
      'V9',
      'V10',
      'R0',
      'R1',
      'R2',
      'R3',
      'R4',
      'R5',
      'R6',
      'R7',
      'R8',
      'R9',
      'R10',
      'C'
    ];
  }
};

Object.freeze(phaseEnum);

module.exports = phaseEnum;
