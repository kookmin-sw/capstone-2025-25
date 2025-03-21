package capstone.backend.mindmap.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class MindMapNotFoundException extends ApiException {

    public MindMapNotFoundException() {
        super(HttpStatus.NOT_FOUND, "MindMap을 찾을 수 없습니다");
    }

}
