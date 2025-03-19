package capstone.backend.domain.auth.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class TokenNotFoundException extends ApiException {
    public TokenNotFoundException() {
        super(HttpStatus.BAD_REQUEST, "토큰이 존재하지 않습니다.");
    }
}
