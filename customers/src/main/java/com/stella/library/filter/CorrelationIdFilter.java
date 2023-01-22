package com.stella.library.filter;

import java.io.IOException;

import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CorrelationIdFilter extends HttpFilter {

    static final String CORRELATION_ID_HEADER_NAME = "X-Correlation-Id";

    private String getCorrelationIdFromHeader(HttpServletRequest req) {
        return req.getHeader(CORRELATION_ID_HEADER_NAME);
    }

    @Override
    public void doFilter(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
        final String correlationId = getCorrelationIdFromHeader(req);
        MDC.put(CORRELATION_ID_HEADER_NAME, correlationId);
        chain.doFilter(req, res);
    }

}

