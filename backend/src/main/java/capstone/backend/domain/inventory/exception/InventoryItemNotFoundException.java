package capstone.backend.domain.inventory.exception;

import capstone.backend.global.api.exception.ApiException;
import org.springframework.http.HttpStatus;

public class InventoryItemNotFoundException extends ApiException {
    public InventoryItemNotFoundException(){ super(HttpStatus.NOT_FOUND, "보관함 아이템을 찾을 수 없습니다."); }

}
