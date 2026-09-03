package com.dailywander;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DailyWanderApplication {

    public static void main(String[] args) {
        configureTmpDir();
        loadEnvIfPresent();
        SpringApplication.run(DailyWanderApplication.class, args);
    }

    private static void configureTmpDir() {
        String tmpDir = System.getProperty("user.home") + "/.tmp";
        Path.of(tmpDir).toFile().mkdirs();
        System.setProperty("java.io.tmpdir", tmpDir);
    }

    private static void loadEnvIfPresent() {
        Path envPath = Path.of(".env");
        if (Files.exists(envPath)) {
            try {
                for (String line : Files.readAllLines(envPath)) {
                    line = line.trim();
                    if (!line.isEmpty() && !line.startsWith("#") && line.contains("=")) {
                        int idx = line.indexOf('=');
                        String key = line.substring(0, idx).trim();
                        String value = line.substring(idx + 1).trim();
                        // Remove surrounding quotes if present
                        if ((value.startsWith("\"") && value.endsWith("\"")) ||
                            (value.startsWith("'") && value.endsWith("'"))) {
                            value = value.substring(1, value.length() - 1);
                        }
                        if (System.getProperty(key) == null && System.getenv(key) == null) {
                            System.setProperty(key, value);
                        }
                    }
                }
            } catch (IOException ignored) {
            }
        }
    }
}

