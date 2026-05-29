package sales_savvy.service;

import sales_savvy.config.JwtUtil;
import sales_savvy.dto.AuthDTOs;
import sales_savvy.entity.User;
import sales_savvy.exception.ResourceAlreadyExistsException;
import sales_savvy.repository.UserRepository;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    // ✅ Constructor added
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthDTOs.AuthResponse register(AuthDTOs.RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());

        // ✅ Role logic
        if (request.getRole() != null && !request.getRole().isEmpty()) {
            user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
        } else {
            user.setRole(User.Role.CUSTOMER);
        }

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new AuthDTOs.AuthResponse(
                token,
                user.getRole().name(),
                user.getName(),
                user.getEmail()
        );
    }

    public AuthDTOs.AuthResponse loginCustomer(AuthDTOs.LoginRequest request) {
        return login(request, User.Role.CUSTOMER);
    }

    public AuthDTOs.AuthResponse loginAdmin(AuthDTOs.LoginRequest request) {
        return login(request, User.Role.ADMIN);
    }

    private AuthDTOs.AuthResponse login(AuthDTOs.LoginRequest request, User.Role expectedRole) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRole().equals(expectedRole)) {
            throw new RuntimeException("Access denied for this role");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new AuthDTOs.AuthResponse(
                token,
                user.getRole().name(),
                user.getName(),
                user.getEmail()
        );
    }
}