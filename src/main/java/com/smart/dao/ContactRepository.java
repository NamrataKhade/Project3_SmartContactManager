package com.smart.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.smart.entities.Contact;
import com.smart.entities.User;

public interface ContactRepository extends JpaRepository<Contact, Integer>{
	
	//pagenation implementation
	
	@Query("from Contact as c where c.user.id =:userId")
	//public List<Contact> findContactsByUser(@Param("userId")int user_Id);
	
	//current page-page,
	//contact per page-5
	public Page<Contact> findContactsByUser(@Param("userId")int user_Id,Pageable pageable);
	
	
	
	public List<Contact> findByCnameContainingAndUser(String cname,User user);

}
