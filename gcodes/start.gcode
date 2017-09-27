G21 ; set units to millimeters
G90 ; use absolute coordinates
M83 ; use relative distances for extrusion

G1 X0 F9000
SOFT:softwareHomeX  ; Home X
SOFT:softwareHomeY  ; Home Y

G1 X13.0 Y-2.0      ; Go to mesh bed probing location
SOFT:softwareHomeZ  ; Home Z

G30                 ; Home Z (fine)
G92 Z0.73                 ; Offset babystep

;G1 E3.500 F2100.000
;G1 X8.0 F2000.0
;G1 Y20.0 E5.0  F1000.0 ; intro line
;G1 Y40.0 E8.0  F1000.0 ; intro line
G1 E10.0 F2000
G4 P100