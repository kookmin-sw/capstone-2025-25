package capstone.backend.domain.bubble.dto.response;

import java.util.List;

public record PromptResponse(
        List<String> chunks
) {}
