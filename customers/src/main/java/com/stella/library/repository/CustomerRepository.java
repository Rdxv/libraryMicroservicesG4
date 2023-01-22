package com.stella.library.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.stella.library.model.Customer;

import java.util.List;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {
    
    List<Customer> findByNameContaining(String name);
    List<Customer> findBySurnameContaining(String surname);
    List<Customer> findByPhoneNumberContaining(String phoneNumber);
    
}