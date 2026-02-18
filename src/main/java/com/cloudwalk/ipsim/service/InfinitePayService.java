package com.cloudwalk.ipsim.service;

import com.cloudwalk.ipsim.config.InfinitePayConfig;
import com.cloudwalk.ipsim.dto.infinitepay.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.UUID;

/**
 * Service for integrating with InfinitePay Checkout API
 *
 * Responsibilities:
 * 1. Create checkout payment links
 * 2. Check payment status
 * 3. Handle API errors and retries
 *
 * API Documentation: https://www.infinitepay.io/checkout
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class InfinitePayService {

    private final WebClient infinitePayWebClient;
    private final InfinitePayConfig config;

    /**
     * Creates a checkout link for a payment transaction
     *
     * Flow:
     * 1. Build checkout request with transaction details
     * 2. Call InfinitePay API to generate payment link
     * 3. Return checkout URL to be opened in browser
     *
     * @param amount Total amount in BigDecimal (e.g., 15.50 for R$ 15.50)
     * @param description Description of what's being purchased
     * @param orderNsu Your internal order identifier (for tracking)
     * @param customerName Optional customer name
     * @param customerEmail Optional customer email
     * @return InfinitePayCheckoutResponse containing the checkout URL
     * @throws RuntimeException if API call fails
     */
    public InfinitePayCheckoutResponse createCheckoutLink(
            BigDecimal amount,
            String description,
            String orderNsu,
            String customerName,
            String customerEmail) {

        log.info("Creating InfinitePay checkout link for order: {}, amount: {}", orderNsu, amount);

        // Convert BigDecimal amount to cents (Long)
        // R$ 15.50 -> 1550 cents
        Long amountInCents = amount.multiply(BigDecimal.valueOf(100)).longValue();

        // Build customer data if provided
        CustomerDTO customer = null;
        if (customerName != null && customerEmail != null) {
            customer = CustomerDTO.builder()
                    .name(customerName)
                    .email(customerEmail)
                    .build();
        }

        // Build checkout item
        CheckoutItemDTO item = CheckoutItemDTO.builder()
                .quantity(1)
                .price(amountInCents)
                .description(description)
                .build();

        // Build complete checkout request
        InfinitePayCheckoutRequest request = InfinitePayCheckoutRequest.builder()
                .handle(config.getHandle())
                .items(Collections.singletonList(item))
                .orderNsu(orderNsu)
                .webhookUrl(config.getWebhookUrl())
                // Optional: Add redirect URL if you want users to return to your app
                // .redirectUrl("http://localhost:8080/payment-complete")
                .customer(customer)
                .build();

        try {
            // Call InfinitePay API
            InfinitePayCheckoutResponse response = infinitePayWebClient
                    .post()
                    .uri("/invoices/public/checkout/links")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(InfinitePayCheckoutResponse.class)
                    .block(); // Blocking call (convert to async if needed)

            log.info("Checkout link created successfully: {}", response.getCheckoutUrl());
            return response;

        } catch (WebClientResponseException e) {
            log.error("InfinitePay API error: Status {}, Body: {}",
                    e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to create checkout link: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error creating checkout link", e);
            throw new RuntimeException("Failed to create checkout link", e);
        }
    }

    /**
     * Checks the payment status of a transaction
     *
     * Useful for:
     * - Polling payment status if webhooks fail
     * - Verifying payment before fulfillment
     * - Manual reconciliation
     *
     * @param orderNsu Your internal order identifier
     * @param slug InfinitePay invoice slug
     * @param transactionNsu InfinitePay transaction NSU
     * @return PaymentStatusCheckResponse with payment details
     */
    public PaymentStatusCheckResponse checkPaymentStatus(
            String orderNsu,
            String slug,
            String transactionNsu) {

        log.info("Checking payment status for order: {}", orderNsu);

        PaymentStatusCheckRequest request = PaymentStatusCheckRequest.builder()
                .handle(config.getHandle())
                .orderNsu(orderNsu)
                .slug(slug)
                .transactionNsu(transactionNsu)
                .build();

        try {
            PaymentStatusCheckResponse response = infinitePayWebClient
                    .post()
                    .uri("/invoices/public/checkout/payment_check")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(PaymentStatusCheckResponse.class)
                    .block();

            log.info("Payment status check completed. Paid: {}", response.getPaid());
            return response;

        } catch (WebClientResponseException e) {
            log.error("Error checking payment status: {}", e.getResponseBodyAsString());
            throw new RuntimeException("Failed to check payment status", e);
        }
    }

    /**
     * Generates a unique order NSU (internal tracking ID)
     *
     * Format: ORD-{timestamp}-{uuid-prefix}
     * Example: ORD-1708234567-a1b2c3
     *
     * @return Unique order identifier
     */
    public String generateOrderNsu() {
        String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
        String uuidPrefix = UUID.randomUUID().toString().substring(0, 6);
        return "ORD-" + timestamp + "-" + uuidPrefix;
    }
}
