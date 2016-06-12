<?php

// Converts data file to a cvs suitable for LastPass.
// run this in your browser. Make sure to put the path to your data file.

function dp($t){
	print("<p>" . $t . "</p>");
}

$dataFileName = "pwd.dat"
$f = file_get_contents($dataFileName);

$f = preg_replace("/(\x0D|\x0A)/", "\n", $f); // getthe line endings right - thank you, Andy Silva!
//print($f);
// make array of records
$fa = explode("---- ", $f);

	// dp("f[0]: " . $fa[0]);
// 	dp("f[1]: " . $fa[1]);
// 	dp("f[20]: " . $fa[20]);
$ct = count($fa);
$o = fopen("dashlane.csv","w");
// write the labels that LastPass expects
fwrite($o, "url,type,username,password,hostname,extra,name,grouping\n");
print("records found: " . $ct . "<br>");
$rec = array();
$j = 0;

// for each recorded password entry
for ($i = 0; $i < $ct; $i++){
	// turn this item into array of 7 lines
	$rec = explode(PHP_EOL,$fa[$i]);
// 	print("<p>lines in record #$i:" . count($rec) . "</p>");
	// write them out
	$decoded = "";
	// write out the record as seven lines
	$decodedrecord = array();
	for ($linectr=0; $linectr < 7; $linectr++){
		// dp("Line $i.$linectr=" . $rec[$linectr]);
		$line = $rec[$linectr];
		// decode it
		// turn a line into array of characters
		$chararray = str_split($line);
		$charctr = 0;
		$decodedline = "";
		// go through a line to decode
		if ($line == ""){
			$done = true;
		}
		else{
			$done = false;
		}
		// walk through line, decoding it by taking
		//   char pairs, subtracting 3, and reversing them,
		while ($done == false){
			$p2 = $chararray[$charctr];
			if (($charctr + 1) <= count($chararray)){
				$p1 = $chararray[$charctr + 1];
			}
			else {
				$done = true;
			}
			// dp("ORD: " . ord($p1));
			$c1 = chr(ord($p1) - 3);
			$c2 = chr(ord($p2) - 3);
			if ((ord($c1) > 128) || (ord($c1) < 18) ){$c1="";}
			if ((ord($c2) > 128) || (ord($c2) < 18)){$c2="";}
			$decodedline = $decodedline . $c1 . $c2;
			$charctr = $charctr + 2;
			if ($charctr >= count($chararray)){
				$done = true;
				$decodedrecord[$linectr] = $decodedline;
				
			}
		}
	}
	// done with one record. Add it to the file
	for ($n = 0; $n < 7; $n++){
		// fwrite($o,$decodedrecord[$n]);
		dp($n . ": " . $decodedrecord[$n]);
	}
	
		
	// write out the required info
	$astring = implode('',$decodedrecord); // ignore empty elements
	if ($astring != ""){
	fwrite($o,$decodedrecord[5] . ",,");
	fwrite($o,$decodedrecord[1] . ",");
	fwrite($o,$decodedrecord[2] . ",,");
	fwrite($o,$decodedrecord[3] . ",");
	fwrite($o,$decodedrecord[6] . ",\n");
	}

}


fclose($o);

?>
