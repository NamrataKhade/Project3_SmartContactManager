package com.smart.controller;

import java.util.Random;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.smart.dao.UserRepository;
import com.smart.entities.User;
import com.smart.service.EmailService;

@Controller
public class ForgotController {
	
	Random random = new Random();
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	
	//email id form open handler
	
	@RequestMapping("/forgot")
	public String openEmailForm()
	{
		return "forgot_email_form";
	}

	@PostMapping("/send-OTP")
	public String sendOTP(@RequestParam("email") String email,HttpSession session)
	{
		System.out.println("EMAIL "+email);
		
		//generate four digit OTP
		
		
		int otp = random.nextInt(99999)+10;
		
		System.out.println("OTP "+otp);
		
		//write code for send otp email ....
		
		String subject="OTP From SCM";
		
		String message=""
				+"<div style='border:1px solid #e2e2e2; padding:20px'>"
				+"<h1>"
				+"OTP is "
				+"<b>"+otp
				+"</b>"
				+"</h1>"
				+"</div>";
		
		String to =email;
		
		boolean flag = this.emailService.sendEmail(subject, message, to);
		
		if(flag)
		{
			
			session.setAttribute("myotp", otp);
			session.setAttribute("email", email);
			return "verify-OTP";
			
		}
		else {
			
			session.setAttribute("message", "Check Your email id !!!");
			return "forgot_email_form";
		}
		
		
		
	}
	
	
	//verify OTP
	@PostMapping("/verify-OTP")
	public String verifyOTP(@RequestParam("otp") int otp,HttpSession session)
	{
		int myOtp=(int)session.getAttribute("myotp");
		
		String email=(String)session.getAttribute("email");
		
		if(myOtp==otp)
		{
			//password change form
			User user = this.userRepository.getUserByUserName(email);
			
			if(user==null)
			{
				//send error message
				
				session.setAttribute("message", "User does NOT exist with this email!!");
				
				return "forgot_email_form";
				
				
			}else
			{
				//
				//send Change password
				
				
			}
			
			
			return "password_Change_form";
			
		}else {
			session.setAttribute("message", "You have entered wrong OTP !!");
			
			return "verify-OTP";
		}
	}
	
	    //Change Password
	
	@PostMapping("/change-password")
	public String changePassword(@RequestParam("newpassword") String newpassword,HttpSession session)
	{
		String email=(String)session.getAttribute("email");
		
		User user = this.userRepository.getUserByUserName(email);
		
		user.setPassword(this.bCryptPasswordEncoder.encode(newpassword));
		
		this.userRepository.save(user);
		
		return "redirect:/signin?change=Password Change Successfully !!";
		
		
	}
}
