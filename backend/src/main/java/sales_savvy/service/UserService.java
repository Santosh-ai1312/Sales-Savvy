package sales_savvy.service;

import sales_savvy.entity.User;
import sales_savvy.exception.ResourceNotFoundException;
import sales_savvy.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ Constructor added
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with email: " + email));
    }

    public User updateUserRole(Long id, String role) {
        User user = getUserById(id);
        user.setRole(User.Role.valueOf(role.toUpperCase()));
        return userRepository.save(user);
    }

    public User updateUserStatus(Long id, String status) {
        User user = getUserById(id);
        user.setStatus(User.UserStatus.valueOf(status.toUpperCase()));
        return userRepository.save(user);
    }

    public User updateProfile(String email, String name, String phone) {
        User user = getUserByEmail(email);

        if (name != null) user.setName(name);
        if (phone != null) user.setPhone(phone);

        return userRepository.save(user);
    }

    public void resetPassword(Long id, String newPassword) {
        User user = getUserById(id);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}