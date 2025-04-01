package capstone.backend.domain.auth.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class RefreshTokenExpiredException extends ApiException {

    public RefreshTokenExpiredException() {
      super(HttpStatus.FORBIDDEN, "Refresh token이 만료되었습니다.");
    }
}
