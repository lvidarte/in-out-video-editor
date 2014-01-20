#!/usr/bin/python
# -*- coding: utf-8 -*-

import subprocess
import re
import sys

pattern = re.compile(r'(\d{2}.\d{3}) fps')
for moviePath in sys.argv[1:]:
    mplayerOutput = subprocess.Popen(("mplayer", "-identify", "-frames", "0", "o-ao", "null", moviePath), stdout=subprocess.PIPE, stderr=subprocess.PIPE).communicate()[0]
    fps = pattern.search(mplayerOutput).groups()[0]
    print fps
