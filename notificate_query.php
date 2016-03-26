<?php

        include_once('db.php');

$friend_login = $_POST['friend_login'];


$result = mysql_query("SELECT * FROM ofroster WHERE username = '$friend_login' AND sub = 2");
$num_rows = mysql_num_rows($result);
echo $num_rows;

?>