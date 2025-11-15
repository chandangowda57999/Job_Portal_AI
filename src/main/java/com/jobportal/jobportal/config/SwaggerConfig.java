package com.jobportal.jobportal.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration for Swagger UI and OpenAPI documentation.
 * Configures JWT authentication for Swagger UI.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@Configuration
public class SwaggerConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Redirect /swagger-ui.html to /swagger-ui/index.html
        registry.addRedirectViewController("/swagger-ui.html", "/swagger-ui/index.html");
    }

    /**
     * Configures OpenAPI with JWT security scheme.
     * This enables the "Authorize" button in Swagger UI.
     * 
     * @return OpenAPI configuration
     */
    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "JWT";
        
        return new OpenAPI()
                .info(new Info()
                        .title("Job Portal API")
                        .version("1.0")
                        .description("REST API for Job Portal Application. " +
                                "Get JWT token from /api/auth/token endpoint using your JWT secret.")
                        .contact(new Contact()
                                .name("Job Portal Team")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT token. Get token from /api/auth/token endpoint. " +
                                                "Enter the token value (without 'Bearer' prefix) in the authorization dialog.")));
    }
}

