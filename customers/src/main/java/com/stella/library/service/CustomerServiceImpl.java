package com.stella.library.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.stella.library.entities.Customer;
import com.stella.library.repos.CustomerRepos;

@Service
public class CustomerServiceImpl implements CustomerService {
	
	private CustomerRepos customerRepos;
	
	@Override
	public void addCostumer(Customer c) {
		
		customerRepos.save(c);
	}
	
	@Override
	public List<Customer> getAll() {
		
		return customerRepos.findAll();
	}
	@Override
	public Customer getCustomer(int id) {
		
		return customerRepos.findById(id).get();
	}
	
	@Override
	public void updateCustomer(Customer c) {
		
		customerRepos.save(c);
	}
	
	@Override
	public void deleteCustomer(int id) {
		
		customerRepos.deleteById(id);
	}
}