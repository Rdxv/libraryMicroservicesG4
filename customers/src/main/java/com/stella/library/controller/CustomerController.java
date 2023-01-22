package com.stella.library.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stella.library.model.Customer;
import com.stella.library.repository.CustomerRepository;;



//@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api")
public class CustomerController {

  @Autowired
  CustomerRepository CustomerRepository;

  @GetMapping("/customers")
  public ResponseEntity<List<Customer>> getAllCustomers(@RequestParam(required = false) String name) {
    try {
      List<Customer> Customers = new ArrayList<Customer>();
  
      if (name == null)
        CustomerRepository.findAll().forEach(Customers::add);
      else
        CustomerRepository.findByNameContaining(name).forEach(Customers::add);
  
      // if (Customers.isEmpty()) {
      //   return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      // }
  
      return new ResponseEntity<>(Customers, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/customers/{id}")
  public ResponseEntity<Customer> getCustomerById(@PathVariable("id") String id) {
    Optional<Customer> CustomerData = CustomerRepository.findById(id);

    if (CustomerData.isPresent()) {
      return new ResponseEntity<>(CustomerData.get(), HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @PostMapping("/customers")
  public ResponseEntity<Customer> createCustomer(@RequestBody Customer Customer) {
    try {
      Customer _Customer = CustomerRepository.save(new Customer(Customer.getName(), Customer.getSurname(), Customer.getPhoneNumber()));
      return new ResponseEntity<>(_Customer, HttpStatus.CREATED);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PutMapping("/customers/{id}")
  public ResponseEntity<Customer> updateCustomer(@PathVariable("id") String id, @RequestBody Customer Customer) {
    Optional<Customer> CustomerData = CustomerRepository.findById(id);

    if (CustomerData.isPresent()) {
      Customer _Customer = CustomerData.get();
      _Customer.setName(Customer.getName());
      _Customer.setSurname(Customer.getSurname());
      _Customer.setPhoneNumber(Customer.getPhoneNumber());
      return new ResponseEntity<>(CustomerRepository.save(_Customer), HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @DeleteMapping("/customers/{id}")
  public ResponseEntity<HttpStatus> deleteCustomer(@PathVariable("id") String id) {
    try {
      CustomerRepository.deleteById(id);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}