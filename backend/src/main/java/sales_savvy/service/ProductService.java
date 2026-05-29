package sales_savvy.service;

import sales_savvy.entity.Product;
import sales_savvy.exception.ResourceNotFoundException;
import sales_savvy.repository.ProductRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    // ✅ Constructor added
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> searchByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Product> searchByTag(String tag) {
        return productRepository.findByTag(tag);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updated) {
        Product product = getProductById(id);

        product.setName(updated.getName());
        product.setDescription(updated.getDescription());
        product.setPrice(updated.getPrice());
        product.setStockQuantity(updated.getStockQuantity());
        product.setCategory(updated.getCategory());
        product.setTags(updated.getTags());
        product.setImageUrl(updated.getImageUrl());
        product.setStatus(updated.getStatus());

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public void reduceStock(Long productId, int quantity) {

        Product product = getProductById(productId);

        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException(
                    "Insufficient stock for product: " + product.getName()
            );
        }

        product.setStockQuantity(product.getStockQuantity() - quantity);

        if (product.getStockQuantity() == 0) {
            product.setStatus(Product.ProductStatus.OUT_OF_STOCK);
        }

        productRepository.save(product);
    }
}