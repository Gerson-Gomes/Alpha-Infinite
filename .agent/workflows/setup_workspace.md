---
description: Initialize the InfinitePay Desktop Simulator (IP-Sim) project structure and dependencies
---

This workflow sets up the project structure, Maven configuration, and frontend basics as described in \`project_doc.md\`.

1.  Create the directory structure according to the documentation.
    // turbo
    \`\`\`bash
    mkdir -p src/main/java/com/cloudwalk/ipsim/config
    mkdir -p src/main/java/com/cloudwalk/ipsim/controller
    mkdir -p src/main/java/com/cloudwalk/ipsim/service
    mkdir -p src/main/java/com/cloudwalk/ipsim/model
    mkdir -p src/main/java/com/cloudwalk/ipsim/repository
    mkdir -p src/main/java/com/cloudwalk/ipsim/dto
    mkdir -p src/main/resources/static/css
    mkdir -p src/main/resources/static/js
    mkdir -p src/main/frontend/ts
    mkdir -p src/main/frontend/scss
    mkdir -p src/test/java/com/cloudwalk/ipsim
    \`\`\`

2.  Create \`pom.xml\` with Spring Boot and H2 dependencies.
    \`\`\`xml
    <!-- pom.xml -->
    <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
    
      <groupId>com.cloudwalk</groupId>
      <artifactId>ipsim</artifactId>
      <version>1.0.0-alpha</version>
      <packaging>jar</packaging>
    
      <name>InfinitePay Desktop Simulator</name>
      <description>Desktop simulator for InfinitePay ecosystem</description>
    
      <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/> <!-- lookup parent from repository -->
      </parent>
    
      <properties>
        <java.version>21</java.version>
      </properties>
    
      <dependencies>
        <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
          <groupId>com.h2database</groupId>
          <artifactId>h2</artifactId>
          <scope>runtime</scope>
        </dependency>
        <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-test</artifactId>
          <scope>test</scope>
        </dependency>
      </dependencies>
    
      <build>
        <plugins>
          <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
          </plugin>
        </plugins>
      </build>
    </project>
    \`\`\`

3.  Create \`src/main/resources/application.properties\`.
    \`\`\`properties
    server.port=8080
    spring.application.name=ip-sim
    
    # H2 Configuration
    spring.datasource.url=jdbc:h2:file:./data/ipsim
    spring.datasource.driverClassName=org.h2.Driver
    spring.datasource.username=sa
    spring.datasource.password=password
    spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
    spring.h2.console.enabled=true
    
    # JPA
    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.show-sql=true
    \`\`\`

4.  Create the main application class \`src/main/java/com/cloudwalk/ipsim/IpSimApplication.java\`.
    \`\`\`java
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
                     rt.exec("cmd /c start chrome --app=" + url);
                } else if (os.contains("mac")) {
                     rt.exec("open -a 'Google Chrome' --args --app=" + url);
                } else if (os.contains("nix") || os.contains("nux")) {
                     rt.exec(new String[]{"google-chrome", "--app=" + url});
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    \`\`\`

5.  Initialize TypeScript configuration \`src/main/frontend/tsconfig.json\`.
    \`\`\`json
    {
      "compilerOptions": {
        "target": "es6",
        "module": "es2015",
        "outDir": "../../resources/static/js",
        "rootDir": "./ts",
        "strict": true,
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true
      },
      "include": ["ts/**/*"]
    }
    \`\`\`

6.  Create a basic \`index.html\`.
    \`\`\`html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>InfinitePay Simulator</title>
        <link rel="stylesheet" href="css/styles.css">
    </head>
    <body class="bg-gray-100 h-screen flex justify-center items-center">
        <div id="app" class="text-center">
            <h1 class="text-3xl font-bold text-blue-600 mb-4">InfinitePay Simulator</h1>
            <p class="text-gray-700">Loading...</p>
        </div>
        <script type="module" src="js/main.js"></script>
    </body>
    </html>
    \`\`\`
