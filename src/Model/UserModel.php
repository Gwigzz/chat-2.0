<?php

namespace App\Model;

use DB\Database;

class UserModel extends Database
{

    private string $tableUser = "user";


    /**
     * Add a user into Database
     */
    public function addUser(string $username, string $plainPassword) : bool
    {

        // hash password
        $plainPassword = password_hash($plainPassword, PASSWORD_BCRYPT);

        $request = $this->getPDO()->prepare(
            "INSERT INTO {$this->tableUser} (username, password)
            VALUES(:username, :password)"
        );
        $request->bindValue(':username', $username, \PDO::PARAM_STR);
        $request->bindValue(':password', $plainPassword, \PDO::PARAM_STR);

        if($request->execute()){
            return true;
        }
        return false;

    }
}
