package com.infosys.backend.service;

import com.infosys.backend.model.Otp;
import com.infosys.backend.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private JavaMailSender mailSender;

    public void generateAndSendOtp(String email) {
        // Generate a 6 digit random number
        String otpCode = String.format("%06d", new Random().nextInt(999999));

        // Save or update in MongoDB
        Optional<Otp> existingOtp = otpRepository.findByEmail(email);
        Otp otp;
        if (existingOtp.isPresent()) {
            otp = existingOtp.get();
        } else {
            otp = new Otp();
            otp.setEmail(email);
        }
        otp.setOtpCode(otpCode);
        otp.setCreatedAt(LocalDateTime.now());
        // OTP valid for 5 minutes
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(5));

        otpRepository.save(otp);

        // Send Email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("devikasanka@gmail.com"); // explicitly set sender to fix MessagingException
        message.setTo(email);
        message.setSubject("Your OTP for Smart Home Energy Management System");
        message.setText("Your OTP is: " + otpCode + ". It is valid for 5 minutes.");
        mailSender.send(message);
    }

    public boolean verifyOtp(String email, String enteredOtp) {
        Optional<Otp> optionalOtp = otpRepository.findByEmail(email);
        if (optionalOtp.isPresent()) {
            Otp otp = optionalOtp.get();
            if (otp.getOtpCode().equals(enteredOtp)) {
                if (LocalDateTime.now().isBefore(otp.getExpiresAt())) {
                    return true; // Valid and not expired
                }
            }
        }
        return false;
    }
}
