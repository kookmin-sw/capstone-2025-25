package capstone.backend.domain.auth.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class AccessTokenExpiredException extends ApiException {

    public AccessTokenExpiredException() {
        super(HttpStatus.UNAUTHORIZED, "Access Token이 만료되었습니다.");
    }
}