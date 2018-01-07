<?php

// breaks symlink and creates new file. So, eventually
// symlink($target, $link);
// .
// .
// unlink($link);
// symlink($new_target, $link);

error_log("--------- in savejson.php---------\n\r");
$thedata = $_REQUEST['thedata'];
//error_log("data:" . $thedata);



$myFile = "../data/pwd.json";
$f = fopen($myFile, "w"); 
fwrite($f, $thedata);
fclose($f);

error_log("JSON saved to " . $myFile);

echo "JSON saved to " . $myFile;

?>