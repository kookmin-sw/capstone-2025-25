package capstone.backend.domain.bubble.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record PromptResponse(
        @JsonProperty("extracted_chunks")
        List<String> chunks
) {}
