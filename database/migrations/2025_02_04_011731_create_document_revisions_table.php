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
        Schema::create('document_revisions', function (Blueprint $table) {
            $table->id('revision_id');
            $table->unsignedBigInteger('document_id');
            $table->foreign('document_id')->references('document_id')->on('documents')
            ->onDelete('cascade')->onUpdate('cascade');
            $table->string('title');
            $table->string('document_type');
            $table->string('document_dir')->nullable();
            $table->string('pdf_dir')->nullable();
            $table->integer('file_type')->default(1);
            $table->integer('process_type')->default(1);
            $table->string('process_owner')->nullable();
            $table->integer('version_no')->default(1);
            $table->string('initiator')->nullable();
            $table->string('reasons')->nullable();
            $table->date('date_prepared')->nullable();
            $table->integer('progress_status')->default(0);
            $table->string('division_chief_id')->nullable();
            $table->date('division_chief_approved_date')->nullable();
            $table->string('qmr_id')->nullable();
            $table->date('qmr_approved_date')->nullable();
            $table->string('supporting_documents')->nullable();
            $table->date('effectivity_date')->nullable();
            $table->date('retention_period')->nullable();
            $table->integer('is_new_version')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_revisions');
    }
};
