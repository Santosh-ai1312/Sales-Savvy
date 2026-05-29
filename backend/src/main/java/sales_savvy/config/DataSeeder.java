package sales_savvy.config;

import java.math.BigDecimal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import sales_savvy.entity.Product;
import sales_savvy.entity.User;
import sales_savvy.repository.ProductRepository;
import sales_savvy.repository.UserRepository;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(
            UserRepository userRepository,
            ProductRepository productRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // Create Admin
            if (!userRepository.existsByEmail("admin@salessavvy.com")) {

                User admin = new User();

                admin.setName("Sales Savvy Admin");
                admin.setEmail("admin@salessavvy.com");
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setPhone("9999999999");
                admin.setRole(User.Role.ADMIN);
                admin.setStatus(User.UserStatus.ACTIVE);

                userRepository.save(admin);
            }

            // Create Products
            if (productRepository.count() == 0) {

                addProduct(productRepository,
                        "Apple iPhone 15",
                        "Latest Apple smartphone with A16 chip",
                        79999,
                        "MOBILES",
                        "apple,iphone,mobile",
                        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9");

                addProduct(productRepository,
                        "Samsung Galaxy S24",
                        "Premium Samsung flagship smartphone",
                        74999,
                        "MOBILES",
                        "samsung,android,mobile",
                        "https://images.unsplash.com/photo-1580910051074-3eb694886505");

                addProduct(productRepository,
                        "OnePlus 12",
                        "High performance Android phone",
                        59999,
                        "MOBILES",
                        "oneplus,mobile",
                        "https://images.unsplash.com/photo-1598327105666-5b89351aff97");

                addProduct(productRepository,
                        "Apple MacBook Air M3",
                        "Lightweight laptop with M3 chip",
                        114999,
                        "LAPTOPS",
                        "apple,macbook,laptop",
                        "https://images.unsplash.com/photo-1517336714739-489689fd1ca8");

                addProduct(productRepository,
                        "Dell Inspiron 15",
                        "Business and study laptop",
                        58999,
                        "LAPTOPS",
                        "dell,laptop",
                        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853");

                addProduct(productRepository,
                        "Sony WH-1000XM5",
                        "Premium wireless noise cancelling headphones",
                        24999,
                        "ELECTRONICS",
                        "sony,headphones",
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e");

                addProduct(productRepository,
                        "JBL Bluetooth Speaker",
                        "Portable speaker with powerful bass",
                        4999,
                        "ELECTRONICS",
                        "jbl,speaker",
                        "https://images.unsplash.com/photo-1589003077984-894e133dabab");

                addProduct(productRepository,
                        "Allen Solly Formal Shirt",
                        "Premium office wear shirt",
                        1499,
                        "FASHION",
                        "shirt,formal",
                        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf");

                addProduct(productRepository,
                        "Levi's Slim Fit Jeans",
                        "Comfortable denim jeans",
                        2499,
                        "FASHION",
                        "jeans,denim",
                        "https://images.unsplash.com/photo-1542272604-787c3835535d");

                addProduct(productRepository,
                        "Nike Sports T-Shirt",
                        "Breathable sports t-shirt",
                        1299,
                        "FASHION",
                        "nike,tshirt",
                        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab");

                addProduct(productRepository,
                        "LG Washing Machine",
                        "Front load washing machine",
                        32999,
                        "HOME_APPLIANCES",
                        "washing machine,lg",
                        "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1");

                addProduct(productRepository,
                        "Samsung Refrigerator",
                        "Double door smart refrigerator",
                        44999,
                        "HOME_APPLIANCES",
                        "fridge,samsung",
                        "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30");

                System.out.println("Sample Products Created Successfully");
            }
        };
    }

    private void addProduct(
            ProductRepository repo,
            String name,
            String description,
            double price,
            String category,
            String tags,
            String imageUrl) {

        Product product = new Product();

        product.setName(name);
        product.setDescription(description);
        product.setPrice(BigDecimal.valueOf(price));
        product.setStockQuantity(100);
        product.setCategory(category);
        product.setTags(tags);
        product.setImageUrl(imageUrl);
        product.setStatus(Product.ProductStatus.AVAILABLE);

        repo.save(product);
    }
}