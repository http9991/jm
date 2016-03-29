<?php
 		include_once('db.php');
		$username = $_POST['username'];
		$query= mysql_query("SELECT username FROM `ofuser` WHERE username = '$username'");
		$results = mysql_fetch_array($query);
		print_r($results['username']);

?>