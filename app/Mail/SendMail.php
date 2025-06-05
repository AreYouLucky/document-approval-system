<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendMail extends Mailable
{
    use Queueable, SerializesModels;

    public $details;
    public $subject;

    public function __construct($details, $subject)
    {
        $this->details = $details;
        $this->subject = $subject;

    }

    public function build()
    {
        return $this->view('emails.email_template')
            ->subject($this->subject)
            ->with([
                'details' => $this->details,
            ]);
    }
}
