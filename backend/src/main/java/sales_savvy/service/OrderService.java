package sales_savvy.service;

import sales_savvy.entity.Cart;
import sales_savvy.entity.Order;
import sales_savvy.entity.OrderItem;
import sales_savvy.entity.User;
import sales_savvy.exception.ResourceNotFoundException;
import sales_savvy.repository.OrderRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final UserService userService;
    private final ProductService productService;

    // ✅ Constructor added
    public OrderService(OrderRepository orderRepository,
                        CartService cartService,
                        UserService userService,
                        ProductService productService) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.userService = userService;
        this.productService = productService;
    }

    @Transactional
    public Order placeOrder(String email, String shippingAddress, String shippingOption) {

        User user = userService.getUserByEmail(email);
        Cart cart = cartService.getOrCreateCart(email);

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // ✅ Replace builder()
        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(cart.getTotalPrice());
        order.setShippingAddress(shippingAddress);
        order.setShippingOption(
                Order.ShippingOption.valueOf(shippingOption.toUpperCase())
        );

        List<OrderItem> items = new ArrayList<>();

        for (var cartItem : cart.getItems()) {

            productService.reduceStock(
                    cartItem.getProduct().getId(),
                    cartItem.getQuantity()
            );

            // ✅ Replace builder()
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(cartItem.getProduct());
            item.setQuantity(cartItem.getQuantity());
            item.setPriceAtOrder(cartItem.getProduct().getPrice());

            items.add(item);
        }

        order.setItems(items);

        Order savedOrder = orderRepository.save(order);

        cartService.clearCart(email);

        return savedOrder;
    }

    public List<Order> getMyOrders(String email) {
        User user = userService.getUserByEmail(email);
        return orderRepository.findByUser(user);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        return orderRepository.save(order);
    }
}