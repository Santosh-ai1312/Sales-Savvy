package sales_savvy.controller;
import sales_savvy.entity.Payment;
import sales_savvy.service.PaymentService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
		super();
		this.paymentService = paymentService;
	}

	// Create Razorpay order for an existing order
    @PostMapping("/create/{orderId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Map<String, Object>> createPayment(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.createRazorpayOrder(orderId));
    }

    // Verify payment after Razorpay callback
    @PostMapping("/verify")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Payment> verifyPayment(@RequestBody Map<String, String> body) {
        Payment payment = paymentService.verifyAndConfirm(
                body.get("razorpayOrderId"),
                body.get("razorpayPaymentId"),
                body.get("signature")
        );
        return ResponseEntity.ok(payment);
    }

    // Get payment details for an order
    @GetMapping("/order/{orderId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Payment> getPaymentByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.getPaymentByOrder(orderId));
    }
}
