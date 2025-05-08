package capstone.backend.domain.bubble.dto.response;

import capstone.backend.domain.bubble.entity.Bubble;

public record BubbleDTO(
        Long bubbleId,
        String title
) {
    public BubbleDTO(Bubble bubble) {
        this(
                bubble.getId(),
                bubble.getTitle()
        );
    }
}
