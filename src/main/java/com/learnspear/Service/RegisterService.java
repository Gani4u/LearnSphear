package com.learnspear.Service;

import com.learnspear.Repository.UserRepo;
import com.learnspear.entites.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegisterService {

    @Autowired
    UserRepo userRepo;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    private JwtService jwtService;


    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

    public Users register(Users users){

        users.setPassword(encoder.encode(users.getPassword()));

        return userRepo.save(users);
    }

    public String verify(Users users) {
        Authentication authentication =
                authManager.authenticate(new UsernamePasswordAuthenticationToken(users.getUsername(),users.getPassword()));

        if(authentication.isAuthenticated()){
           return jwtService.generateToken(users.getUsername());
        }
        //throw new UsernameNotFoundException("Looks like credentials are wrong");
        return "Fail";
    }


}
