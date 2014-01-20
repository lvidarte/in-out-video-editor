#!/bin/bash
if [ $# -lt 4 ]
then
    echo "Usage: $0 seconds video resolution image"
else
    ffmpeg -ss $1 -i $2 -t 1 -s $3 -f image2 $4 2>/dev/null
fi
