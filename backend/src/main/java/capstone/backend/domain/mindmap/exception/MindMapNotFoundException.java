package capstone.backend.domain.mindmap.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class MindMapNotFoundException extends ApiException {

    public MindMapNotFoundException() {
        super(HttpStatus.NOT_FOUND, "MindMap을 찾을 수 없습니다");
    }

    public MindMapNotFoundException(Long id) {
        super(HttpStatus.NOT_FOUND, "MindMap을 찾을 수 없습니다: ID: " + id);
    }
}
