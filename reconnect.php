<?php

        include_once('db.php');

$initializer_login = $_POST['initializer_login'];

$result = mysql_query("SELECT * FROM ofroster WHERE username = '$initializer_login' AND sub = 1");
$num_rows = mysql_num_rows($result);
echo $num_rows;

?>