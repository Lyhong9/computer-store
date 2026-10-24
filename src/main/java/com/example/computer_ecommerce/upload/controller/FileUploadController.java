package com.example.computer_ecommerce.upload.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
public class FileUploadController {

    private static final String UPLOAD_DIR = "uploads";
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "webp", "gif", "avif", "jfif", "svg", "bmp", "ico", "heic"
    );

    @PostMapping("/api/uploads")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File cannot be empty"));
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf('.') + 1).toLowerCase();
        }

        byte[] headerBytes = new byte[32];
        try (InputStream is = file.getInputStream()) {
            int read = is.read(headerBytes);
            if (read > 0) {
                extension = detectImageExtension(headerBytes, extension);
            }
        } catch (IOException ignored) {
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Unsupported file type: " + extension + ". Allowed: " + ALLOWED_EXTENSIONS
            ));
        }

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String filename = UUID.randomUUID() + "." + extension;
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/" + filename;

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "url", fileUrl,
                    "filename", filename,
                    "size", file.getSize(),
                    "format", extension
            ));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        }
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(filename).normalize();
            if (!Files.exists(filePath) || !Files.isReadable(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(filePath.toUri());
            MediaType mediaType = determineMediaType(filePath);

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private String detectImageExtension(byte[] header, String fallbackExt) {
        if (header == null || header.length < 4) {
            return fallbackExt;
        }

        // JPEG: FF D8 FF
        if ((header[0] & 0xFF) == 0xFF && (header[1] & 0xFF) == 0xD8 && (header[2] & 0xFF) == 0xFF) {
            return "jpg";
        }
        // PNG: 89 50 4E 47
        if ((header[0] & 0xFF) == 0x89 && header[1] == 'P' && header[2] == 'N' && header[3] == 'G') {
            return "png";
        }
        // GIF: 47 49 46 38 ("GIF8")
        if (header[0] == 'G' && header[1] == 'I' && header[2] == 'F' && header[3] == '8') {
            return "gif";
        }
        // WebP: RIFF....WEBP
        if (header.length >= 12 && header[0] == 'R' && header[1] == 'I' && header[2] == 'F' && header[3] == 'F'
                && header[8] == 'W' && header[9] == 'E' && header[10] == 'B' && header[11] == 'P') {
            return "webp";
        }
        // AVIF: ....ftypavif or ftypmif1
        if (header.length >= 12 && header[4] == 'f' && header[5] == 't' && header[6] == 'y' && header[7] == 'p') {
            String brand = new String(header, 8, Math.min(4, header.length - 8));
            if (brand.startsWith("avif") || brand.startsWith("mif1")) {
                return "avif";
            }
        }
        // BMP: BM
        if (header[0] == 'B' && header[1] == 'M') {
            return "bmp";
        }

        return fallbackExt;
    }

    private MediaType determineMediaType(Path path) {
        try {
            byte[] header = new byte[32];
            try (InputStream is = Files.newInputStream(path)) {
                int read = is.read(header);
                if (read >= 4) {
                    if ((header[0] & 0xFF) == 0xFF && (header[1] & 0xFF) == 0xD8 && (header[2] & 0xFF) == 0xFF) {
                        return MediaType.IMAGE_JPEG;
                    }
                    if ((header[0] & 0xFF) == 0x89 && header[1] == 'P' && header[2] == 'N' && header[3] == 'G') {
                        return MediaType.IMAGE_PNG;
                    }
                    if (header[0] == 'G' && header[1] == 'I' && header[2] == 'F' && header[3] == '8') {
                        return MediaType.IMAGE_GIF;
                    }
                    if (read >= 12 && header[0] == 'R' && header[1] == 'I' && header[2] == 'F' && header[3] == 'F'
                            && header[8] == 'W' && header[9] == 'E' && header[10] == 'B' && header[11] == 'P') {
                        return MediaType.parseMediaType("image/webp");
                    }
                    if (read >= 12 && header[4] == 'f' && header[5] == 't' && header[6] == 'y' && header[7] == 'p') {
                        return MediaType.parseMediaType("image/avif");
                    }
                }
            }
            String probe = Files.probeContentType(path);
            if (probe != null) {
                return MediaType.parseMediaType(probe);
            }
        } catch (Exception ignored) {
        }
        return MediaType.APPLICATION_OCTET_STREAM;
    }
}
