package com.learnspear.Controllers;

import com.learnspear.Service.JwtService;
import com.learnspear.Service.RegisterService;
import com.learnspear.entites.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend
public class RegisterController {

    @Autowired
    private RegisterService registerService;


    @PostMapping("/register")
    public Users register(@RequestBody Users users){
        // System.out.println("User: "+users);
        return registerService.register(users);
    }

    @PostMapping("/login")
    public String login(@RequestBody Users users){
        return registerService.verify(users);
    }

}
