<?php
 		include_once('db.php');
 
		$telephone_number = $_POST['usernamesignup'];
		$verification_code = $_POST['verification_code'];
 
		mysql_query("INSERT INTO `list` (telephone,isConfirmed, verification_code) VALUES ('$telephone_number', 0, '$verification_code')")

?>