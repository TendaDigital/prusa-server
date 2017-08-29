M115 U3.0.12 ; tell printer latest  fw version
M83  ; extruder relative mode
G1 Z0.150 F9000.000
G1 Y-3.0 F1000.0 ; go outside pritn area
G1 X25.0 E0.0  F4000.0 ; intro line
G1 Y20.0 E5.0  F1000.0 ; intro line
; Filament gcode