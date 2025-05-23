<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
Schema::create('what_i_doings', function (Blueprint $table) {
    $table->id();
    $table->foreignId('about_id')->constrained()->onDelete('cascade');
    $table->string('icon');        // "design icon"
    $table->string('title');       // "Web design"
    $table->text('description');   // nội dung chi tiết
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('what_i_doings');
    }
};
