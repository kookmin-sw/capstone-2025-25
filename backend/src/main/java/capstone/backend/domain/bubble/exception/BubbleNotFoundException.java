package capstone.backend.domain.bubble.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class BubbleNotFoundException extends ApiException {
    public BubbleNotFoundException() {
        super(HttpStatus.NOT_FOUND, "버블을 찾을 수 없습니다.");
    }
}
