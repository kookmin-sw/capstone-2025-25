package capstone.backend.domain.eisenhower.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class MindMapNotLinkedToEisenhowerException extends ApiException {
    public MindMapNotLinkedToEisenhowerException() {
        super(HttpStatus.NOT_FOUND, "연결된 아이젠하워가 없습니다.");
    }
}
