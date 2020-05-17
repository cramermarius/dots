#!/bin/sh

brightness_level=$(cat /sys/class/backlight/intel_backlight/brightness)
brightness_max=$(cat /sys/class/backlight/intel_backlight/max_brightness)
brightness_percent=$(( $brightness_level * 100 / $brightness_max ))
echo -n "$brightness_percent%"
