package com.example.springbootreactlol.repository;

import com.example.springbootreactlol.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    @Transactional
    @Modifying
    @Query("update User u set u.point = u.point - ?1 where u.username = ?2")
    void reducePoint(@NonNull int point, String username);

}
