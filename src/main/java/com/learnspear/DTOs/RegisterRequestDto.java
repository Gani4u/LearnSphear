package com.learnspear.DTOs;

import com.learnspear.Enums.Role;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class RegisterRequestDto {
    private String username;
    private String email;
    private String password;
    private Role role;
}
