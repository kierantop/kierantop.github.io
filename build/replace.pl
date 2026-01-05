#!/usr/bin/perl

open FH, '<', $ARGV[0] or die "Can't open template file $!";
my $html = do { local $/; <FH> };
close FH;

open FH, '<', $ARGV[1] or die "Can't open file $!";
my $jsOrig = do { local $/; <FH> };
$jsOrig =~ s/"/&quot;/g;
close FH;

open FH, '<', $ARGV[2] or die "Can't open file $!";
my $jsMin = do { local $/; <FH> };
$jsMin =~ s/"/&quot;/g;
close FH;

$html =~ s/\/\*MINIFIEDJS\*\//$jsMin/s;
$html =~ s/\/\*UNMINIFIEDJS\*\//\n$jsOrig\n/s;

print $html;