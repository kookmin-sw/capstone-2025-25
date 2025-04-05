package capstone.backend.domain.pomodoro.repository;

import capstone.backend.domain.pomodoro.schema.Pomodoro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PomodoroRepository extends JpaRepository<Pomodoro, Long> {

    List<Pomodoro> findAllByMemberId(Long memberId);

    Optional<Pomodoro> findByIdAndMemberId(Long id, Long memberId);
}
