package com.fitnesstracker.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontendUrl}")
    private String frontendUrl;

    @Async
    public void sendVerificationEmail(String to, String username, String token) {
        String link = frontendUrl + "/verify-email?token=" + token;
        String subject = "Verify Your FitTrack Account";
        String body = buildEmailHtml(
                "Welcome to FitTrack, " + username + "! 🎉",
                "You're almost there! Click the button below to verify your email address and activate your account.",
                "Verify My Email",
                link,
                "This link expires in 24 hours. If you did not create an account, you can safely ignore this email.");
        sendHtmlEmail(to, subject, body);
    }

    @Async
    public void sendPasswordResetEmail(String to, String username, String token) {
        String link = frontendUrl + "/reset-password?token=" + token;
        String subject = "Reset Your FitTrack Password";
        String body = buildEmailHtml(
                "Password Reset Request",
                "Hi " + username
                        + ", we received a request to reset your FitTrack password. Click the button below to set a new password.",
                "Reset My Password",
                link,
                "This link expires in 24 hours. If you did not request a password reset, you can safely ignore this email.");
        sendHtmlEmail(to, subject, body);
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email to " + to, e);
        }
    }

    private String buildEmailHtml(String heading, String body, String buttonText, String buttonUrl, String footer) {
        return "<!DOCTYPE html>" +
                "<html><head><meta charset='UTF-8'></head><body style='margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,sans-serif;'>"
                +
                "<table width='100%' cellpadding='0' cellspacing='0'><tr><td align='center' style='padding:40px 0;'>" +
                "<table width='560' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);'>"
                +
                // Header gradient
                "<tr><td style='background:linear-gradient(135deg,#8b5cf6,#ec4899);padding:40px 40px 30px;text-align:center;'>"
                +
                "<h1 style='color:#ffffff;margin:0;font-size:26px;font-weight:700;'>💪 FitTrack</h1>" +
                "</td></tr>" +
                // Body
                "<tr><td style='padding:40px;'>" +
                "<h2 style='color:#1f2937;font-size:22px;margin:0 0 16px;'>" + heading + "</h2>" +
                "<p style='color:#6b7280;font-size:16px;line-height:1.6;margin:0 0 32px;'>" + body + "</p>" +
                "<div style='text-align:center;'>" +
                "<a href='" + buttonUrl
                + "' style='display:inline-block;background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:12px;font-size:16px;font-weight:700;letter-spacing:0.5px;'>"
                + buttonText + "</a>" +
                "</div>" +
                "<p style='margin:32px 0 0;color:#9ca3af;font-size:13px;text-align:center;'>" + footer + "</p>" +
                "</td></tr>" +
                // Footer
                "<tr><td style='background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;'>"
                +
                "<p style='color:#9ca3af;font-size:12px;margin:0;'>© 2025 FitTrack. All rights reserved.</p>" +
                "</td></tr>" +
                "</table></td></tr></table>" +
                "</body></html>";
    }
}
