<?php
 		include_once('db.php');
               
		$friend_jid = $_POST['friend_jid'];
		$initializer_friend_login = $_POST['initializer_friend_login'];
		$friend_jid_row2 = substr($friend_jid, 0, -4);
		$initializer_friend_login_row2 = $initializer_friend_login . "@srv";
		$query1 = mysql_query("INSERT INTO `ofroster` (username, jid, sub, ask, recv, nick) VALUES ('$initializer_friend_login', '$friend_jid', '1', '-1', '-1', NULL)");
		$query2 = mysql_query("INSERT INTO `ofroster` (username, jid, sub, ask, recv, nick) VALUES ('$friend_jid_row2', '$initializer_friend_login_row2', '2', '-1', '-1', NULL)");

?>