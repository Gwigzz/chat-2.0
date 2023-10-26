<?php

namespace App\Model;

use DB\Database;

class UserModel extends Database
{

    private string $tableUser = "user";


    public function userOnline(int $idUser){
        $request = $this->getPDO()->prepare(
            "UPDATE {$this->tableUser} SET connected = true
            WHERE id = :idUser"
        );
        $request->bindValue(':idUser', $idUser, \PDO::PARAM_INT);
        if($request->execute()){
            return true;
        }
        return false;
    }

    public function userOffline(int $idUser){
        $request = $this->getPDO()->prepare(
            "UPDATE {$this->tableUser} SET connected = NULL
            WHERE id = :idUser"
        );
        $request->bindValue(':idUser', $idUser, \PDO::PARAM_INT);
        if($request->execute()){
            return true;
        }
        return false;

    }
    
    public function checkUsersOnline(){
        $request = $this->getPDO()->query(
            "SELECT id, username, connected
            FROM {$this->tableUser}
            WHERE connected = '1'"
        )->fetchAll(\PDO::FETCH_OBJ);
        return $request;
    }

    /**
     * Add a user into Database
     */
    public function addUser(string $username, string $plainPassword): bool
    {

        // hash password
        $plainPassword = password_hash($plainPassword, PASSWORD_BCRYPT);

        $request = $this->getPDO()->prepare(
            "INSERT INTO {$this->tableUser} (username, password)
            VALUES(:username, :password)"
        );
        $request->bindValue(':username', $username, \PDO::PARAM_STR);
        $request->bindValue(':password', $plainPassword, \PDO::PARAM_STR);

        if ($request->execute()) {
            return true;
        }
        return false;
    }

    public function findUserByUsername(string $username)
    {
        $request = $this->getPDO()->prepare(
            "SELECT * FROM {$this->tableUser}
            WHERE username = :username"
        );
        $request->bindValue(':username', $username, \PDO::PARAM_STR);
        $request->execute();

        return $request->rowCount() == 1 ? $request->fetch(\PDO::FETCH_OBJ) : null;
    }


    public function getAllUsers(): array|false
    {
        return $this->getPDO()->query("SELECT id, username, connected FROM {$this->tableUser}")->fetchAll(\PDO::FETCH_OBJ);
    }
}
