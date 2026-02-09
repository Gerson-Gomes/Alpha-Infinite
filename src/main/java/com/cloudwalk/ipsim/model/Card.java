package com.cloudwalk.ipsim.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "cards")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String pan; // Primary Account Number (should be masked in real prod, keeping raw for sim or
                        // masked?)

    @Column(nullable = false)
    private String holderName;

    @Column(nullable = false)
    private String expiryDate; // MM/YY

    // In a real application, never store CVV.
    // For this simulator, we might not persist it, just use in DTO.
    // But if we need to validate later, we can keep it transient or not field at
    // all.
    // I will exclude CVV from here to follow "simplified PCI-DSS".

    public Card() {
    }

    public Card(String pan, String holderName, String expiryDate) {
        this.pan = pan;
        this.holderName = holderName;
        this.expiryDate = expiryDate;
    }

    public UUID getId() {
        return id;
    }

    public String getPan() {
        return pan;
    }

    public void setPan(String pan) {
        this.pan = pan;
    }

    public String getHolderName() {
        return holderName;
    }

    public void setHolderName(String holderName) {
        this.holderName = holderName;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }
}
