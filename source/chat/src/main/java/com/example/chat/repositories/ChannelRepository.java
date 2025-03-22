package com.example.chat.repositories;

import com.example.chat.model.Channel;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, Long> {
    Optional<Channel> findByChannelId(Long channelId);
    
}
