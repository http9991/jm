<?php

	include_once('db.php');
$login = $_POST['login'];
$jid = $_POST['jid'];





$rs = mysql_query("SELECT username from ofroster WHERE username='$login' and jid='$jid'");


$results = mysql_fetch_array($rs);
print_r($results['username']);
?>