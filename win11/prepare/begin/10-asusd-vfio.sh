#!/bin/bash

## Load VM variables
source "/etc/libvirt/hooks/qemu.d/win11/vm-vars.conf"

## Use supergfxctl to set graphics mode to vfio
dunstify "Setting graphics mode to VFIO..."
supergfxctl -m Vfio

dunstify "Graphics mode set!"
sleep 1

