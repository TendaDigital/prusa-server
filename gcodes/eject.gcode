G4 ; wait
M107 ; turn off fan
G90 ; Absolute values
G1 Z10 F9000.0;go up 15mm
G1 Y100 F9000.0 ; go back to 120mm
G1 Z0.0 F9000.0; go down to 0.4mm
G1 Y90 F9000.0 ; go to y 90 mm
G1 Y85 F500.0 ; go to y 90 mm
G28 Y F500.0 ; go to y 0 (home in Y)

G1 Z10 Y70 X25 F9000.0
G1 Z0.0 F9000.0;go back with Z
G28 Y F500.0 ; go to y 0 (home in Y)

;G1 Y36 F9000.0 ; go to Y 36
G28 X F9000.0  ; home X