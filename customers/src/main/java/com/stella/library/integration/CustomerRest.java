package com.stella.library.integration;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.stella.library.entities.Customer;
import com.stella.library.service.CustomerService;

import java.util.logging.*;

@RestController
public class CustomerRest {
	
	Logger logger = Logger.getLogger(CustomerRest.class.getName());
	
	@Autowired
	private CustomerService customerservice;
	
	@GetMapping("customer")
	public List<Customer> getAll() {
		
		logger.info("Get all customers");
		
		return customerservice.getAll();
	}
	
	@GetMapping("customer/{id}")
	public Customer getOne(@PathVariable int id) {
		
		logger.info("Get id customer");
		
		return customerservice.getCustomer(id);
	}
	
	@PostMapping("customer")
	public void addCustomer(@RequestBody Customer c) {
		
		logger.info("New customer");
		
		customerservice.addCostumer(c);
	}
	
	@PutMapping("customer/{id}")
	public void updateCustomer(@RequestBody Customer c) {
		
		logger.info("Update id customer");
		
		customerservice.updateCustomer(c);
	}
	
	@DeleteMapping("customer/{id}")
	public void deleteCustomer(@PathVariable int id) {
		
		logger.info("Delete id customer");
		
		customerservice.deleteCustomer(id);
	}
}