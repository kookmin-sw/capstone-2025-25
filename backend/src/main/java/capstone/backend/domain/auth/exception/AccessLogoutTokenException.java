package capstone.backend.domain.auth.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class AccessLogoutTokenException extends ApiException {

    public AccessLogoutTokenException() {
        super(HttpStatus.UNAUTHORIZED, "로그아웃된 토큰입니다.");
    }
}

