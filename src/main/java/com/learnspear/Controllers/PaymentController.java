package com.learnspear.Controllers;

import com.learnspear.Service.PaymentService;
import com.learnspear.entites.Coupon;
import com.learnspear.entites.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PaymentController {

    private final PaymentService paymentService;

    // 1. Validate Discount Coupon
    @GetMapping("/coupons/validate")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Coupon> validateCoupon(@RequestParam String code) {
        return ResponseEntity.ok(paymentService.validateCoupon(code));
    }

    // 2. Course Checkout Purchase
    @PostMapping("/checkout")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, Object>> checkout(
            @RequestBody Map<String, Object> request,
            Principal principal) {
        Long courseId = Long.valueOf(request.get("courseId").toString());
        String couponCode = (String) request.get("couponCode");
        return ResponseEntity.ok(paymentService.checkout(courseId, couponCode, principal));
    }

    // 3. Billing Payment History list
    @GetMapping("/payments/history")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Payment>> getPaymentHistory(Principal principal) {
        return ResponseEntity.ok(paymentService.getPaymentHistory(principal));
    }
}
