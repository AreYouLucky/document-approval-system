<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendMail;

class MailController extends Controller
{
    public function sendEmail()
    {
        $details = [
            'name' => 'STII Quality Management Representative',
            'message' => "
            I hope this email finds you well.  
            I am reaching out to request your review of Sample Title , Revision No. 1. This is already reviewed by yours truly.  
             Use this code to access the document:",
            'sender' => 'Sample Sender',
            'position' => 'Document Custodian',
            'code' => '123JSQ',
            'link' => 'http://127.0.0.1:8000/qmr/review-document/.'
        ];

        Mail::to('cagadasjohnpurchases@gmail.com')->send(new SendMail($details));

        Mail::to('johnmichaelcagadas@gmail.com')->send(new SendMail($details));

        return "Email Sent Successfully!";
    }
}
