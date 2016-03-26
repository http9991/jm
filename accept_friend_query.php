<?php

	include_once('connection.php');
	$mysqli= new mysqli($host,$sqllogin,$sqlpass,$bd);
	if($mysqli->connect_errno) exit;
$login_initializer = $_POST['login_initializer'];
$jid = $_POST['jid'];
$login_initializer_otherside = substr($jid, 0, -4);
$jid_otherside = $login_initializer . "@srv";

$mysqli->query("UPDATE ofroster SET sub = 3 WHERE username = '$login_initializer' and jid = '$jid'");
$mysqli->query("UPDATE ofroster SET sub = 3 WHERE username = '$login_initializer_otherside' and jid = '$jid_otherside'");

$list='[';
	$result = $mysqli->query("SELECT name FROM ofuser WHERE username = '$login_initializer_otherside'");
	if(!$result) exit;
	$name=$result->fetch_array();
	$list.=' { "jid": "'.$login_initializer_otherside.'" , "name": "'.$name[0].'" ';
	$result = $mysqli->query("SELECT offlineDate FROM ofpresence WHERE username = '$login_initializer_otherside'");
	if(!$result) $list.='} ] ';
	else{
		$dateoff=$result->fetch_array();
		$list.=' ,"dateoff": "'.$dateoff[0].'" } ] ';
	}
echo $list;
?>
