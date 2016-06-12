<?php

date_default_timezone_set("America/New_York");
$datestr = date("Y:m:d:H:i:s");
$bakfname = "pwd-" . $datestr . ".dat";
copy("pwd.dat", $bakfname);
echo("PWD.DAT saved to " . $bakfname);
?>