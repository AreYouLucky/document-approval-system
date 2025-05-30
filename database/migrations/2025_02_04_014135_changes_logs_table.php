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
        Schema::create('changes_logs', function (Blueprint $table) {

            $table->id();
            $table->integer('user_id');
            $table->string('changes');
            $table->integer('revision_id');
            $table->integer('document_id');
            $table->date('change_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('changes_logs');
    }
};
