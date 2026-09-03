package com.dailywander.service;

import org.junit.jupiter.api.Test;

import javax.imageio.ImageIO;
import javax.imageio.ImageWriter;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Iterator;

import static org.junit.jupiter.api.Assertions.*;

class WebpEncodingTest {

    @Test
    void testWebpWriterAvailable() {
        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("webp");
        assertTrue(writers.hasNext(), "WebP ImageWriter should be registered in ImageIO");
    }

    @Test
    void testEncodeAndDecodeWebp() throws Exception {
        BufferedImage original = new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = original.createGraphics();
        g.setColor(Color.RED);
        g.fillRect(0, 0, 100, 100);
        g.dispose();

        ImageWriter writer = ImageIO.getImageWritersByFormatName("webp").next();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (var ios = ImageIO.createImageOutputStream(baos)) {
            writer.setOutput(ios);
            var param = writer.getDefaultWriteParam();
            if (param.canWriteCompressed()) {
                param.setCompressionMode(javax.imageio.ImageWriteParam.MODE_EXPLICIT);
                param.setCompressionType(param.getCompressionTypes()[0]);
                param.setCompressionQuality(0.8f);
            }
            writer.write(null, new javax.imageio.IIOImage(original, null, null), param);
        } finally {
            writer.dispose();
        }

        byte[] webpBytes = baos.toByteArray();
        assertTrue(webpBytes.length > 0);
        assertEquals('R', (char) webpBytes[0]);
        assertEquals('I', (char) webpBytes[1]);
        assertEquals('F', (char) webpBytes[2]);
        assertEquals('F', (char) webpBytes[3]);
        assertEquals('W', (char) webpBytes[8]);
        assertEquals('E', (char) webpBytes[9]);
        assertEquals('B', (char) webpBytes[10]);
        assertEquals('P', (char) webpBytes[11]);

        BufferedImage decoded = ImageIO.read(new ByteArrayInputStream(webpBytes));
        assertNotNull(decoded, "WebP image should be readable by ImageIO");
        assertEquals(100, decoded.getWidth());
        assertEquals(100, decoded.getHeight());
    }
}
