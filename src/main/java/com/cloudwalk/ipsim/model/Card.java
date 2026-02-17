package com.cloudwalk.ipsim.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "cards")
@Getter
@Setter
@NoArgsConstructor
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String pan; // Primary Account Number

    @Column(nullable = false)
    private String holderName;

    @Column(nullable = false)
    private String expiryDate; // MM/YY

    // In a real application, never store CVV.
    // For this simulator, we might not persist it, just use in DTO.
    // Excluded from here to follow "simplified PCI-DSS".

    public Card(String pan, String holderName, String expiryDate) {
        this.pan = pan;
        this.holderName = holderName;
        this.expiryDate = expiryDate;
    }
}
