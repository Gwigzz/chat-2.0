<?php

namespace App;

class App
{
    public static function checkSession()
    {
        var_dump(session_status());
    } 
}
