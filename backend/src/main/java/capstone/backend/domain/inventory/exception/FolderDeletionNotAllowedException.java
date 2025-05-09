package capstone.backend.domain.inventory.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class FolderDeletionNotAllowedException extends ApiException {
    public FolderDeletionNotAllowedException() {super(HttpStatus.FORBIDDEN, "기본 폴더는 삭제할 수 없습니다.");}
}
