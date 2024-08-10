package com.example.springbootreactlol.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Log4j2
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        log.info("Request URI: " + path);

        if (path.startsWith("/public/") || path.startsWith("/api/auth/") || path.startsWith("/ws/")) {
            log.info("Public Request: Skipping JWT authentication");
            chain.doFilter(request, response);
            return;
        }

        final String authorizationHeader = request.getHeader("Authorization");
        log.info("Authorization Header: " + authorizationHeader);

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            log.info("Extracted JWT: " + jwt);
            try {
                username = jwtUtil.extractUsername(jwt);
                log.info("Extracted username: " + username);
            } catch (Exception e) {
                log.error("Error extracting username from JWT", e);
            }
        } else {
            log.warn("Authorization header is null or doesn't start with 'Bearer '");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                log.info("Loaded UserDetails for username: {}", username);
                log.info("User Authorities: {}", userDetails.getAuthorities());

                if (jwtUtil.validateToken(jwt, userDetails)) {
                    Claims claims = jwtUtil.extractAllClaims(jwt);
                    log.info("JWT Claims: {}", claims);

                    String tokenRole = claims.get("role", String.class);
                    boolean hasMatchingAuthority = userDetails.getAuthorities().stream()
                            .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + tokenRole));
                    log.info("Token Role: {}, Matching Authority Found: {}", tokenRole, hasMatchingAuthority);

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.info("Authentication set in SecurityContext for user: {}", username);

                    Authentication setAuth = SecurityContextHolder.getContext().getAuthentication();
                    log.info("Set Authentication Authorities: {}", setAuth.getAuthorities());
                } else {
                    log.warn("Token validation failed for user: {}", username);
                }
            } catch (Exception e) {
                log.error("Error processing authentication", e);
            }
        }

        chain.doFilter(request, response);
    }
}
