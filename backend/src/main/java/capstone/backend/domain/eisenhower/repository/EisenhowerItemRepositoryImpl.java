package capstone.backend.domain.eisenhower.repository;

import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemFilterRequest;
import capstone.backend.domain.eisenhower.entity.EisenhowerItem;
import capstone.backend.domain.eisenhower.entity.QEisenhowerItem;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
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

        BooleanBuilder whereClause = new BooleanBuilder();
        whereClause.and(item.member.id.eq(memberId));
        if (filter.completed() != null) whereClause.and(item.isCompleted.eq(filter.completed()));
        if (filter.categoryId() != null) whereClause.and(item.category.id.eq(filter.categoryId()));
        if (filter.dueDate() != null) whereClause.and(item.dueDate.eq(filter.dueDate()));
        if (filter.type() != null) whereClause.and(item.type.eq(filter.type()));
        if (filter.quadrant() != null) whereClause.and(item.quadrant.eq(filter.quadrant()));

        List<EisenhowerItem> results = queryFactory
                .selectFrom(item)
                .where(whereClause)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(item.order.asc())
                .fetch();

        Long total = queryFactory
                .select(item.count())
                .from(item)
                .where(whereClause)
                .fetchOne();

        return new PageImpl<>(results, pageable, total != null ? total : 0L);
    }
}
