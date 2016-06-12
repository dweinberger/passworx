<?php
//$uname = $_POST['uname'];
//if ($uname == "\n") {$uname="";}
//$pwd = $_POST['pwd'];
//if ($pwd == "\n") {$pwd="";}
//$pwdcomment = $_POST['pwdcomment'];
//if ($pwdcomment == "\n") {$pwdcomment="";}
//$comment = $_POST['comment'];
//if ($comment == "\n") {$comment="";}
//$url = $_POST['url'];
//if ($url == "\n") {$url="";}
//$title = $_POST['ttitle'];
//if ($title == "\n") {$title="";}
//$numb = $_POST['numb'];
//if ($numb == "\n") {$numb="";}
$stringD = $_POST['arecord'];
//$stringD = urldecode($stringU);

//$stringD = $uname . "\n" . $pwd  . "\n" . $pwdcomment . "\n" . $comment . "\n" . $url  . "\n" .  $title . "\n" .  $numb . "\n";

$myFile = "pwd.dat";
$fh = fopen($myFile, 'a') or die("Can't open file pwd.dat, writing record: " . $stringD);
fwrite($fh, $stringD);
fclose($fh);
echo $stringD;
?>