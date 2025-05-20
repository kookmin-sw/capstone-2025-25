package capstone.backend.domain.member.entity;

import lombok.Getter;

@Getter
public enum Role {
    USER,
    ADMIN
    ;

    @Override
    public String toString() {
        return "ROLE_" + super.toString();
    }
}
