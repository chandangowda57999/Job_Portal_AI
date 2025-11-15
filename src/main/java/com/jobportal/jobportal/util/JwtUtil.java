package com.jobportal.jobportal.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JWT Utility Class
 * Handles JWT token generation, validation, and extraction
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    /**
     * Gets the signing key from the secret
     * 
     * @return SecretKey for signing JWT tokens
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Extracts username (email) from token
     * 
     * @param token JWT token
     * @return Username (email) from token
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts expiration date from token
     * 
     * @param token JWT token
     * @return Expiration date
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extracts a specific claim from token
     * 
     * @param token JWT token
     * @param claimsResolver Function to extract the claim
     * @return The extracted claim
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extracts all claims from token
     * 
     * @param token JWT token
     * @return All claims from the token
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Checks if token is expired
     * 
     * @param token JWT token
     * @return true if token is expired, false otherwise
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Generates JWT token with custom claims
     * 
     * @param username Username (email) of the user
     * @param userId User ID
     * @param userType Type of user (candidate, employer, admin)
     * @return Generated JWT token
     */
    public String generateToken(String username, Long userId, String userType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("userType", userType);
        return createToken(claims, username);
    }

    /**
     * Generates JWT token using only the secret (no user information).
     * Used for API token generation based solely on secret validation.
     * 
     * @return Generated JWT token
     */
    public String generateTokenFromSecret() {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, "api");
    }

    /**
     * Creates JWT token with claims and subject
     * 
     * @param claims Custom claims to include in token
     * @param subject Subject (username/email) of the token
     * @return Generated JWT token
     */
    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Validates JWT token by checking expiration and format
     * 
     * @param token JWT token to validate
     * @return true if token is valid, false otherwise
     */
    public Boolean validateToken(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Extracts user type from token
     * 
     * @param token JWT token
     * @return User type from token, or null if not present
     */
    public String extractUserType(String token) {
        try {
            Claims claims = extractAllClaims(token);
            Object userType = claims.get("userType");
            return userType != null ? userType.toString() : null;
        } catch (Exception e) {
            return null;
        }
    }
}

