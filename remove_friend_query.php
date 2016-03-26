<?php

	include_once('db.php');
$login_initializer = $_POST['login_initializer'];
$jid = $_POST['jid'];
$login_initializer_otherside = substr($jid, 0, -4);
$jid_otherside = $login_initializer . "@srv";






$rs1 = mysql_query("DELETE FROM ofroster where username = '$login_initializer' and jid ='$jid'");
$rs2 = mysql_query("DELETE FROM ofroster where username = '$login_initializer_otherside' and jid ='$jid_otherside'");




?>
