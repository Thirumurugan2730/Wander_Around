package com.dailywander.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleResponseStatusException_returnsStatusAndMessage() {
        ResponseStatusException ex = new ResponseStatusException(HttpStatus.CONFLICT, "Today's photo limit has been reached.");
        ResponseEntity<Map<String, String>> response = handler.handleResponseStatusException(ex);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("Today's photo limit has been reached.", response.getBody().get("message"));
    }

    @Test
    void handleMaxUploadSizeExceededException_returnsBadRequest() {
        MaxUploadSizeExceededException ex = new MaxUploadSizeExceededException(50000000);
        ResponseEntity<Map<String, String>> response = handler.handleMaxUploadSizeExceededException(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("File exceeds maximum allowed upload size.", response.getBody().get("message"));
    }

    @Test
    void handleMultipartException_returnsBadRequest() {
        MultipartException ex = new MultipartException("Corrupt multipart");
        ResponseEntity<Map<String, String>> response = handler.handleMultipartException(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid multipart request format.", response.getBody().get("message"));
    }

    @Test
    void handleGenericException_returnsInternalServerErrorWithoutStackTrace() {
        Exception ex = new RuntimeException("Sensitive database connection details jdbc:postgresql://secret");
        ResponseEntity<Map<String, String>> response = handler.handleGenericException(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Something went wrong. Please try again later.", response.getBody().get("message"));
        assertFalse(response.getBody().get("message").contains("secret"));
    }
}
