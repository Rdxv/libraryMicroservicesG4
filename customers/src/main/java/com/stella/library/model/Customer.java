package com.stella.library.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "tutorials")
public class Customer {
	
	// Properties

	@Id
	private String id;

	private String name;

	private String surname;

	private String phoneNumber;
    
    

    // Constructor
    
    public Customer (String name, String surname, String phoneNumber) {
        
        this.name = name;
		this.surname = surname;
		this.phoneNumber = phoneNumber;
        
	}


    
	// Methods
	
	public String getId() {
		
		return id;
	}
	
	public void setId(String id) {
		
		this.id = id;
	}
	
	public String getName() {
		
		return name;
	}
	
	public void setName(String name) {
		
		this.name = name;
	}
	
	public String getSurname() {
		
		return surname;
	}
	
	public void setSurname(String surname) {
		
		this.surname = surname;
	}
	
	public String getPhoneNumber() {
		
		return phoneNumber;
	}
	
	public void setPhoneNumber(String phoneNumber) {
		
		this.phoneNumber = phoneNumber;
	}
}