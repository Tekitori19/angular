<?php

namespace App\Models;

use GuzzleHttp\Client;
use Illuminate\Database\Eloquent\Model;

class About extends Model
{
    protected $fillable = [
        'name',
        'avatar_url',
        'email',
        'phone',
        'location',
        'description',
        'what_i_am_doing'
    ];

    protected $casts = [
        'what_i_am_doing' => 'array'
    ];

    public function whatIDoings() {
        return $this->hasMany(what_i_doings::class);
    }

public function testimonials() {
    return $this->hasMany(Testimonial::class);
}

    public function clients() {
        return $this->hasMany(Client::class);
    }
}
