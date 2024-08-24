package com.example.springbootreactlol.repository;

import com.example.springbootreactlol.entity.User;
import com.example.springbootreactlol.projection.BetRankProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    @Transactional
    @Modifying
    @Query("update User u set u.point = u.point - ?1 where u.username = ?2")
    void reducePoint(@NonNull int point, String username);

    @Query(value = "SELECT u.nick_name as nickname, u.point FROM users u WHERE role != 'MASTER' ORDER BY u.point DESC", nativeQuery = true)
    List<BetRankProjection> findAllByOrderByPointDesc();

    @Transactional
    @Modifying
    @Query("update User u set u.nickName = ?1, u.point = ?2")
    int updateNickNameAndPointBy(String nickName, int point);

    @Query(value = "SELECT * FROM users WHERE username =?1", nativeQuery = true)
    User findByUsername2(String username);
}
