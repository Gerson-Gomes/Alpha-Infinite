package com.cloudwalk.ipsim.controller;

import com.cloudwalk.ipsim.dto.PaymentRequestDTO;
import com.cloudwalk.ipsim.dto.TransactionResponseDTO;
import com.cloudwalk.ipsim.model.Card;
import com.cloudwalk.ipsim.model.Transaction;
import com.cloudwalk.ipsim.model.TransactionStatus;
import com.cloudwalk.ipsim.repository.TransactionRepository;
import com.cloudwalk.ipsim.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*") // Allow frontend to call
@RequiredArgsConstructor
public class TransactionController {

    private final PaymentService paymentService;
    private final TransactionRepository transactionRepository;

    @PostMapping
    public ResponseEntity<TransactionResponseDTO> processPayment(@Valid @RequestBody PaymentRequestDTO request) {
        // Map DTO to Entity
        Transaction transaction = new Transaction();
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setInstallments(request.getInstallments());

        // Create Card (Transient or Persistent - Logic here simplified)
        Card card = new Card(request.getCardNumber(), request.getCardHolder(), request.getCardExpiry());
        transaction.setCard(card);

        // Process
        Transaction processed = paymentService.processPayment(transaction);

        // Map Response
        TransactionResponseDTO response = new TransactionResponseDTO(
                processed.getId(),
                processed.getAmount(),
                processed.getNetAmount(),
                processed.getStatus(),
                processed.getTimestamp(),
                processed.getStatus() == TransactionStatus.APPROVED ? "Transaction approved successfully"
                        : "Transaction denied");

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponseDTO>> getAllTransactions() {
        List<TransactionResponseDTO> list = transactionRepository.findAll().stream()
                .map(t -> new TransactionResponseDTO(
                        t.getId(),
                        t.getAmount(),
                        t.getNetAmount(),
                        t.getStatus(),
                        t.getTimestamp(),
                        ""))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }
}
