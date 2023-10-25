# Chat 
- Version : 2.0

## Librairies
- Jquery 3.7.1
- composer

### Installation
> composer install
- Import DB from "doc/"

### Run server
- bin/server.bat

### Information
```php

// Add a user into DB
$userModel = new App\Model\UserModel();
$userModel->addUser(string $username, string $plainPassword); 

// Remove all messages into "chat" table
$chatModel = new App\Model\ChatModel():
$chatModel->deleteAllMessage(true);

```
- Parameters of DB into "db/Database.php"
