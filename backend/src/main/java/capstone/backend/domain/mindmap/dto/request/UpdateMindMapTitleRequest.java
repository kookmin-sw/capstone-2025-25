package capstone.backend.domain.mindmap.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateMindMapTitleRequest (
    @NotBlank String title
){}