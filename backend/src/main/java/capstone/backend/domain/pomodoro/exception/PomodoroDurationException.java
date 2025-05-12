package capstone.backend.domain.pomodoro.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class PomodoroDurationException extends ApiException {
    public PomodoroDurationException() {
        super(HttpStatus.BAD_REQUEST, "1분 이상의 기록만 완료 가능합니다.");
    }
}
