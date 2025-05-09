package capstone.backend.domain.eisenhower.repository;

import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemFilterRequest;
import capstone.backend.domain.eisenhower.entity.EisenhowerItem;
import capstone.backend.domain.eisenhower.entity.EisenhowerQuadrant;
import capstone.backend.domain.eisenhower.entity.QEisenhowerItem;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@RequiredArgsConstructor
public class EisenhowerItemRepositoryImpl implements EisenhowerItemRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<EisenhowerItem> findFiltered(Long memberId, EisenhowerItemFilterRequest filter, Pageable pageable) {
        QEisenhowerItem item = QEisenhowerItem.eisenhowerItem;

        List<EisenhowerItem> results = queryFactory
                .selectFrom(item)
                .where(
                        item.member.id.eq(memberId),
                        eqCompleted(filter.completed(), item),
                        eqCategory(filter.categoryId(), item),
                        eqDueDate(filter.dueDate(), item),
                        eqQuadrant(filter.quadrant(), item)
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(item.order.asc())
                .fetch();

        Long total = queryFactory
                .select(item.count())
                .from(item)
                .where(
                        item.member.id.eq(memberId),
                        eqCompleted(filter.completed(), item),
                        eqCategory(filter.categoryId(), item),
                        eqDueDate(filter.dueDate(), item),
                        eqQuadrant(filter.quadrant(), item)
                )
                .fetchOne();

        return new PageImpl<>(results, pageable, total != null ? total : 0L);
    }

    private BooleanExpression eqCompleted(Boolean completed, QEisenhowerItem item) {
        return completed != null ? item.isCompleted.eq(completed) : null;
    }

    private BooleanExpression eqCategory(Long categoryId, QEisenhowerItem item) {
        return categoryId != null ? item.category.id.eq(categoryId) : null;
    }

    private BooleanExpression eqDueDate(LocalDate dueDate, QEisenhowerItem item) {
        return dueDate != null ? item.dueDate.eq(dueDate) : null;
    }

    private BooleanExpression eqQuadrant(EisenhowerQuadrant quadrant, QEisenhowerItem item) {
        return quadrant != null ? item.quadrant.eq(quadrant) : null;
    }
}
