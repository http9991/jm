<?php

	include_once('db.php');
$login = $_POST['login'];





$rs = mysql_query("SELECT jid FROM `ofroster` WHERE username = '$login' and sub =1");

while($obj1 = mysql_fetch_object($rs)) {
$arr1[] = $obj1;
}

echo (json_encode($arr1));




?>
