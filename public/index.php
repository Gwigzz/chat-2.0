<?php

require_once '../vendor/autoload.php';

$userModel = new App\Model\UserModel();
// $userModel->addUser('john', 'john');

$app = new App\App();

$app->checkSession();

if ($app->isAuth()) {
    return $app->alert('Already connected', 'warning')->redirect('/chat/chat.php');
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="icon" href="favicon.ico" />

    <title>Login</title>

    <link rel="stylesheet" type="text/css" href="./asset/css/style.css" />

    <script src="./asset/js/script.js" defer></script>

</head>

<body>

    <!-- alert -->
    <?php require_once '../template/alert.php' ?>

    <div>
        <form action="./controller.php" method="POST">
            <div>
                <label for="username">Username</label>
                <input type="text" id="username" name="username" placeholder="username" required />
            </div>
            <div>
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="password" required />
            </div>
            <button type="submit">Connexion</button>
        </form>
    </div>

</body>

</html>