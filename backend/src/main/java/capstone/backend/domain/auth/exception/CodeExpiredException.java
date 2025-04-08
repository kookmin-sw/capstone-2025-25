package capstone.backend.domain.auth.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class CodeExpiredException extends ApiException {

    public CodeExpiredException() {
        super(HttpStatus.NOT_FOUND, "임시 발급 토큰이 없거나 만료되었습니다.");
    }
}
