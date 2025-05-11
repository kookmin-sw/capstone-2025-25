package capstone.backend.domain.auth.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class TokenNotFoundException extends ApiException {

    public TokenNotFoundException() {
        super(HttpStatus.UNAUTHORIZED, "발급한 Token이 없습니다.");
    }
}
