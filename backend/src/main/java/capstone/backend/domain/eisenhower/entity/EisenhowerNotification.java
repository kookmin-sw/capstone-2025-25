package capstone.backend.domain.eisenhower.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
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
@Table(
        name = "eisenhower_notification",
        uniqueConstraints = @UniqueConstraint(
                name = "ux_member_item_date",
                columnNames = {"member_id","eisenhower_item_id","notification_date"}
        )
)
public class EisenhowerNotification {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "eisenhower_notification_id")
    private Long id;

    @Column(nullable = false, name = "member_id")
    private Long memberId;

    @Column(nullable = false, name = "eisenhower_item_id")
    private Long eisenhowerItemId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Column(nullable = false, name = "notification_date")
    private LocalDate notificationDate;

    public static EisenhowerNotification of(EisenhowerItem item, LocalDate notificationDate) {
        return EisenhowerNotification.builder()
                .memberId(item.getMember().getId())
                .eisenhowerItemId(item.getId())
                .title(item.getTitle())
                .dueDate(item.getDueDate())
                .notificationDate(notificationDate)
                .build();
    }
}
