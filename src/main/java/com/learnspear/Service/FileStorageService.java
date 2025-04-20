package com.learnspear.Service;

import org.apache.commons.io.FilenameUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadDir = Paths.get("uploads/course-images");

    public FileStorageService() throws IOException {
        // Ensure directory exists on initialization
        Files.createDirectories(uploadDir);
    }

    public String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IOException("Cannot store empty or null file.");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = FilenameUtils.getExtension(originalFilename);

        if (fileExtension.isEmpty()) {
            throw new IOException("Invalid file extension.");
        }

        // Validate file type (optional)
        if (!isAllowedExtension(fileExtension)) {
            throw new IOException("File type not supported.");
        }

        String newFileName = UUID.randomUUID() + "." + fileExtension;
        Path targetPath = uploadDir.resolve(newFileName);

        // Save the file
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        return newFileName; // Save this in DB
    }

    public Resource loadFile(String filename) throws MalformedURLException {
        Path filePath = uploadDir.resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            throw new MalformedURLException("Could not read file: " + filename);
        }

        return resource;
    }

    private boolean isAllowedExtension(String extension) {
        // You can customize this
        String ext = extension.toLowerCase();
        return ext.equals("jpg") || ext.equals("jpeg") || ext.equals("png") || ext.equals("webp");
    }
}
