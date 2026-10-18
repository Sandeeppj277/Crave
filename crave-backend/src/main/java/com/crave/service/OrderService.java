package com.crave.service;

import com.crave.dto.OrderItemRequest;
import com.crave.dto.OrderRequest;
import com.crave.dto.OrderResponse;
import com.crave.entity.MenuItem;
import com.crave.entity.Order;
import com.crave.entity.OrderItem;
import com.crave.entity.OrderStatus;
import com.crave.entity.Role;
import com.crave.entity.User;
import com.crave.exception.BadRequestException;
import com.crave.exception.ResourceNotFoundException;
import com.crave.repository.MenuItemRepository;
import com.crave.repository.OrderRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final AuthService authService;

    public OrderService(OrderRepository orderRepository,
                        MenuItemRepository menuItemRepository,
                        AuthService authService) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.authService = authService;
    }

    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        // Enforce: User must be logged in as a CUSTOMER to place an order!
        // Admin and Owners are restricted to platform control and kitchen menus.
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            throw new AccessDeniedException("You must be logged in to place an order.");
        }
        if (currentUser.getRole() != Role.ROLE_CUSTOMER) {
            throw new BadRequestException("Only customer accounts are authorized to place orders. Admins and Restaurant Owners are dedicated to overall process control and menu management.");
        }

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Order cannot be empty.");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        String orderNumber = "CRV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Order order = new Order(orderNumber, currentUser, request.getDeliveryAddress(), BigDecimal.ZERO);

        for (OrderItemRequest itemReq : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + itemReq.getMenuItemId()));

            if (!menuItem.getIsAvailable()) {
                throw new BadRequestException("Dish '" + menuItem.getName() + "' is currently out of stock.");
            }

            BigDecimal itemTotal = menuItem.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            OrderItem orderItem = new OrderItem(order, menuItem, menuItem.getName(), menuItem.getPrice(), itemReq.getQuantity());
            orderItems.add(orderItem);
        }

        // Delivery fee: ₹40 if subtotal < ₹300, else FREE (in Rupees)
        BigDecimal deliveryFee = subtotal.compareTo(new BigDecimal("300")) < 0 ? new BigDecimal("40.00") : BigDecimal.ZERO;
        // GST Tax: 5% in India for food delivery
        BigDecimal tax = subtotal.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(deliveryFee).add(tax);

        order.setTotalAmount(totalAmount);
        order.setItems(orderItems);

        Order saved = orderRepository.save(order);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            throw new AccessDeniedException("User must be logged in to view orders.");
        }

        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        return orders.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null || currentUser.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("Admin authorization required to view and control all platform orders.");
        }

        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        return orders.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null || currentUser.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("Admin authorization required to control order process status.");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        order.setStatus(status);
        Order updated = orderRepository.save(order);
        return mapToResponse(updated);
    }

    private OrderResponse mapToResponse(Order o) {
        OrderResponse resp = new OrderResponse();
        resp.setId(o.getId());
        resp.setOrderNumber(o.getOrderNumber());
        resp.setUserId(o.getUser().getId());
        resp.setUserName(o.getUser().getName());
        resp.setDeliveryAddress(o.getDeliveryAddress());
        resp.setTotalAmount(o.getTotalAmount());
        resp.setStatus(o.getStatus());
        resp.setCreatedAt(o.getCreatedAt());

        if (o.getItems() != null) {
            List<OrderResponse.OrderItemDetail> itemDetails = o.getItems().stream()
                    .map(i -> new OrderResponse.OrderItemDetail(
                            i.getId(),
                            i.getMenuItem() != null ? i.getMenuItem().getId() : null,
                            i.getName(),
                            i.getPrice(),
                            i.getQuantity()
                    )).collect(Collectors.toList());
            resp.setItems(itemDetails);
        }

        return resp;
    }
}
