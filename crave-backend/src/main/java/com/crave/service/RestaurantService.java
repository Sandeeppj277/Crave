package com.crave.service;

import com.crave.dto.RestaurantRequest;
import com.crave.dto.RestaurantResponse;
import com.crave.entity.Restaurant;
import com.crave.entity.Role;
import com.crave.entity.User;
import com.crave.exception.BadRequestException;
import com.crave.exception.ResourceNotFoundException;
import com.crave.repository.RestaurantRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final AuthService authService;

    public RestaurantService(RestaurantRepository restaurantRepository, AuthService authService) {
        this.restaurantRepository = restaurantRepository;
        this.authService = authService;
    }

    @Transactional(readOnly = true)
    public List<RestaurantResponse> getAllRestaurants(String query, String cuisine, Boolean openOnly) {
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        String cleanCuisine = (cuisine != null && !cuisine.trim().isEmpty() && !"ALL".equalsIgnoreCase(cuisine)) ? cuisine.trim() : null;

        List<Restaurant> restaurants = restaurantRepository.searchRestaurants(cleanQuery, cleanCuisine, openOnly);
        return restaurants.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RestaurantResponse getRestaurantById(Long id) {
        Restaurant restaurant = findRestaurantOrThrow(id);
        return mapToResponse(restaurant);
    }

    @Transactional(readOnly = true)
    public Restaurant findRestaurantOrThrow(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<RestaurantResponse> getMyRestaurants() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            throw new BadRequestException("User not authenticated");
        }

        List<Restaurant> restaurants = (currentUser.getRole() == Role.ROLE_ADMIN) 
                ? restaurantRepository.findAll() 
                : restaurantRepository.findByOwnerId(currentUser.getId());

        return restaurants.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public RestaurantResponse createRestaurant(RestaurantRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null || currentUser.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("Only Admins are authorized to register new restaurant establishments.");
        }

        Restaurant restaurant = new Restaurant(
                request.getName(),
                request.getDescription(),
                request.getCuisineType(),
                request.getAddress(),
                request.getCity(),
                request.getPhone(),
                request.getImageUrl(),
                request.getDeliveryTimeMinutes(),
                request.getIsOpen(),
                currentUser
        );

        Restaurant saved = restaurantRepository.save(restaurant);
        return mapToResponse(saved);
    }

    @Transactional
    public RestaurantResponse updateRestaurant(Long id, RestaurantRequest request) {
        Restaurant restaurant = findRestaurantOrThrow(id);
        verifyOwnershipOrAdmin(restaurant);

        restaurant.setName(request.getName());
        restaurant.setDescription(request.getDescription());
        restaurant.setCuisineType(request.getCuisineType());
        restaurant.setAddress(request.getAddress());
        restaurant.setCity(request.getCity());
        restaurant.setPhone(request.getPhone());
        restaurant.setImageUrl(request.getImageUrl());
        if (request.getDeliveryTimeMinutes() != null) {
            restaurant.setDeliveryTimeMinutes(request.getDeliveryTimeMinutes());
        }
        if (request.getIsOpen() != null) {
            restaurant.setIsOpen(request.getIsOpen());
        }

        Restaurant updated = restaurantRepository.save(restaurant);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteRestaurant(Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null || currentUser.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("Only Admins are authorized to delete restaurant establishments.");
        }
        Restaurant restaurant = findRestaurantOrThrow(id);
        restaurantRepository.delete(restaurant);
    }

    private void verifyOwnershipOrAdmin(Restaurant restaurant) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            throw new AccessDeniedException("Authentication required");
        }

        if (currentUser.getRole() == Role.ROLE_ADMIN) {
            return;
        }

        if (restaurant.getOwner() == null || !restaurant.getOwner().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to modify this restaurant");
        }
    }

    public RestaurantResponse mapToResponse(Restaurant r) {
        RestaurantResponse resp = new RestaurantResponse();
        resp.setId(r.getId());
        resp.setName(r.getName());
        resp.setDescription(r.getDescription());
        resp.setCuisineType(r.getCuisineType());
        resp.setAddress(r.getAddress());
        resp.setCity(r.getCity());
        resp.setPhone(r.getPhone());
        resp.setImageUrl(r.getImageUrl());
        resp.setRating(r.getRating());
        resp.setDeliveryTimeMinutes(r.getDeliveryTimeMinutes());
        resp.setIsOpen(r.getIsOpen());
        resp.setCreatedAt(r.getCreatedAt());

        if (r.getOwner() != null) {
            resp.setOwnerId(r.getOwner().getId());
            resp.setOwnerName(r.getOwner().getName());
        }

        resp.setMenuItemCount(r.getMenuItems() != null ? r.getMenuItems().size() : 0);
        return resp;
    }
}
