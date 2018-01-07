<?php

date_default_timezone_set("America/New_York");
$datestr = date("Y-m-d-H-i-s");
$bakfname = "../data/data_bak/pwd-" . $datestr . ".json";
copy("../data/pwd.json", $bakfname);
error_log("PWD.JSON saved to " . $bakfname);
echo("PWD.JSON saved to " . $bakfname);
?>