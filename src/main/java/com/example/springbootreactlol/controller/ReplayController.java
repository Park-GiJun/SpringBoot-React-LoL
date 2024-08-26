package com.example.springbootreactlol.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import java.io.*;
import java.util.zip.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/public/api/replay")
public class ReplayController {

    @PostMapping("/parse")
    public ResponseEntity<String> parseRoflFile(@RequestParam("file") MultipartFile file) {
        try {
            // 파일을 임시 저장
            File tempFile = File.createTempFile("temp", ".rofl");
            file.transferTo(tempFile);

            // 파일 내용 읽기
            String content;
            try (InputStream inputStream = new FileInputStream(tempFile)) {
                // GZIP 압축 해제 시도
                try (GZIPInputStream gzipInputStream = new GZIPInputStream(inputStream)) {
                    content = new String(gzipInputStream.readAllBytes());
                } catch (IOException e) {
                    // GZIP이 아닌 경우 일반 텍스트로 읽기
                    inputStream.reset();
                    content = new String(inputStream.readAllBytes());
                }
            }

            // JSON 파싱
            ObjectMapper mapper = new ObjectMapper();
            Object jsonObject = mapper.readValue(content, Object.class);

            // JSON을 문자열로 변환하여 반환
            return ResponseEntity.ok(mapper.writeValueAsString(jsonObject));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("파일 파싱 중 오류 발생: " + e.getMessage());
        }
    }
}