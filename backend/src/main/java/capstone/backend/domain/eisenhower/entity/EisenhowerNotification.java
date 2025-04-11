package capstone.backend.domain.eisenhower.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class EisenhowerNotification {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private Long eisenhowerItemId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LocalDate dueDate;

    public static EisenhowerNotification of(EisenhowerItem item) {
        return EisenhowerNotification.builder()
                .memberId(item.getMember().getId())
                .eisenhowerItemId(item.getId())
                .title(item.getTitle())
                .dueDate(item.getDueDate())
                .build();
    }
}
