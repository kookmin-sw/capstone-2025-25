package capstone.backend.domain.mindmap.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class EisenhowerNotFoundException extends ApiException {
    public EisenhowerNotFoundException() {
        super(HttpStatus.NOT_FOUND, "아이젠하워를 찾을 수 없습니다.");
    }

}
