#!/bin/bash

echo Preprocessing template literals in js/gh.js
perl ./build/preprocess-template-literals.pl js/gh.js >js/compiled/gh.js

echo Uglifying js/compiled/gh.js
uglifyjs js/compiled/gh.js -c -m -O quote_style=1 >js/compiled/gh.min.js

echo Building gh.html from gh.tmpl.html
perl ./build/replace.pl gh.tmpl.html js/compiled/gh.js js/compiled/gh.min.js >gh.html

ls -l js/gh.js
ls -l js/compiled/gh.js
ls -l js/compiled/gh.min.js
ls -l gh.html
