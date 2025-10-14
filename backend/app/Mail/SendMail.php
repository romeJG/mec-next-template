<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data, $template, $subject;

    public function __construct($subject, $data, $template, $attachments = [])
    {
        $this->subject = $subject;
        $this->data = $data;
        $this->template = $template;
        $this->attachments = $attachments;
    }

    public function build()
    {
        $email = $this->subject($this->subject)
            ->view('emails.' . $this->template)
            ->with($this->data);

        foreach ($this->attachments as $file) {
            $email->attach($file->getRealPath(), [
                'as' => $file->getClientOriginalName() ?? null,
                'mime' => $file->getClientMimeType() ?? null,
            ]);
        }

        return $email;
    }
    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subject,
        );
    }
}
