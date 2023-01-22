package com.stella.library;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

import com.stella.library.listener.GenerateUUIDListener;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class LibraryApplication {

	public static void main(String[] args) {
		SpringApplication springApplication = new SpringApplication(LibraryApplication.class);
		springApplication.addListeners(new GenerateUUIDListener());
		springApplication.run(args);
	}

}