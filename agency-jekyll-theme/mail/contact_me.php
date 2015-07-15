<?php
// Check for empty fields
if(empty($_POST['name'])  		||
   empty($_POST['email']) 		||
   empty($_POST['attending']) 		||
   empty($_POST['message'])	||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
	echo "No arguments Provided!";
	return false;
   }

$name = $_POST['name'];
$email_address = $_POST['email'];
$attending = $_POST['attending'];
$message = $_POST['message'];

// Create the email and send the message
$to = 'luketlancaster@gmail.com'; // Add your email address inbetween the '' replacing yourname@yourdomain.com - This is where the form will send a message to.
$email_subject = "RSVP from:  $name";
$email_body = "You have received a new RSVP from your website contact form.\n\n"."Here are the details:\n\nName: $name\n\nEmail: $email_address\n\nAttending?: $attending\n\nMessage:\n$message";
$headers = "From: noreply@gmail.com\n"; // This is the email address the generated message will be from. We recommend using something like noreply@yourdomain.com.
$headers .= "Reply-To: $email_address";
mail($to,$email_subject,$email_body,$headers);
return true;
?>
