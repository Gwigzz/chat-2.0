<?php

namespace App\Model;

use DB\Database;

class ChatModel extends Database
{

    private string $tableChat = "chat";

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

}