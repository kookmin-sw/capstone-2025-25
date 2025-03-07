package capstone.backend.global.redis.batch;

import capstone.backend.global.redis.batch.MindMapSubscriber;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;

import java.util.concurrent.Executors;

@Configuration
public class RedisPubSubConfig {

    @Bean
    public RedisMessageListenerContainer redisContainer(
            RedisConnectionFactory connectionFactory,
            MessageListenerAdapter listenerAdapter) {

        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(listenerAdapter, new PatternTopic("mindmap-processing"));

        // ✅ 멀티스레드로 처리할 수 있도록 TaskExecutor 설정
        container.setTaskExecutor(Executors.newFixedThreadPool(5));

        return container;
    }

    @Bean
    public MessageListenerAdapter listenerAdapter(MindMapSubscriber subscriber) {
        return new MessageListenerAdapter(subscriber, "receiveMessage");
    }
}
