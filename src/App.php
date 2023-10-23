<?php

namespace App;

class App
{
    /**
     * If session not started, session will be started
     */
    public static function checkSession(): void
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
    }

    /**
     * Redirect
     * 
     * @param string $path
     */
    public static function redirect(string $path): never
    {
        header("Location: {$path}");
        exit;
    }

    /**
     * Check if user is authenticated
     */
    public static function isAuth(): bool
    {
        if (isset($_SESSION['auth'])) {
            return true;
        }
        return false;
    }

    /**
     * Disconnect with "session_unset"
     */
    public function disconnect(): self
    {
        session_unset();
        return $this;
    }

    /**
     * Send a message
     * @param string $message
     * @param string $className = 'success'
     * 
     */
    public function alert(string $message, string $className = 'success')
    {
        self::checkSession();
        $_SESSION["alert"]["$className"] = "$message";
        return $this;
       
    }
}
