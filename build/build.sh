#!/bin/bash

cat -n js/gh.js | perl -n -e 'print "JAVASCRIPT COMMENT WARNING: /*...*/ is much safer than //...\n  js/gh.js:$_" if /\/\/ /'

echo Preprocessing template literals in js/gh.js
perl ./build/preprocess-template-literals.pl js/gh.js >js/compiled/gh.js

echo Uglifying js/compiled/gh.js
uglifyjs js/compiled/gh.js -c -m -O quote_style=1 >js/compiled/gh.min.js

echo Building gh.html from gh.tmpl.html
perl ./build/replace.pl gh.tmpl.html js/compiled/gh.js js/compiled/gh.min.js >gh.html

f() {
    SIZE=$(stat --format "%s" $1)
    printf "%5d %-25s %s\n" "$SIZE" "$1" "$2"
}

f js/gh.js "Source javascript"
f js/compiled/gh.js "Preprocessed javascript"
f js/compiled/gh.min.js "Minimised javascript"
f gh.html "Compiled html"