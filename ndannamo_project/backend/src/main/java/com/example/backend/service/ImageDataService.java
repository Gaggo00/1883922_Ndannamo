package com.example.backend.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.repositories.ImageDataRepository;
import com.example.backend.utils.ImageUtil;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.ImageData;
import com.example.backend.model.Trip;
import com.example.backend.model.User;

import jakarta.transaction.Transactional;
import java.io.IOException;
import java.util.Optional;

@Service
public class ImageDataService {

    @Autowired
    private ImageDataRepository imageDataRepository;

    public ImageData uploadImage(MultipartFile file, Trip trip, User uploadedBy) throws IOException {

        ImageData image = new ImageData();
        image.setName(file.getOriginalFilename());
        image.setType(file.getContentType());
        image.setTrip(trip);
        image.setUploadedBy(uploadedBy);
        image.setDescription("");
        image.setImageData(ImageUtil.compressImage(file.getBytes()));

        imageDataRepository.save(image);

        /*
        imageDataRepository.save(ImageData.builder()
                .name(file.getOriginalFilename())
                .type(file.getContentType())
                .imageData(ImageUtil.compressImage(file.getBytes())).build());
        */

        return image;
    }

    @Transactional
    public ImageData getInfoByImageByName(String name) {
        Optional<ImageData> dbImage = imageDataRepository.findByName(name);

        return ImageData.builder()
                .name(dbImage.get().getName())
                .type(dbImage.get().getType())
                .imageData(ImageUtil.decompressImage(dbImage.get().getImageData())).build();

    }

    @Transactional
    public byte[] getImageByName(String name) {
        ImageData dbImage = imageDataRepository.findByName(name).orElseThrow(()-> new ResourceNotFoundException("Photo not found!"));
        byte[] image = ImageUtil.decompressImage(dbImage.getImageData());
        return image;
    }

    @Transactional
    public byte[] getImageById(Long id) {
        ImageData dbImage = imageDataRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Photo not found!"));
        byte[] image = ImageUtil.decompressImage(dbImage.getImageData());
        return image;
    }


    public void deleteImage(Long id) {
        ImageData dbImage = imageDataRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Photo not found!"));
        imageDataRepository.delete(dbImage);
    }

    public void deleteImage(ImageData image) {
        imageDataRepository.delete(image);
    }

    public ImageData getImageDataById(Long id) {
        ImageData dbImage = imageDataRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Photo not found!"));
        return dbImage;
    }
}