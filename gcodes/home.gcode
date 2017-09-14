;G28 X Y Z

;SOFT:softwareHomeX  ; Home X
;SOFT:softwareHomeY  ; Home Y

; Reset to [0,0]
; G1 Y3 X2
; G92 X0 Y0

;G1 X12.00 Y-2.00    ; Go to mesh bed probing location
;SOFT:softwareHomeZ  ; Home Z

;G30                 ; Home Z (fine)
;G92 Z{babyHeight}   ; Offset babystep