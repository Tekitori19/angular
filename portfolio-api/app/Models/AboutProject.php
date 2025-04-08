<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutProject extends Model
{
    protected $fillable = [
        'about_id',
        'title',
        'image_url'
    ];
}
