<?php

 		include_once('db.php');

$tel = $_POST['telephone'];


$query = mysql_query("SELECT verification_code FROM list WHERE telephone = '$tel'");



$results = mysql_fetch_array($query);
print_r($results['verification_code']);

?>
