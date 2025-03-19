package capstone.backend.global.log;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingResponseWrapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class LoggerFilter extends OncePerRequestFilter {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void doFilterInternal(
            @Nonnull HttpServletRequest request,
            @Nonnull HttpServletResponse response,
            @Nonnull FilterChain filterChain
    ) throws ServletException, IOException {

        long start = System.currentTimeMillis();

        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(response);
        wrappedResponse.setCharacterEncoding(StandardCharsets.UTF_8.name());

        filterChain.doFilter(request, wrappedResponse);

        long end = System.currentTimeMillis();
        long elapsed = end - start;

        ResponseInfo responseInfo = getResponseInfo(wrappedResponse);

        log.info("{} {} {} {}ms {}{}",
                request.getMethod(),
                request.getRequestURI(),
                getIp(request),
                elapsed,
                responseInfo.statusCode(),
                responseInfo.error() == null ? "" : " - %s".formatted(responseInfo.error())
        );

        wrappedResponse.copyBodyToResponse(); // 응답을 원본에 복사
    }

    private ResponseInfo getResponseInfo(ContentCachingResponseWrapper response) {
        try {
            String responseBody = new String(response.getContentAsByteArray(), response.getCharacterEncoding());
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            int statusCode = jsonNode.has("statusCode") ? jsonNode.get("statusCode").asInt() : response.getStatus();
            String error = jsonNode.has("error") && !jsonNode.get("error").isNull() ? jsonNode.get("error").asText() : null;

            return new ResponseInfo(statusCode, error);
        } catch (Exception e) {
            log.warn("Failed to parse response body", e);
            return new ResponseInfo(response.getStatus(), null);
        }
    }

    private String getIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        return (xfHeader == null) ? request.getRemoteAddr() : xfHeader.split(",")[0];
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return "/api/actuator/prometheus".equals(request.getRequestURI());
    }

    private record ResponseInfo(int statusCode, String error) {}
}
