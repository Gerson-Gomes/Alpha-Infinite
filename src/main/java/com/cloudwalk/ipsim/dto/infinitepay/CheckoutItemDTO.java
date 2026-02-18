package com.cloudwalk.ipsim.dto.infinitepay;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a single item in the InfinitePay checkout
 *
 * InfinitePay requires at least one item with:
 * - quantity (number of units)
 * - price (in cents, e.g., R$ 10.00 = 1000)
 * - description (what is being sold)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutItemDTO {

    /**
     * Number of units of this item
     * Example: 2
     */
    private Integer quantity;

    /**
     * Price per unit in cents
     * Example: 1500 = R$ 15.00
     */
    private Long price;

    /**
     * Human-readable description of the item
     * Example: "Premium Subscription - Monthly"
     */
    private String description;
}
