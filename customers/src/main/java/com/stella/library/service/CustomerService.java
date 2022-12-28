package com.stella.library.service;

import java.util.List;

import com.stella.library.entities.Customer;

public interface CustomerService {
	
	void addCostumer (Customer c);
	List<Customer> getAll();
	Customer getCustomer(int id);
	void updateCustomer(Customer c);
	void deleteCustomer(int id);
}