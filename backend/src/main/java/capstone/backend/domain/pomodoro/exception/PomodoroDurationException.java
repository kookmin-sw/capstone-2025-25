package capstone.backend.domain.pomodoro.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class PomodoroDurationException extends ApiException {
    public PomodoroDurationException() {
        super(HttpStatus.BAD_REQUEST, "유효하지 않은 입력값입니다.");
    }
}
