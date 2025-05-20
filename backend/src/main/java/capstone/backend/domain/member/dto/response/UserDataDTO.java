package capstone.backend.domain.member.dto.response;

import capstone.backend.domain.member.entity.Member;

public record UserDataDTO(
        String email,
        String username
) {
    public UserDataDTO(Member member) {
        this(
                member.getEmail(),
                member.getUsername()
        );
    }
}
