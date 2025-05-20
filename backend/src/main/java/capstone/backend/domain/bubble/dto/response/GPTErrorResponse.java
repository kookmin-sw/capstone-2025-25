package capstone.backend.domain.bubble.dto.response;

public record GPTErrorResponse(
        int code,
        String message,
        String detail
) {
}
