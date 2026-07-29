package com.learnspear.Service;

import com.learnspear.Repository.*;
import com.learnspear.entites.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final UserRepo userRepo;
    private final CourseRepo courseRepo;
    private final EnrollmentRepo enrollmentRepo;
    private final CouponRepo couponRepo;
    private final PaymentRepo paymentRepo;
    private final NotificationRepo notificationRepo;

    @PostConstruct
    @Transactional
    public void seedDefaultCoupons() {
        if (couponRepo.count() == 0) {
            couponRepo.save(Coupon.builder().code("WELCOME10").discountPercent(10).active(true).build());
            couponRepo.save(Coupon.builder().code("LEARNSPEAR20").discountPercent(20).active(true).build());
            couponRepo.save(Coupon.builder().code("FREEMIUM").discountPercent(100).active(true).build());
        }
    }

    public Coupon validateCoupon(String code) {
        return couponRepo.findByCodeIgnoreCase(code)
                .filter(Coupon::getActive)
                .orElseThrow(() -> new RuntimeException("Invalid or expired coupon code"));
    }

    @Transactional
    public Map<String, Object> checkout(Long courseId, String couponCode, Principal principal) {
        Users student = userRepo.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Courses course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Check if student is already enrolled
        Optional<Enrollment> existing = enrollmentRepo.findByStudentIdAndCourseId(student.getId(), courseId);
        if (existing.isPresent()) {
            throw new RuntimeException("You are already enrolled in this course");
        }

        double basePrice = course.getPrice() != null ? course.getPrice() : 99.0;
        int discount = 0;

        if (couponCode != null && !couponCode.trim().isEmpty()) {
            try {
                Coupon coupon = validateCoupon(couponCode);
                discount = coupon.getDiscountPercent();
            } catch (Exception e) {
                // Ignore invalid coupon, charge base price
            }
        }

        double finalPrice = basePrice * (100 - discount) / 100.0;
        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 13).toUpperCase();

        // Save transaction
        Payment payment = Payment.builder()
                .student(student)
                .course(course)
                .amount(finalPrice)
                .paymentStatus("SUCCESSFUL")
                .couponCode(couponCode)
                .transactionId(transactionId)
                .build();
        paymentRepo.save(payment);

        // Auto enroll student
        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .completed(false)
                .progressPercentage(0)
                .enrollmentDate(LocalDateTime.now())
                .build();
        enrollmentRepo.save(enrollment);

        // Notify student
        notificationRepo.save(Notification.builder()
                .user(student)
                .title("Enrollment Success! 🎉")
                .message("You have successfully purchased and enrolled in '" + course.getTitle() + "'. Start learning!")
                .type("COURSE")
                .build());

        Map<String, Object> receipt = new HashMap<>();
        receipt.putAll(Map.of(
                "transactionId", transactionId,
                "amountPaid", finalPrice,
                "courseTitle", course.getTitle(),
                "status", "SUCCESSFUL",
                "createdAt", LocalDateTime.now()
        ));
        return receipt;
    }

    public List<Payment> getPaymentHistory(Principal principal) {
        Users student = userRepo.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return paymentRepo.findByStudentIdOrderByCreatedAtDesc(student.getId());
    }
}
