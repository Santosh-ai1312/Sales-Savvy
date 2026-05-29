package sales_savvy.controller;

import jakarta.validation.Valid;
import sales_savvy.dto.AuthDTOs;
import sales_savvy.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
		super();
		this.authService = authService;
	}

	// POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthDTOs.AuthResponse> register(@Valid @RequestBody AuthDTOs.RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // POST /api/auth/user/login
    @PostMapping("/user/login")
    public ResponseEntity<AuthDTOs.AuthResponse> userLogin(@Valid @RequestBody AuthDTOs.LoginRequest request) {
        return ResponseEntity.ok(authService.loginCustomer(request));
    }

    // POST /api/auth/admin/login
    @PostMapping("/admin/login")
    public ResponseEntity<AuthDTOs.AuthResponse> adminLogin(@Valid @RequestBody AuthDTOs.LoginRequest request) {
        return ResponseEntity.ok(authService.loginAdmin(request));
    }
}