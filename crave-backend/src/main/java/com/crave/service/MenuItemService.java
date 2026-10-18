package com.crave.service;

import com.crave.dto.MenuItemRequest;
import com.crave.dto.MenuItemResponse;
import com.crave.entity.MenuItem;
import com.crave.entity.Restaurant;
import com.crave.entity.Role;
import com.crave.entity.User;
import com.crave.exception.BadRequestException;
import com.crave.exception.ResourceNotFoundException;
import com.crave.repository.MenuItemRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;
    private final RestaurantService restaurantService;
    private final AuthService authService;

    public MenuItemService(MenuItemRepository menuItemRepository,
                           RestaurantService restaurantService,
                           AuthService authService) {
        this.menuItemRepository = menuItemRepository;
        this.restaurantService = restaurantService;
        this.authService = authService;
    }

    @Transactional(readOnly = true)
    public List<MenuItemResponse> getMenuItemsByRestaurant(Long restaurantId, String category, Boolean isVegetarian, Boolean availableOnly) {
        // verify restaurant exists
        restaurantService.findRestaurantOrThrow(restaurantId);

        List<MenuItem> items;
        if (category != null && !category.trim().isEmpty() && !"ALL".equalsIgnoreCase(category)) {
            items = menuItemRepository.findByRestaurantIdAndCategoryIgnoreCase(restaurantId, category.trim());
        } else if (isVegetarian != null) {
            items = menuItemRepository.findByRestaurantIdAndIsVegetarian(restaurantId, isVegetarian);
        } else if (availableOnly != null && availableOnly) {
            items = menuItemRepository.findByRestaurantIdAndIsAvailable(restaurantId, true);
        } else {
            items = menuItemRepository.findByRestaurantId(restaurantId);
        }

        return items.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MenuItemResponse getMenuItemById(Long id) {
        MenuItem item = findMenuItemOrThrow(id);
        return mapToResponse(item);
    }

    @Transactional(readOnly = true)
    public MenuItem findMenuItemOrThrow(Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
    }

    @Transactional
    public MenuItemResponse createMenuItem(MenuItemRequest request) {
        Restaurant restaurant = restaurantService.findRestaurantOrThrow(request.getRestaurantId());
        verifyOwnershipOrAdmin(restaurant);

        MenuItem item = new MenuItem(
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getCategory(),
                request.getIsVegetarian(),
                request.getImageUrl(),
                request.getIsAvailable(),
                restaurant
        );

        MenuItem saved = menuItemRepository.save(item);
        return mapToResponse(saved);
    }

    @Transactional
    public MenuItemResponse updateMenuItem(Long id, MenuItemRequest request) {
        MenuItem item = findMenuItemOrThrow(id);
        verifyOwnershipOrAdmin(item.getRestaurant());

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setCategory(request.getCategory());
        if (request.getIsVegetarian() != null) {
            item.setIsVegetarian(request.getIsVegetarian());
        }
        item.setImageUrl(request.getImageUrl());
        if (request.getIsAvailable() != null) {
            item.setIsAvailable(request.getIsAvailable());
        }

        MenuItem updated = menuItemRepository.save(item);
        return mapToResponse(updated);
    }

    @Transactional
    public MenuItemResponse toggleAvailability(Long id) {
        MenuItem item = findMenuItemOrThrow(id);
        verifyOwnershipOrAdmin(item.getRestaurant());

        item.setIsAvailable(!item.getIsAvailable());
        MenuItem updated = menuItemRepository.save(item);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteMenuItem(Long id) {
        MenuItem item = findMenuItemOrThrow(id);
        verifyOwnershipOrAdmin(item.getRestaurant());
        menuItemRepository.delete(item);
    }

    private void verifyOwnershipOrAdmin(Restaurant restaurant) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            throw new AccessDeniedException("Authentication required");
        }

        if (currentUser.getRole() == Role.ROLE_ADMIN) {
            return;
        }

        if (currentUser.getRole() == Role.ROLE_RESTAURANT_OWNER) {
            if (restaurant.getOwner() == null || restaurant.getOwner().getId().equals(currentUser.getId())) {
                return;
            }
        }

        throw new AccessDeniedException("You do not have permission to modify this restaurant's menu");
    }

    public MenuItemResponse mapToResponse(MenuItem item) {
        MenuItemResponse resp = new MenuItemResponse();
        resp.setId(item.getId());
        resp.setName(item.getName());
        resp.setDescription(item.getDescription());
        resp.setPrice(item.getPrice());
        resp.setCategory(item.getCategory());
        resp.setIsVegetarian(item.getIsVegetarian());
        resp.setImageUrl(item.getImageUrl());
        resp.setIsAvailable(item.getIsAvailable());
        if (item.getRestaurant() != null) {
            resp.setRestaurantId(item.getRestaurant().getId());
            resp.setRestaurantName(item.getRestaurant().getName());
        }
        return resp;
    }
}
