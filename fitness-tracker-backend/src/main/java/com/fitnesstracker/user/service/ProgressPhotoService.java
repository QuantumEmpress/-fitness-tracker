package com.fitnesstracker.user.service;

import com.fitnesstracker.auth.model.User;
import com.fitnesstracker.auth.repository.UserRepository;
import com.fitnesstracker.service.CloudinaryService;
import com.fitnesstracker.user.model.ProgressPhoto;
import com.fitnesstracker.user.repository.ProgressPhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
public class ProgressPhotoService {

    @Autowired
    private ProgressPhotoRepository progressPhotoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    public ProgressPhoto uploadPhoto(String username, MultipartFile file, String notes, Double weight)
            throws IOException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String photoUrl = cloudinaryService.uploadImage(file);

        ProgressPhoto photo = new ProgressPhoto();
        photo.setUserId(user.getId());
        photo.setPhotoUrl(photoUrl);
        photo.setDate(LocalDate.now());
        photo.setNotes(notes);
        photo.setWeight(weight);

        return progressPhotoRepository.save(photo);
    }

    public List<ProgressPhoto> getUserPhotos(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return progressPhotoRepository.findByUserIdOrderByDateDesc(user.getId());
    }

    public void deletePhoto(String id) {
        progressPhotoRepository.deleteById(id);
    }
}
