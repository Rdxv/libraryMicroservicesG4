package com.stella;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.stella.library.model.Customer;
import com.stella.library.repository.CustomerRepository;

import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
@TestPropertySource(locations="classpath:application-test.properties")
@DirtiesContext(classMode = ClassMode.AFTER_EACH_TEST_METHOD)
public class CustomerRepositoryUnitTest {
	
	@Autowired
    private CustomerRepository CustomerRepo;
	
	@Test
    public void testEmptyDB(){
		
        assertEquals(0,CustomerRepo.findAll().size());
    }
	
	@Test
    public void testAddOneCustomer(){
		
        Customer customer = new Customer("Simone", "Stella", "0123456678");
        
        //customer.setName("Simone");
        //customer.setSurname("Stella");
        //customer.setId(1);
        //customer.setphoneNumber("0123456678");
        
        CustomerRepo.save(customer);
        
        assertEquals(1,CustomerRepo.findAll().size()  );
    }
}