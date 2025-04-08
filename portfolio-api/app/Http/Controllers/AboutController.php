<?php

namespace App\Http\Controllers;

use App\Models\About;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    public function index() {
        return About::with(['whatIDoings', 'testimonials', 'clients'])->get();
    }

    public function store(Request $request) {
        $about = About::create([
            'title' => $request->title,
            'description' => $request->description
        ]);

    foreach ($request->what_i_doings as $doing) {
        $about->whatIDoings()->create($doing);
    }

    foreach ($request->testimonials as $testimonial) {
        $about->testimonials()->create($testimonial);
    }

    foreach ($request->clients as $client) {
        $about->clients()->create($client);
    }

    return response()->json($about->load(['whatIDoings', 'testimonials', 'clients']));
}
}
