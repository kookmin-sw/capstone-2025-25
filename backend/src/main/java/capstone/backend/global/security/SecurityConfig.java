package capstone.backend.global.security;

import capstone.backend.global.security.jwt.JwtAuthenticationFilter;
import capstone.backend.global.security.oauth2.handler.OAuth2AuthenticationFailureHandler;
import capstone.backend.global.security.oauth2.handler.OAuth2AuthenticationSuccessHandler;
import capstone.backend.global.security.oauth2.service.OAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // UsernamePasswordAuthenticationFilter 추가
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final OAuth2UserService oauth2UserService;
    private final OAuth2AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler;
    private final OAuth2AuthenticationFailureHandler oauth2AuthenticationFailureHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private static final String[] SWAGGER_ENDPOINTS = { "/swagger", "/swagger-ui/**", "/api-docs/**", "/v3/api-docs/**" };
    private static final String[] PUBLIC_ENDPOINTS = { "/" };


    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() { // security를 적용하지 않을 리소스
        return web -> web.ignoring()
                .requestMatchers("/error", "/favicon.ico");
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers(SWAGGER_ENDPOINTS).permitAll()
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfoEndpointConfig
                                -> userInfoEndpointConfig.userService(oauth2UserService))
                        .successHandler(oauth2AuthenticationSuccessHandler)
                        .failureHandler(oauth2AuthenticationFailureHandler)
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    // CORS 설정.
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.addAllowedHeader("*");
        configuration.setAllowedMethods(List.of("GET", "POST", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowCredentials(true);
        configuration.addExposedHeader("Authorization"); // Access-Control-Expose-Headers 사용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}