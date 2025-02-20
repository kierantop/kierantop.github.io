#!/bin/bash


uglifyjs js/gh.js -c -m -O quote_style=1 >js/gh.min.js

ls -l js/gh.js
ls -l js/gh.min.js

perl ./build/replace.pl

