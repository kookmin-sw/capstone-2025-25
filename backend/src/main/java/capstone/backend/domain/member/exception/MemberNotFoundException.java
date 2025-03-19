package capstone.backend.domain.member.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class MemberNotFoundException extends ApiException {
    public MemberNotFoundException() {
        super(HttpStatus.NOT_FOUND, "유저 정보를 찾을 수 없습니다.");
    }
}
