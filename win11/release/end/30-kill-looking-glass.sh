#!/bin/bash

## Kill Looking Glass
dunstify "Killing Looking Glass..."
killall looking-glass-client

easyeffects --gapplication-service -b 1 &
copyq --start-server &
albert &

sleep 1
