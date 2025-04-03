package capstone.backend.domain.eisenhower.controller;

import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemCreateRequest;
import capstone.backend.domain.eisenhower.dto.response.EisenhowerItemResponse;
import capstone.backend.domain.eisenhower.service.EisenhowerService;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/eisenhower")
@RequiredArgsConstructor
@Slf4j
public class EisenhowerController {

    private final EisenhowerService eisenhowerService;

    @PostMapping
    public ResponseEntity<EisenhowerItemResponse> createItem(
            @RequestBody @Valid EisenhowerItemCreateRequest request,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User
    ) {
        EisenhowerItemResponse response = eisenhowerService.createItem(request, customOAuth2User.getMemberId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
