<?php

namespace DB;


abstract class Database
{
    private \PDO $pdo;

    private string $host        = "localhost";
    private string $name        = "chat-2.0";
    private string $login       = "root";
    private string $password    = "";
    private string $charset     = "utf8";


    protected function getPDO(): ?\PDO
    {
        return $this->buildPDO();
    }

    private function buildPDO(): ?\PDO
    {
        $this->pdo = new \PDO(
            "mysql:host={$this->host};dbname={$this->name};charset={$this->charset}",
            "{$this->login}",
            "{$this->password}",
            [
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
                \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC
            ]
        );

        return isset($this->pdo) ? $this->pdo : null;
    }
}
