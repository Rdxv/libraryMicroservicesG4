package com.stella;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.stella.library.controller.CustomerController;
import com.stella.library.repository.CustomerRepository;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;

@RunWith(SpringRunner.class)
@WebMvcTest(CustomerController.class)
@AutoConfigureMockMvc
@DirtiesContext(classMode = ClassMode.AFTER_EACH_TEST_METHOD)

public class CustomerControllerUnitTest {
	
	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	CustomerRepository repos;
	
	@Test
	public void testGetAllCustomers() {
		
		try {
			
			mockMvc.perform(MockMvcRequestBuilders
					.get("/customer")
					.accept(MediaType.APPLICATION_JSON))
					.andExpect(status().isOk());
		} catch (JsonProcessingException e) {
			
			e.printStackTrace();
		} catch (Exception e) {
			
			e.printStackTrace();
		}
	}
}