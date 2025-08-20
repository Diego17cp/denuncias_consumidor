<?php

namespace App\Services;

use Config\Services;

class MailService
{
    public function sendTrackingMail(string $to, string $trackingCode): bool|array
    {
        $email = Services::email();

        $frontend = env('FRONTEND_URL') ?: 'http://localhost:5173';
        $logoUrl = rtrim($frontend, '/') . '/logo-gestion.png';
        $trackingUrl = rtrim($frontend, '/') . '/tracking-denuncia?codigo=' . urlencode($trackingCode);

        $email->setTo($to);
        $email->setFrom(config('Email')->fromEmail, config('Email')->fromName);
        $email->setSubject('Seguimiento de Denuncia');

        $html = view('emails/tracking_code', [
            'trackingCode' => $trackingCode,
            'logoUrl' => $logoUrl,
            'trackingUrl' => $trackingUrl
        ]);
        $email->setMessage($html);

        if ($email->send()) {
            log_message('info', 'Email enviado a ' . $to . ' con código de seguimiento: ' . $trackingCode);
            return true;
        }

        log_message('error', 'Error al enviar email a ' . $to . ': ' . $email->printDebugger(['headers']));
        return false;
    }
}