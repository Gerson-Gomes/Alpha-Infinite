package com.cloudwalk.ipsim.repository;

import com.cloudwalk.ipsim.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    /**
     * Find transaction by internal order NSU
     *
     * Used by webhook controller to update transaction status
     * when InfinitePay sends payment notification
     *
     * @param orderNsu Your internal order identifier
     * @return Optional containing transaction if found
     */
    Optional<Transaction> findByOrderNsu(String orderNsu);
}
