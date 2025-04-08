<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{

    protected $fillable = [
        'about_id',
        'name',
        'content',
        'image_url'
    ];
}
