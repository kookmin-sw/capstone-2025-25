package capstone.backend.global.api.webflux;

import capstone.backend.global.api.exception.ApiException;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;
import reactor.util.retry.Retry;

import java.time.Duration;

@Configuration
public class WebFluxConfig {

    @Value("${url.base.model}")
    private String gptServerDomain;

    @Bean
    public WebClient.Builder webClientBuilder() {
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000) // 5초 동안 연결 안 되면 실패
                .responseTimeout(Duration.ofMinutes(1))             // 1분 동안 응답 안올 시 에러
                .doOnConnected(conn ->
                        conn.addHandlerLast(new ReadTimeoutHandler(5))  // 읽기 타임아웃 5초
                                .addHandlerLast(new WriteTimeoutHandler(5)) // 쓰기 타임아웃 5초
                );

        // API 요청 결과 에러 핸들링
        return WebClient.builder()
                .baseUrl(gptServerDomain)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .filter((request, next) -> next.exchange(request)
                        .flatMap(response -> {
                            if (response.statusCode().isError()) {
                                HttpStatus status = (HttpStatus) response.statusCode();
                                return response.bodyToMono(String.class)
                                        .flatMap(body -> Mono.error(new ApiException(status, "API Error: " + body)));
                            }
                            return Mono.just(response);
                        })
                        .retryWhen(
                                Retry.fixedDelay(1, Duration.ofSeconds(2)) // 실패하면 2초 간격으로 한 번 더 재시도
                                        .filter(throwable ->
                                                throwable instanceof ApiException ||
                                                throwable instanceof java.util.concurrent.TimeoutException
                                        )
                        )
                );
    }
}
