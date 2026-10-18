package com.crave.controller;

import com.crave.dto.ApiResponse;
import com.crave.dto.RestaurantRequest;
import com.crave.dto.RestaurantResponse;
import com.crave.service.RestaurantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@Tag(name = "Restaurants", description = "Endpoints for restaurant discovery and management CRUD")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping
    @Operation(summary = "Get all restaurants with optional search query, cuisine filter and open status")
    public ResponseEntity<ApiResponse<List<RestaurantResponse>>> getAllRestaurants(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) Boolean openOnly) {
        List<RestaurantResponse> restaurants = restaurantService.getAllRestaurants(search, cuisine, openOnly);
        return ResponseEntity.ok(ApiResponse.ok("Restaurants retrieved successfully", restaurants));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get restaurant details by ID")
    public ResponseEntity<ApiResponse<RestaurantResponse>> getRestaurantById(@PathVariable Long id) {
        RestaurantResponse restaurant = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(ApiResponse.ok("Restaurant details retrieved", restaurant));
    }

    @GetMapping("/my")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    @Operation(summary = "Get restaurants owned by the current authenticated user (or all if admin)")
    public ResponseEntity<ApiResponse<List<RestaurantResponse>>> getMyRestaurants() {
        List<RestaurantResponse> restaurants = restaurantService.getMyRestaurants();
        return ResponseEntity.ok(ApiResponse.ok("Owned restaurants retrieved", restaurants));
    }

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new restaurant (Admin only)")
    public ResponseEntity<ApiResponse<RestaurantResponse>> createRestaurant(@Valid @RequestBody RestaurantRequest request) {
        RestaurantResponse created = restaurantService.createRestaurant(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Restaurant created successfully", created));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    @Operation(summary = "Update an existing restaurant by ID")
    public ResponseEntity<ApiResponse<RestaurantResponse>> updateRestaurant(
            @PathVariable Long id,
            @Valid @RequestBody RestaurantRequest request) {
        RestaurantResponse updated = restaurantService.updateRestaurant(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Restaurant updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a restaurant by ID (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.ok(ApiResponse.ok("Restaurant deleted successfully", null));
    }
}
