<?php

        include_once('db.php');

$login = $_POST['login'];
$login = "+" . $login;

$result = mysql_query("SELECT * FROM ofroster WHERE username = '$login' AND sub = 3");
$num_rows = mysql_num_rows($result);
echo $num_rows;

?>
