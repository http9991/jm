<?php

include_once('connection.php');
if(empty($_POST['login'])) exit;
$login = $_POST['login'];
$mysqli= new mysqli($host,$sqllogin,$sqlpass,$bd);
if($mysqli->connect_errno) exit;
$res = $mysqli->query("SELECT jid FROM ofRoster WHERE username = '$login' AND sub=3");
if(!$res) exit;
$list='[';
while($row=$res->fetch_array())
    {
        
        $friend=substr($row[0] , 0, strrpos($row[0], '@'));
        $result = $mysqli->query("SELECT name FROM ofUser WHERE username = '$friend'");
        if(!$result) exit;
        $name=$result->fetch_array();
        $list.=' { "jid": "'.$friend.'" , "name": "'.$name[0].'" ';
        $result = $mysqli->query("SELECT offlineDate FROM ofPresence WHERE username = '$friend'");
        if(!$result) $list.='} , ';
        else{
        $dateoff=$result->fetch_array();
        $list.=' ,"dateoff": "'.$dateoff[0].'" } , ';
        }
        
    };
    $res = $mysqli->query("SELECT name FROM ofUser WHERE username = '$login'");
    if(!$res) exit;
    $name=$res->fetch_array();
    $list.= ' { "name": "'.$name[0].'" }]';
    echo $list;
?>
