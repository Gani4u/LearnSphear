package com.learnspear.Service;

import com.learnspear.Repository.UserRepo;
import com.learnspear.entites.UserPrincipal;
import com.learnspear.entites.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo repo;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Users users = repo.findByUsername(username);
        if (users == null){
            throw new UsernameNotFoundException("User not found ");
        }

        return new UserPrincipal(users);
    }
}
