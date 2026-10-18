package com.crave.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "message", "Crave Food Delivery API is running smoothly!",
            "swaggerUi", "/swagger-ui/index.html",
            "apiDocs", "/api-docs",
            "restaurantsEndpoint", "/api/restaurants"
        ));
    }
}
