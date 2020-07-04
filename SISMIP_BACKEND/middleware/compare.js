const vefPhaseEnum = (phase) =>{
    switch (phase) {
        case 'VE':
            return 1;

        case 'V0':
            return 2;

        case 'V1':
            return 3;

        case 'V2':
            return 4;

        case 'V3':
            return 5;

        case 'V4':
            return 6;

        case 'V5':
            return 7;

        case 'V6':
            return 8;

        case 'V7':
            return 9;

        case 'V8':
            return 10;

        case 'V9':
            return 11;

        case 'V10':
            return 12;

        case 'R1':
            return 13;

        case 'R2':
            return 14;

        case 'R3':
            return 15;   

        case 'R4':
            return 16;

        case 'R5':
            return 17;

        case 'R6':
            return 18;   

        case 'R7':
            return 19;
    
        case 'R8':
            return 20;

        case 'R9':
            return 21;   

        case 'R10':
            return 22;
        
        case 'C':
            return 23;
            
        default:
            return 0;
    }
  };

  module.exports = vefPhaseEnum;