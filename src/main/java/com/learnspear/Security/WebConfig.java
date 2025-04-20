package com.learnspear.Security;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Expose the /uploads/course-images/** URL to access files from the file system
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:///C:/LearnSphear/uploads/course-images/");
    }
}

