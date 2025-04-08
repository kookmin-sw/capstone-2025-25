package capstone.backend.domain.eisenhower.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class EisenhowerItemNotFoundException extends ApiException {

    public EisenhowerItemNotFoundException() {
        super(HttpStatus.NOT_FOUND, "해당 사용자에 대한 아이젠하워 항목을 찾을 수 없습니다.");
    }

}
