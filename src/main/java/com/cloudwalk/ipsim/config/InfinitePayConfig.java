package com.cloudwalk.ipsim.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Configuration for InfinitePay Checkout API Integration
 *
 * This class provides:
 * - WebClient bean configured for InfinitePay API calls
 * - Configuration properties for API endpoints and credentials
 * - Centralized HTTP client setup with proper headers
 */
@Configuration
public class InfinitePayConfig {

    /**
     * Your InfinitePay handle/username (without the $ symbol)
     * Example: If your InfiniteTag is $joaosilva, use "joaosilva"
     *
     * Set in application.properties as:
     * infinitepay.handle=your_test_handle
     */
    @Value("${infinitepay.handle}")
    private String handle;

    /**
     * Base URL for InfinitePay API
     * Default: https://api.infinitepay.io
     *
     * Set in application.properties as:
     * infinitepay.api.base-url=https://api.infinitepay.io
     */
    @Value("${infinitepay.api.base-url:https://api.infinitepay.io}")
    private String apiBaseUrl;

    /**
     * Your public webhook URL (exposed via ngrok during development)
     * This is where InfinitePay will send payment notifications
     *
     * Set in application.properties as:
     * infinitepay.webhook.base-url=https://your-id.ngrok.io
     */
    @Value("${infinitepay.webhook.base-url}")
    private String webhookBaseUrl;

    /**
     * Creates a WebClient bean configured for InfinitePay API calls
     *
     * WebClient is Spring's reactive HTTP client (replacement for RestTemplate)
     * It provides:
     * - Non-blocking I/O
     * - Fluent API for building requests
     * - Better error handling
     *
     * @return Configured WebClient instance
     */
    @Bean
    public WebClient infinitePayWebClient() {
        return WebClient.builder()
                .baseUrl(apiBaseUrl)
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("Accept", "application/json")
                // Add any authentication headers if InfinitePay requires them
                // .defaultHeader("Authorization", "Bearer " + apiToken)
                .build();
    }

    // Getters for injecting configuration values into services

    public String getHandle() {
        return handle;
    }

    public String getApiBaseUrl() {
        return apiBaseUrl;
    }

    public String getWebhookBaseUrl() {
        return webhookBaseUrl;
    }

    /**
     * Constructs the full webhook URL that will be sent to InfinitePay
     *
     * @return Complete webhook endpoint URL
     */
    public String getWebhookUrl() {
        return webhookBaseUrl + "/api/webhooks/infinitepay";
    }
}
