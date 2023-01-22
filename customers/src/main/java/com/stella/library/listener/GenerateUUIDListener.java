package com.stella.library.listener;

import com.fasterxml.uuid.Generators;

import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;

import com.stella.library.model.Customer;

@Component
public class GenerateUUIDListener extends AbstractMongoEventListener<Customer> {
 
    @Override
    public void onBeforeConvert(BeforeConvertEvent<Customer> event) {
        Customer customer = event.getSource();
        if (customer.getId() == null) {
            customer.setId(Generators.timeBasedGenerator().generate().toString());
        }
    }
 
}