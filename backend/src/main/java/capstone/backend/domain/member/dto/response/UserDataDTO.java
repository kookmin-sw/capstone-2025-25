package capstone.backend.domain.member.dto.response;

import capstone.backend.domain.member.scheme.Member;

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
