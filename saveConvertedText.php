<?php

// breaks symlink and creates new file. So, eventually
// symlink($target, $link);
// .
// .
// unlink($link);
// symlink($new_target, $link);


$jsontext = $_REQUEST['jsontext'];
error_log("data:" . $jsontxt);



$myFile = "../data/convertedTo.json";
$f = fopen($myFile, "w"); 
fwrite($f, $jsontext);
fclose($f);

echo "Converted to JSON saved in $myFile";

?>