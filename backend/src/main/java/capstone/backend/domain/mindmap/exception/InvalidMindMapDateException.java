package capstone.backend.domain.mindmap.exception;

import capstone.backend.global.api.exception.ApiException;
import java.time.LocalDate;
import org.springframework.http.HttpStatus;

public class InvalidMindMapDateException extends ApiException {
    public InvalidMindMapDateException(Long id, LocalDate date) {
        super(HttpStatus.BAD_REQUEST, "마인드맵 날짜와 요청된 날짜가 다릅니다. ID: " + id + " 날짜: " + date);
    }

}
