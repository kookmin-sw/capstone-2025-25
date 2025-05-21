package capstone.backend.domain.pomodoro.repository;

import capstone.backend.domain.pomodoro.entity.Pomodoro;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PomodoroRepository extends JpaRepository<Pomodoro, Long> {

    Optional<Pomodoro> findByIdAndMemberId(Long id, Long memberId);

//    @Query("""
//        SELECT p, ei
//        FROM Pomodoro p
//        LEFT JOIN EisenhowerItem ei ON ei.pomodoro.id = p.id
//        WHERE p.member.id = :memberId
//    """)
//    List<Object[]> findPomodoroWithEisenhowerByMemberId(@Param("memberId") Long memberId);
}
