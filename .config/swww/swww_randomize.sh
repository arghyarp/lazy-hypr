#!/bin/bash

INTERVAL=60
while true; do
	find "$1" -type f  -name "*.tiff" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \
		| while read -r img; do
			echo "$((RANDOM % 1000)):$img"
		done \
		| sort -n | cut -d':' -f2- \
		| while read -r img; do
			swww img --transition-step 255 "$img"
			sleep $INTERVAL
			swww clear-cache
		done
done
