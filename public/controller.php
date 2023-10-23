<?php

require_once '../vendor/autoload.php';

$userModel      = new App\Model\UserModel();
$chatModel      = new App\Model\ChatModel();
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


// get all user
if (isset($_GET['getAllUsers']) && $app->isAuth()) {
    $users = $userModel->getAllUsers();
    echo json_encode($users);
}

// send message
if (isset($_POST['message']) && !empty($_POST['message']) && $app->isAuth()) {
    $message = strip_tags($_POST['message']);
    $send =  $chatModel->sendMessage($_SESSION['auth']->id, $message);
    $datas = [
        'send' => $send,
        'content' => $message,
        'userId' => $_SESSION['auth']->id,
        'username' => $_SESSION['auth']->username,
    ];
    echo json_encode($datas);
}

// logout
if (isset($_GET['logout'])) {
    $app->disconnect()->alert('Deconnecté')->redirect('/index.php?info=logout');
}


// return $app->alert('Error 000', 'danger')->redirect('/index.php');
