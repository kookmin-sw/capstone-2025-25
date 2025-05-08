package capstone.backend.domain.todayTask.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class TodayTaskNotFoundException extends ApiException {
    public TodayTaskNotFoundException() {super(HttpStatus.NOT_FOUND, "오늘의 할 일을 찾을 수 없습니다.");}
}
