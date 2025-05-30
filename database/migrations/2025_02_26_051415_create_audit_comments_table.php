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
        Schema::create('audit_comments', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->string('comments');
            $table->integer('audit_logs_id')->nullable();
            $table->string('location')->nullable();
            $table->string('reviewer')->nullable();
            $table->integer('revision_id');
            $table->integer('document_id');
            $table->integer('is_resolved')->default(0);
            $table->date('comment_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_comments');
    }
};
