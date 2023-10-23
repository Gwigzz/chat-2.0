<?php

require_once '../vendor/autoload.php';

$userModel      = new App\Model\UserModel();
$app            = new App\App();

$app->checkSession();


// login
if (
    isset($_POST['username']) && !empty($_POST['username']) &&
    isset($_POST['password']) && !empty($_POST['password'])
) {

    $username = htmlspecialchars($_POST['username']);
    $plainPassword = htmlspecialchars($_POST['password']);

    // check if user exist into db
    if ($user = $userModel->findUserByUsername($username)) {
        // check if password match
        if (password_verify($plainPassword, $user->password)) {

            // log user
            $_SESSION['auth'] = (object) [
                'id' => $user->id,
                'username' => $user->username,
                'connected' => true,
            ];
            return $app->alert('Connecté')->redirect('/chat/chat.php');
        }
    }

    $app->alert('Informations invalides', 'danger')->redirect('/index.php');
}


// logout
if (isset($_GET['logout'])) {
    $app->disconnect()->alert('Deconnecté')->redirect('/index.php?info=logout');
}


return $app->alert('Error 000', 'danger')->redirect('/index.php');
