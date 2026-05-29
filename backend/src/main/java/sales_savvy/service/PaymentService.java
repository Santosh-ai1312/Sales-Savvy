package sales_savvy.service;

import sales_savvy.entity.Order;
import sales_savvy.entity.Payment;
import sales_savvy.exception.ResourceNotFoundException;
import sales_savvy.repository.PaymentRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.Map;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderService orderService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    // ✅ Constructor added
    public PaymentService(PaymentRepository paymentRepository,
                          OrderService orderService) {
        this.paymentRepository = paymentRepository;
        this.orderService = orderService;
    }

    public Map<String, Object> createRazorpayOrder(Long orderId) {

        Order order = orderService.getOrderById(orderId);

        String razorpayOrderId = "order_" + System.currentTimeMillis();
        long amountInPaise = order.getTotalAmount()
                .multiply(BigDecimal.valueOf(100))
                .longValue();

        // ✅ Replace builder()
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setRazorpayOrderId(razorpayOrderId);
        payment.setAmount(order.getTotalAmount());
        payment.setMethod(Payment.PaymentMethod.RAZORPAY);
        payment.setStatus(Payment.PaymentStatus.PENDING);

        paymentRepository.save(payment);

        Map<String, Object> response = new HashMap<>();
        response.put("razorpayOrderId", razorpayOrderId);
        response.put("amount", amountInPaise);
        response.put("currency", "INR");
        response.put("keyId", razorpayKeyId);

        return response;
    }

    public Payment verifyAndConfirm(String razorpayOrderId,
                                    String razorpayPaymentId,
                                    String signature) {

        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        boolean valid = verifySignature(razorpayOrderId, razorpayPaymentId, signature);

        if (valid) {
            payment.setRazorpayPaymentId(razorpayPaymentId);
            payment.setRazorpaySignature(signature);
            payment.setStatus(Payment.PaymentStatus.SUCCESS);

            orderService.updateOrderStatus(
                    payment.getOrder().getId(),
                    "APPROVED"
            );
        } else {
            payment.setStatus(Payment.PaymentStatus.FAILED);
        }

        return paymentRepository.save(payment);
    }

    private boolean verifySignature(String orderId,
                                    String paymentId,
                                    String signature) {
        try {
            String data = orderId + "|" + paymentId;

            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(
                    razorpayKeySecret.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            );

            mac.init(secretKey);

            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            String generated = HexFormat.of().formatHex(hash);

            return generated.equals(signature);

        } catch (Exception e) {
            return false;
        }
    }

    public Payment getPaymentByOrder(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Payment not found for order: " + orderId));
    }
}