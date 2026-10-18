package com.crave.config;

import com.crave.entity.MenuItem;
import com.crave.entity.Restaurant;
import com.crave.entity.Role;
import com.crave.entity.User;
import com.crave.repository.MenuItemRepository;
import com.crave.repository.RestaurantRepository;
import com.crave.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           RestaurantRepository restaurantRepository,
                           MenuItemRepository menuItemRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already seeded
        }

        System.out.println(">>> Crave: Seeding initial users, restaurants, and menu items with Indian Rupee (₹) prices...");

        // 1. Create Users
        User admin = new User("Crave Admin", "admin@crave.com", passwordEncoder.encode("password123"), "+91 98765 43210", Role.ROLE_ADMIN);
        User owner = new User("Chef Luigi & Rajiv", "owner@crave.com", passwordEncoder.encode("password123"), "+91 98765 43211", Role.ROLE_RESTAURANT_OWNER);
        User customer = new User("Sarah Jenkins", "customer@crave.com", passwordEncoder.encode("password123"), "+91 98765 43212", Role.ROLE_CUSTOMER);

        userRepository.saveAll(List.of(admin, owner, customer));

        // 2. Create Restaurants
        Restaurant r1 = new Restaurant(
                "Bella Italia Trattoria",
                "Authentic handcrafted wood-fired pizzas, fresh pasta, and traditional Tuscan recipes.",
                "Italian",
                "Indiranagar 100ft Road",
                "Bangalore",
                "+91 80 4123 4567",
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
                25,
                true,
                owner
        );
        r1.setRating(4.8);

        Restaurant r2 = new Restaurant(
                "The Burger Lab",
                "Gourmet smashed wagyu patties, artisanal brioche buns, and house-made truffle aioli.",
                "Burgers",
                "Koramangala 5th Block",
                "Bangalore",
                "+91 80 4234 5678",
                "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
                20,
                true,
                owner
        );
        r2.setRating(4.7);

        Restaurant r3 = new Restaurant(
                "Spice & Saffron",
                "Rich and aromatic North Indian curries, tandoori grills, and slow-cooked fragrant biryanis.",
                "Indian",
                "Connaught Place, Central",
                "New Delhi",
                "+91 11 4345 6789",
                "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
                35,
                true,
                owner
        );
        r3.setRating(4.9);

        Restaurant r4 = new Restaurant(
                "Tokyo Ramen & Sushi",
                "18-hour simmered rich tonkotsu broth, hand-pulled noodles, and fresh sashimi cuts.",
                "Japanese",
                "Bandra West, Hill Road",
                "Mumbai",
                "+91 22 4456 7890",
                "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
                30,
                true,
                owner
        );
        r4.setRating(4.6);

        restaurantRepository.saveAll(List.of(r1, r2, r3, r4));

        // 3. Create Menu Items with Rupee (₹) Pricing
        // For Bella Italia Trattoria
        MenuItem m1 = new MenuItem("Margherita D.O.P.", "San Marzano tomato sauce, fresh buffalo mozzarella, fresh basil, extra virgin olive oil", new BigDecimal("349.00"), "Mains", true, "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80", true, r1);
        MenuItem m2 = new MenuItem("Truffle Tagliatelle", "Handmade egg pasta tossed with black summer truffle butter and aged Parmigiano Reggiano", new BigDecimal("420.00"), "Mains", true, "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=600&q=80", true, r1);
        MenuItem m3 = new MenuItem("Crispy Calamari", "Tender flash-fried calamari with lemon garlic dip and marinara sauce", new BigDecimal("280.00"), "Appetizers", false, "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80", true, r1);
        MenuItem m4 = new MenuItem("Classic Tiramisu", "Espresso-soaked ladyfingers, velvety mascarpone cream, and Dutch cocoa dust", new BigDecimal("199.00"), "Desserts", true, "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80", true, r1);

        // For The Burger Lab
        MenuItem m5 = new MenuItem("Truffle Wagyu Beast Burger", "Double smash wagyu beef, smoked cheddar, caramelized onions, truffle garlic mayo", new BigDecimal("389.00"), "Mains", false, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", true, r2);
        MenuItem m6 = new MenuItem("Crispy Chicken Sando", "Buttermilk fried chicken breast, spicy house slaw, dill pickles, hot honey glaze", new BigDecimal("299.00"), "Mains", false, "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80", true, r2);
        MenuItem m7 = new MenuItem("Loaded Parmesan Truffle Fries", "Golden shoestring fries dusted with rosemary sea salt, parmesan, and truffle drizzle", new BigDecimal("159.00"), "Appetizers", true, "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80", true, r2);
        MenuItem m8 = new MenuItem("Salted Caramel Milkshake", "Creamy hand-spun vanilla bean gelato, salted butter caramel, whipped cream", new BigDecimal("149.00"), "Beverages", true, "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80", true, r2);

        // For Spice & Saffron
        MenuItem m9 = new MenuItem("Butter Chicken (Murgh Makhani)", "Tandoor-charred chicken simmered in a silky tomato, cashew nut, and butter gravy", new BigDecimal("360.00"), "Mains", false, "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80", true, r3);
        MenuItem m10 = new MenuItem("Paneer Tikka Masala", "Grilled spiced cottage cheese cubes in a fragrant, spiced onion and tomato sauce", new BigDecimal("310.00"), "Mains", true, "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80", true, r3);
        MenuItem m11 = new MenuItem("Garlic Butter Naan Basket", "Freshly baked clay-oven leavened bread brushed with melted garlic butter and cilantro", new BigDecimal("89.00"), "Appetizers", true, "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80", true, r3);

        // For Tokyo Ramen
        MenuItem m12 = new MenuItem("Signature Tonkotsu Ramen", "Rich pork bone broth, springy noodles, chashu pork belly, ajitsuke tamago egg, nori", new BigDecimal("380.00"), "Mains", false, "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80", true, r4);
        MenuItem m13 = new MenuItem("Spicy Salmon Roll (8 pcs)", "Fresh Atlantic salmon, spicy mayo, crisp cucumber, toasted sesame seeds", new BigDecimal("340.00"), "Mains", false, "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80", true, r4);
        MenuItem m14 = new MenuItem("Pan-Fried Pork Gyoza", "Crispy-bottomed Japanese dumplings served with spicy scallion dipping sauce", new BigDecimal("190.00"), "Appetizers", false, "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80", true, r4);

        menuItemRepository.saveAll(List.of(m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14));

        System.out.println(">>> Crave: Successfully seeded database with Rupee prices (₹)!");
    }
}
