package com.crave.repository;

import com.crave.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    List<Restaurant> findByOwnerId(Long ownerId);

    List<Restaurant> findByCuisineTypeIgnoreCase(String cuisineType);

    List<Restaurant> findByCityIgnoreCase(String city);

    @Query("SELECT r FROM Restaurant r WHERE " +
           "(:query IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.cuisineType) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.city) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:cuisine IS NULL OR LOWER(r.cuisineType) = LOWER(:cuisine)) AND " +
           "(:openOnly IS NULL OR r.isOpen = :openOnly)")
    List<Restaurant> searchRestaurants(@Param("query") String query, 
                                       @Param("cuisine") String cuisine, 
                                       @Param("openOnly") Boolean openOnly);
}
