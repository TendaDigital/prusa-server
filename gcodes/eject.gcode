G4 ; wait
M107 ; turn off fan
G90 ; Absolute values

G1 E-10 F2100

G1 Z10 F7000.0 
G4
G1 X56 Y40 F6000.0
G1 Z0 F7000
G4 P100
SOFT:checkPrint

G1 Z10 F6000.0;
G1 X20 F6000
G1 Y78 F6000.0 ; 
G1 Z0.0 F6000.0; 
G1 Y68 F300.0 
G1 Y0 F4000
SOFT:softwareHomeY