package capstone.backend.domain.pomodoro.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class PomodoroNotFoundException extends ApiException {
    public PomodoroNotFoundException() {
        super(HttpStatus.NOT_FOUND, "뽀모도로를 찾을 수 없습니다.");
    }

}
