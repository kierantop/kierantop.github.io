#!/usr/bin/perl

open FH, '<', 'js/gh.min.js' or die "Can't open file $!";
my $jsMin = do { local $/; <FH> };
close FH;

open FH, '<', 'js/gh.js' or die "Can't open file $!";
my $jsOrig = do { local $/; <FH> };
close FH;

sub f {
   my $c = shift;
   $c =~ s/\r?\n/\\n/g;
   return "'" . $c . "'";
}

$jsMin =~ s/`(.*?)`/f($1)/egs;

print "Length = " . length($jsMin) . "\n";

open FH, '<', 'gh.html' or die "Can't open file $!";
my $html = do { local $/; <FH> };
close FH;

$html =~ s/\/\*A1\*\/.*\/\*A2\*\//\/*A1*\/\n$jsMin\n\/*A2*\//s;
$html =~ s/\/\*B1\*\/.*\/\*B2\*\//\/*B1*\/\n$jsOrig\n\/*B2*\//s;

open FH, '>', 'gh.html' or die "Can't open file $!";
print FH $html;
close FH;
