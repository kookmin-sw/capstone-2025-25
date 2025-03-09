package capstone.backend.global.api.dto;

import org.springframework.http.HttpStatus;

import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public class ApiResponse<T> {

    private final int statusCode;
    private final String error;
    private final T content;

    public static ApiResponse<Void> ok() {

        return new ApiResponse<>(200, null, null);
    }

    public static <T> ApiResponse<T> ok(T content) {

        return new ApiResponse<>(200, null, content);
    }

    public static <T> ApiResponse<T> error(HttpStatus status, String error) {

        return new ApiResponse<>(status.value(), error, null);
    }
}