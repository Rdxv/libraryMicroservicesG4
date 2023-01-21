package com.stella;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.stella.library.entities.Customer;
import com.stella.library.repos.CustomerRepos;

import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
@TestPropertySource(locations="classpath:application-test.properties")
@DirtiesContext(classMode = ClassMode.AFTER_EACH_TEST_METHOD)
public class CustomerRepositoryUnitTest {
	
	@Autowired
    private CustomerRepos customerRepos;
	
	@Test
    public void testEmptyDB(){
		
        assertEquals(0,customerRepos.findAll().size());
    }
	
	@Test
    public void testAddOneCustomer(){
		
        Customer customer = new Customer();
        
        customer.setName("Simone");
        customer.setSurname("Stella");
        customer.setId(1);
        customer.setNumberPhone("0123456678");
        
        customerRepos.save(customer);
        
        assertEquals(1,customerRepos.findAll().size()  );
    }
}