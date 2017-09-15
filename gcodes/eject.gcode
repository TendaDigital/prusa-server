G1 E-3.0000 F2100.00000 ; Retract extruder

G4 ; wait
M107 ; turn off fan
G90 ; Absolute values

G1 Z10 F2000.0
G1 X101 Y66 F3000.0 
G1 Z0 F1000
G4 P100
SOFT:checkPrint
;G4 S30

G1 Z10 F5000.0;go up 15mm
G1 X50 F2000
G1 Y88 F9000.0 ; go back to 120mm
G1 Z0.0 F5000.0; go down to 0.4mm
G1 Y75 F300.0 ; go to y 90 mm
;G28 Y F500.0 ; go to y 0 (home in Y)
G1 Y0 F4000
SOFT:softwareHomeY

; Eject Line
G1 Z10 F5000
;G1 Y80 X25 F5000.0
G1 Y80 X18 F5000.0
G1 Z0.0 ;go back with Z
G1 Y0 F3000
SOFT:softwareHomeY


;G1 Y5 F9000.0 ; go to Y 5mm

;G28 X F9000.0  ; home X
;SOFT:softwareHomeX