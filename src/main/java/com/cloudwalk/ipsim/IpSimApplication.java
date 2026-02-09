package com.cloudwalk.ipsim;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.awt.Desktop;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

@SpringBootApplication
public class IpSimApplication {

    public static void main(String[] args) {
        SpringApplication.run(IpSimApplication.class, args);
        openBrowser();
    }

    private static void openBrowser() {
        String url = "http://localhost:8080";
        String os = System.getProperty("os.name").toLowerCase();
        Runtime rt = Runtime.getRuntime();

        try {
            if (os.contains("win")) {
                rt.exec(new String[] { "cmd", "/c", "start", "chrome", "--app=" + url });
            } else if (os.contains("mac")) {
                rt.exec(new String[] { "open", "-a", "Google Chrome", "--args", "--app=" + url });
            } else if (os.contains("nix") || os.contains("nux")) {
                rt.exec(new String[] { "google-chrome", "--app=" + url });
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
