<?php

namespace App\Model;

use DateTime;
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

        if ($request->execute()) {
            $lastMessage = $this->getLastMessage();
            return $lastMessage;
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
            "
        )->fetchAll(\PDO::FETCH_OBJ);

        return $request;
    }

    public function getLastMessage()
    {

        // becaus lastInsertId() NOT WORKING !!!
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
            ORDER BY idMessage DESC LIMIT 1
            "
        )->fetch(\PDO::FETCH_OBJ);

        return $request;
    }


    public function getLastMessagesAfterDate(string $dateLastMessage)
    {
        // format date for match to date register in DB
        $newFormatDate = date_create_from_format("H:i:s d/m/Y", $dateLastMessage)->format('Y-m-d H:i:s');

        $request = $this->getPDO()->prepare(
            "SELECT 
            {$this->tableChat}.id AS idMessage,
            {$this->tableChat}.idUsername,
            {$this->tableChat}.message,
            DATE_FORMAT({$this->tableChat}.dateMessage, '%H:%i:%s %d/%m/%Y') AS dateMessage,
            {$this->tableUser}.username
            FROM {$this->tableChat}
            INNER JOIN {$this->tableUser} 
            ON {$this->tableChat}.idUsername = {$this->tableUser}.id
            WHERE {$this->tableChat}.dateMessage > :dateLastMessage
            ORDER BY idMessage ASC"
        );

        $request->bindParam(':dateLastMessage', $newFormatDate, \PDO::PARAM_STR);
        $request->execute();

        return $request->fetchAll(\PDO::FETCH_OBJ);
    }

    public function getMessagesAfterId(int $messageId)
    {
        $request = $this->getPDO()->prepare(
            "SELECT 
        {$this->tableChat}.id AS idMessage,
        {$this->tableChat}.idUsername,
        {$this->tableChat}.message,
        DATE_FORMAT({$this->tableChat}.dateMessage, '%H:%i:%s %d/%m/%Y') AS dateMessage,
        {$this->tableUser}.username
        FROM {$this->tableChat}
        INNER JOIN {$this->tableUser} 
        ON {$this->tableChat}.idUsername = {$this->tableUser}.id
        WHERE {$this->tableChat}.id > :messageId
        ORDER BY idMessage ASC"
        );

        $request->bindParam(':messageId', $messageId, \PDO::PARAM_INT);
        $request->execute();

        return $request->fetchAll(\PDO::FETCH_OBJ);
    }


    public function removeAllMessages()
    {
        $request = $this->getPDO()->query("DELETE FROM {$this->tableChat}")->execute();

        return $request;
    }
}
