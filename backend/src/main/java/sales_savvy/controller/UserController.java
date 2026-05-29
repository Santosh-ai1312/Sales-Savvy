package sales_savvy.controller;

import sales_savvy.entity.User;
import sales_savvy.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class UserController {

    private final UserService userService;
    
    

    public UserController(UserService userService) {
		super();
		this.userService = userService;
	}

	// ─── Admin endpoints ───────────────────────────────────────
    @GetMapping("/api/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/api/admin/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(userService.updateUserRole(id, body.get("role")));
    }

    @PutMapping("/api/admin/users/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(userService.updateUserStatus(id, body.get("status")));
    }

    @PutMapping("/api/admin/users/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> resetPassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        userService.resetPassword(id, body.get("password"));
        return ResponseEntity.ok("Password reset successfully");
    }

    @DeleteMapping("/api/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted");
    }

    // ─── Customer endpoints ────────────────────────────────────
    @GetMapping("/api/user/profile")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<User> getProfile(Authentication authentication) {
        return ResponseEntity.ok(userService.getUserByEmail(authentication.getName()));
    }

    @PutMapping("/api/user/profile")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<User> updateProfile(Authentication authentication,
                                               @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(userService.updateProfile(
                authentication.getName(), body.get("name"), body.get("phone")));
    }
}
