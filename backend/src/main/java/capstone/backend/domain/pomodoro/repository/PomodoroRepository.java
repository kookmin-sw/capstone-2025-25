package capstone.backend.domain.pomodoro.repository;

import capstone.backend.domain.pomodoro.schema.Pomodoro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PomodoroRepository extends JpaRepository<Pomodoro, Long> {

    Optional<Pomodoro> findByIdAndMemberId(Long id, Long memberId);

    @Query("""
        SELECT p, ei
        FROM Pomodoro p
        LEFT JOIN EisenhowerItem ei ON ei.pomodoro.id = p.id
        WHERE p.member.id = :memberId
    """)
    List<Object[]> findPomodoroWithEisenhowerByMemberId(@Param("memberId") Long memberId);
}
