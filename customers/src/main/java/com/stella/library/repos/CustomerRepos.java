package com.stella.library.repos;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.stella.library.entities.Customer;

@Repository
public interface CustomerRepos extends MongoRepository<Customer, Integer> {
	
	
}