package sales_savvy.controller;

import sales_savvy.entity.Order;
import sales_savvy.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class OrderController {

    private final OrderService orderService;
    
    

    public OrderController(OrderService orderService) {
		super();
		this.orderService = orderService;
	}

	// ─── Customer endpoints ────────────────────────────────────
    @PostMapping("/api/user/orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Order> placeOrder(Authentication auth, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(orderService.placeOrder(
                auth.getName(),
                body.get("shippingAddress"),
                body.get("shippingOption")
        ));
    }

    @GetMapping("/api/user/orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<Order>> getMyOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.getMyOrders(auth.getName()));
    }

    @GetMapping("/api/user/orders/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Order> getOrderDetail(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // ─── Admin endpoints ───────────────────────────────────────
    @GetMapping("/api/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/api/admin/orders/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, body.get("status")));
    }
}
