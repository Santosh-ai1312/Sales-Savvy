package sales_savvy.controller;

import sales_savvy.entity.Cart;
import sales_savvy.service.CartService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user/cart")

public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
		super();
		this.cartService = cartService;
	}

	@GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Cart> getCart(Authentication auth) {
        return ResponseEntity.ok(cartService.getOrCreateCart(auth.getName()));
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Cart> addToCart(Authentication auth, @RequestBody Map<String, Object> body) {
        Long productId = Long.valueOf(body.get("productId").toString());
        int quantity = Integer.parseInt(body.get("quantity").toString());
        return ResponseEntity.ok(cartService.addToCart(auth.getName(), productId, quantity));
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Cart> updateCart(Authentication auth, @RequestBody Map<String, Object> body) {
        Long productId = Long.valueOf(body.get("productId").toString());
        int quantity = Integer.parseInt(body.get("quantity").toString());
        return ResponseEntity.ok(cartService.updateCartItem(auth.getName(), productId, quantity));
    }

    @DeleteMapping("/clear")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Cart> clearCart(Authentication auth) {
        return ResponseEntity.ok(cartService.clearCart(auth.getName()));
    }
}
