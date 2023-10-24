<?php

namespace App\Model;

use DB\Database;

class ChatModel extends Database
{

    private string $tableChat   = "chat";
    private string $tableUser   = "user";

    public function sendMessage(int $userId, string $message)
    {
        $request = $this->getPDO()->prepare(
            "INSERT INTO {$this->tableChat} (idUsername, message)
            VALUES(:idUsername, :message)"
        );
        $request->bindValue(':idUsername', $userId, \PDO::PARAM_INT);
        $request->bindValue(':message', $message, \PDO::PARAM_STR);

        if($request->execute()){
            return true;
        }
        return false;

    }

    public function getAllMessages()
    {
        $request = $this->getPDO()->query(
            "SELECT 
            {$this->tableChat}.id AS idMessage,
            {$this->tableChat}.idUsername,
            {$this->tableChat}.message,
            DATE_FORMAT({$this->tableChat}.dateMessage, '%H:%i:%s %d/%m/%Y') AS dateMessage,
            {$this->tableUser}.username
            FROM {$this->tableChat}
            INNER JOIN {$this->tableUser} 
            ON {$this->tableChat}.idUsername = {$this->tableUser}.id
            ORDER BY {$this->tableChat}.dateMessage ASC
            ")->fetchAll(\PDO::FETCH_OBJ);

        return $request;
    }

}