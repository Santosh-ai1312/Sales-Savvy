package sales_savvy.service;

import sales_savvy.entity.Cart;
import sales_savvy.entity.CartItem;
import sales_savvy.entity.Product;
import sales_savvy.entity.User;
import sales_savvy.exception.ResourceNotFoundException;
import sales_savvy.repository.CartRepository;

import org.springframework.stereotype.Service;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final UserService userService;
    private final ProductService productService;

    // ✅ Constructor added
    public CartService(CartRepository cartRepository,
                       UserService userService,
                       ProductService productService) {
        this.cartRepository = cartRepository;
        this.userService = userService;
        this.productService = productService;
    }

    public Cart getOrCreateCart(String email) {
        User user = userService.getUserByEmail(email);

        return cartRepository.findByUser(user).orElseGet(() -> {
            // ✅ Replace builder()
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
    }

    public Cart addToCart(String email, Long productId, int quantity) {

        Cart cart = getOrCreateCart(email);
        Product product = productService.getProductById(productId);

        cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .ifPresentOrElse(
                        item -> item.setQuantity(item.getQuantity() + quantity),
                        () -> {
                            //Replace builder()
                            CartItem newItem = new CartItem();
                            newItem.setCart(cart);
                            newItem.setProduct(product);
                            newItem.setQuantity(quantity);
                            cart.getItems().add(newItem);
                        }
                );

        return cartRepository.save(cart);
    }

    public Cart updateCartItem(String email, Long productId, int quantity) {

        Cart cart = getOrCreateCart(email);

        if (quantity <= 0) {
            cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        } else {
            cart.getItems().stream()
                    .filter(item -> item.getProduct().getId().equals(productId))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Item not in cart"))
                    .setQuantity(quantity);
        }

        return cartRepository.save(cart);
    }

    public Cart clearCart(String email) {
        Cart cart = getOrCreateCart(email);
        cart.getItems().clear();
        return cartRepository.save(cart);
    }
}