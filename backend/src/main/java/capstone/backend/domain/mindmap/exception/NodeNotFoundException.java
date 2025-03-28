package capstone.backend.domain.mindmap.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class NodeNotFoundException extends ApiException {
    public NodeNotFoundException(Long id){
        super(HttpStatus.BAD_REQUEST, "해당 마인드맵: " + id + " 에는 노드가 1개도 존재하지 않습니다.");
    }

}
