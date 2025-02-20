#!/usr/bin/perl

open FH, '<', 'js/gh.min.js' or die "Can't open file $!";
my $js = do { local $/; <FH> };
close FH;

sub f {
   my $c = shift;
   $c =~ s/\r?\n/\\n/g;
   return "'" . $c . "'";
   # return $c . $c;
}

$js =~ s/`(.*?)`/f($1)/egs;

open FH, '<', 'gh.html' or die "Can't open file $!";
my $html = do { local $/; <FH> };
close FH;

$html =~ s/\/\*M1\*\/.*\/\*M2\*\//\/*M1*\/\n$js\n\/*M2*\//s;

open FH, '>', 'gh.html' or die "Can't open file $!";
print FH $html;
close FH;
