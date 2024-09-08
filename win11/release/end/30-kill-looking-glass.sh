#!/bin/bash

## Kill Looking Glass
dunstify "Killing Looking Glass..."
killall looking-glass-client

easyeffects --gapplication-service &
copyq --start-server &
albert &

sleep 1
