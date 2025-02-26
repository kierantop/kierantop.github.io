#!/usr/bin/perl

open FH, '<', $ARGV[0] or die "Can't open file $!";
my $js = do { local $/; <FH> };

sub f {
   my $c = shift;
   $c =~ s/\r?\n/\\n/g;
   return "'" . $c . "'";
}

$js =~ s/`(.*?)`/f($1)/egs;

print $js;
