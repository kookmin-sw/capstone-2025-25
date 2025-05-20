package capstone.backend.global.api.webflux;

import capstone.backend.domain.bubble.dto.response.GPTErrorResponse;
import capstone.backend.global.api.exception.ApiException;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;
import reactor.util.retry.Retry;

@Configuration
public class WebFluxConfig {

    @Value("${url.base.model}")
    private String gptServerDomain;

    @Bean
    public WebClient webClient() {
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
                .responseTimeout(Duration.ofMinutes(1))
                .doOnConnected(conn ->
                        conn.addHandlerLast(new ReadTimeoutHandler(5))
                                .addHandlerLast(new WriteTimeoutHandler(5))
                );

        return WebClient.builder()
                .baseUrl(gptServerDomain)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .filter((request, next) -> next.exchange(request)
                        .flatMap(response -> {
                            if (response.statusCode().isError()) {
                                HttpStatus status = (HttpStatus) response.statusCode();
                                return response.bodyToMono(GPTErrorResponse.class)
                                        .map(GPTErrorResponse::detail)
                                        .defaultIfEmpty("알 수 없는 오류가 발생했습니다.")
                                        .flatMap(detail -> Mono.error(new ApiException(status, detail)));
                            }
                            return Mono.just(response);
                        })
                        .retryWhen(Retry.fixedDelay(1, Duration.ofMillis(100))
                                .filter(e -> !(e instanceof ApiException))  // ApiException이면 재시도하지 않음
                        )
                ).build();
    }
}
