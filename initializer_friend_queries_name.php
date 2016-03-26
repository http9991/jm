<?php

	include_once('db.php');
$login = $_POST['login'];





$rs = mysql_query("SELECT name FROM `ofuser` WHERE username = '$login'");

$results = mysql_fetch_array($rs);
print_r($results['name']);




?>
