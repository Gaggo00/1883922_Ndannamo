package com.example.backend.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.repositories.ImageDataRepository;
import com.example.backend.utils.ImageUtil;
import com.example.backend.dto.ImageDataDTO;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.ImageDataMapperImpl;
import com.example.backend.model.ImageData;
import com.example.backend.model.Trip;
import com.example.backend.model.User;

import jakarta.transaction.Transactional;
import java.io.IOException;
import java.time.LocalDateTime;


@Service
public class ImageDataService {

    @Autowired
    private ImageDataRepository imageDataRepository;
    private ImageDataMapperImpl imageDataMapper;


    @Autowired
    public ImageDataService(ImageDataRepository imageDataRepository, ImageDataMapperImpl imageDataMapper) {
        this.imageDataRepository = imageDataRepository;
        this.imageDataMapper = imageDataMapper;
    }


    @Transactional
    public ImageData uploadImage(MultipartFile file, Trip trip, User uploadedBy) throws IOException {

        ImageData image = new ImageData();
        image.setName(file.getOriginalFilename());
        image.setType(file.getContentType());
        image.setUploadDate(LocalDateTime.now());
        image.setTrip(trip);
        image.setUploadedBy(uploadedBy);
        image.setDescription("");
        image.setImageData(ImageUtil.compressImage(file.getBytes()));

        imageDataRepository.save(image);

        return image;
    }

    @Transactional
    public ImageData getImageDataById(Long id) {
        return imageDataRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Photo not found!"));
    }
    
    @Transactional
    public ImageData getImageDataByName(String name) {
        return imageDataRepository.findByName(name).orElseThrow(()-> new ResourceNotFoundException("Photo not found!"));
    }

    @Transactional
    public ImageDataDTO getImageDataDTOById(Long id) {
        ImageData dbImage = getImageDataById(id);
        ImageDataDTO imageDTO = imageDataMapper.toDTO(dbImage);
        //imageDTO.setImageData(ImageUtil.decompressImage(dbImage.getImageData()));
        return imageDTO;
    }

    @Transactional
    public byte[] getImageByName(String name) {
        ImageData dbImage = getImageDataByName(name);
        byte[] image = ImageUtil.decompressImage(dbImage.getImageData());
        return image;
    }

    @Transactional
    public byte[] getImageById(Long id) {
        ImageData dbImage = getImageDataById(id);
        byte[] image = ImageUtil.decompressImage(dbImage.getImageData());
        return image;
    }

    @Transactional
    public void deleteImage(Long id) {
        ImageData dbImage = getImageDataById(id);
        imageDataRepository.delete(dbImage);
    }

    @Transactional
    public void deleteImage(ImageData image) {
        imageDataRepository.delete(image);
    }


}