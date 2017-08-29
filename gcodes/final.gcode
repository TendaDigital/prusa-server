G4 ; wait
M107 ; turn off fan
G1 Z15 ;go up 15mm
G1 Y120 F6000.0 ; go back to 120mm
G1 Z0.4 ; go down to 0.4mm
G1 Y90 F6000.0 ; go to y 90 mm
G28 Y F1232.0 ; go to y 0 (home in Y)
G1 Y36 F3000.0 ; go to Y 36
G28 X F3000.0  ; home X
M84 ; disable motors
M104 S0 ; turn off temperature
M140 S0 ; turn off heatbed
