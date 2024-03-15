import React, { useState } from 'react';
import UTIF from 'utif';
import loadImage from 'blueimp-load-image';
import Modal from './Modal'; // Make sure this path matches where your Modal component is located
import { IoCloseCircleSharp } from 'react-icons/io5';

const UploadImages = () => {
    const [images, setImages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const showModal = (message) => {
        setModalMessage(message);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const isDuplicateImage = (newFile) => {
        return images.some(image => image.name === newFile.name && image.size === newFile.size);
    };

    const updateImages = (src, file) => {
        setImages((prevImages) => [...prevImages, { id: Date.now() + file.name, src, name: file.name, size: file.size }]);
    };

    const handleFileChange = (event) => {
        const items = event.target.files;
        const files = Array.from(items).filter(file => !isDuplicateImage(file));

        files.forEach(file => {
            processFile(file);
        });
    };

    const processFile = (file) => {
        const fileType = file.type;

        if (fileType === "image/tiff" || fileType === "image/tif") {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const buffer = e.target.result;
                    const tiffs = UTIF.decode(buffer);
                    UTIF.decodeImage(buffer, tiffs[0]);
                    const rgba = UTIF.toRGBA8(tiffs[0]);
                    const canvas = document.createElement('canvas');
                    canvas.width = tiffs[0].width;
                    canvas.height = tiffs[0].height;
                    const ctx = canvas.getContext('2d');
                    const imgData = new ImageData(new Uint8ClampedArray(rgba), tiffs[0].width, tiffs[0].height);
                    ctx.putImageData(imgData, 0, 0);
                    updateImages(canvas.toDataURL(), file);
                } catch (error) {
                    console.error('Error processing TIFF image:', error);
                    showModal('Failed to load TIFF image. The file may be corrupted or unsupported.');
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                loadImage(
                    e.target.result,
                    (img) => {
                        if (img.type === 'error') {
                            console.error('Cannot load image: ', file.name);
                            showModal('Failed to load image. The file may be corrupted or unsupported.');
                        } else {
                            updateImages(e.target.result, file);
                        }
                    },
                    { canvas: true, orientation: true }
                );
            };
            reader.onerror = () => {
                console.error('FileReader error: ', file.name);
                showModal('An error occurred while reading the file.');
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (id) => {
        setImages(images.filter(image => image.id !== id));
    };

    return (
        <div className="p-4 relative">
            <div className="flex items-center space-x-2">
                <label className="cursor-pointer px-4 py-2 bg-purple-200 text-black rounded-3xl ">
                    Upload Files
                    <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                </label>
                <label className="cursor-pointer px-4 py-2 bg-lime-200 text-black rounded-3xl ">
                    Upload Folder
                    <input type="file" accept="image/*" multiple webkitdirectory="" directory="" onChange={handleFileChange} className="hidden" />
                </label>
            </div>
            <div className="mt-4 grid grid-cols-8 gap-4">
                {images.map((image) => (
                    <div key={image.id} className="relative w-28 h-28 overflow-hidden rounded-md border border-gray-200">
                        <button onClick={() => removeImage(image.id)} className="absolute top-0 right-0">
                            <IoCloseCircleSharp className='text-red-500 text-xl' />
                        </button>
                        <img src={image.src} alt={image.name} className="w-full h-full"/>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} message={modalMessage} onClose={closeModal} />
            <p className='absolute top-4 right-6 bg-pink-200 p-2 rounded-md'>Total Images Uploaded: {images.length}</p>
        </div>
    );
};

export default UploadImages;
