import React, { useState, useEffect } from 'react';

const ImageUploader = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem('images'));
    if (storedImages) {
      setImages(storedImages);
    }
  }, []);

  const handleFileChange = async (e) => {
    const fileList = e.target.files;
    const newImages = [];
  
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
  
      // Check if the file type is an image
      if (file.type.startsWith('image/')) {
        // Check for duplicate files by comparing names and sizes
        const isDuplicate = images.some(image => image.name === file.name && image.size === file.size);
  
        if (!isDuplicate) {
          const dataURL = await readFileAsync(file);
          newImages.push({ name: file.name, size: file.size, dataURL });
        } else {
          console.warn(`File "${file.name}" is already uploaded and will be skipped.`);
        }
      } else {
        // Handle non-image files (optional)
        console.warn(`File "${file.name}" is not an image and will be skipped.`);
      }
    }
  
    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      localStorage.setItem('images', JSON.stringify(updatedImages));
    }
  };
  
  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (imageName) => {
    const updatedImages = images.filter((image) => image.name !== imageName);
    setImages(updatedImages);
    localStorage.setItem('images', JSON.stringify(updatedImages));
  };

  const renderImages = () => {
    return images.map((image) => (
      <div key={image.name} className="w-1/4 p-2">
        <div className="relative">
          <img src={image.dataURL} alt={`Preview ${image.name}`} className="w-40 h-40" />
          <button
            onClick={() => removeImage(image.name)}
            className="absolute top-0 bg-red-500 text-white rounded-full px-4 py-2"
          >
            X
          </button>
        </div>
      </div>
    ));
  };
  
  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleFileChange} />
      <p>Total Image Uploads: {images.length}</p>
      <div className="flex flex-wrap">{renderImages()}</div>
    </div>
  );
};

export default ImageUploader;
