package capstone.backend.domain.eisenhower.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class CategoryNotFoundException extends ApiException {
    public CategoryNotFoundException() {
        super(HttpStatus.NOT_FOUND, "카테고리를 찾을 수 없습니다.");
    }
}
