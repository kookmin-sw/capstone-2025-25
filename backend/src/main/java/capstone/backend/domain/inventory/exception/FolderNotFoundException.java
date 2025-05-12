package capstone.backend.domain.inventory.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class FolderNotFoundException extends ApiException {
    public FolderNotFoundException() {
        super(HttpStatus.NOT_FOUND, "폴더를 찾을 수 없습니다.");
    }
}
