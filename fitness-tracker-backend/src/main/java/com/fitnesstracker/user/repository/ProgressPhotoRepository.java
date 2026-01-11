package com.fitnesstracker.user.repository;

import com.fitnesstracker.user.model.ProgressPhoto;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProgressPhotoRepository extends MongoRepository<ProgressPhoto, String> {
    List<ProgressPhoto> findByUserIdOrderByDateDesc(String userId);
}
