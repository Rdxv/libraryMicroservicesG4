package com.stella.library;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.Bean;

import com.stella.library.filter.CorrelationIdFilter;
import com.stella.library.listener.GenerateUUIDListener;

import jakarta.servlet.http.HttpFilter;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class LibraryApplication {

	@Bean
    public HttpFilter securityFilter() {
        return new CorrelationIdFilter();
    }

	public static void main(String[] args) {
		SpringApplication springApplication = new SpringApplication(LibraryApplication.class);
		springApplication.addListeners(new GenerateUUIDListener());
		springApplication.run(args);
	}

}