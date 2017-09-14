G21 ; set units to millimeters
G90 ; use absolute coordinates
M83 ; use relative distances for extrusion

;G1 E-1.5000 F2100.00000

;M104 S{temperatureExtruder} ; set extruder temp
;M140 S50 ; set bed temp

G1 X0 F9000
SOFT:softwareHomeX  ; Home X
SOFT:softwareHomeY  ; Home Y

G1 X12.00 Y-2.00    ; Go to mesh bed probing location
SOFT:softwareHomeZ  ; Home Z

G30                 ; Home Z (fine)
G92 Z0.64   ; Offset babystep

;G1 X12.00 Y-2.00
;G30 

G92 X-{printOffset}

G1 Z4.0 F6000
G1 X25.0 E0.0  F4000.0 ; intro line
G1 Z0.20 F6000
G1 E3.000 F2100.00000
G1 Y30.0 E12.0  F1000.0 ; intro line
G1 E0.500 Z0.5 F2100.00000
G1 E-1.600 F2100.00000
