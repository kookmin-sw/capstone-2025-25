package capstone.backend.domain.todayTask.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class DuplicateTaskException extends ApiException {
    public DuplicateTaskException() {
        super(HttpStatus.CONFLICT, "이미 오늘의 할 일에 등록된 아이젠하워입니다.");
    }
}
