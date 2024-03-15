import  { useState } from 'react';
import UTIF from 'utif';
import loadImage from 'blueimp-load-image';
import Modal from './Modal';
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
        const files = Array.from(event.target.files).filter(file => !isDuplicateImage(file));

        files.forEach(file => {
            const fileType = file.type;

            if (fileType === "image/tiff" || fileType === "image/tif") {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // First validate the TIFF file to ensure it's not corrupted
                    try {
                        const buffer = e.target.result;
                        const tiffs = UTIF.decode(buffer);
                        UTIF.decodeImage(buffer, tiffs[0]);

                        // After validation, proceed with displaying the TIFF
                        const rgba = UTIF.toRGBA8(tiffs[0]); // Convert TIFF to RGBA buffer
                        const canvas = document.createElement('canvas');
                        canvas.width = tiffs[0].width;
                        canvas.height = tiffs[0].height;
                        const ctx = canvas.getContext('2d');
                        const imgData = new ImageData(new Uint8ClampedArray(rgba), tiffs[0].width, tiffs[0].height);
                        ctx.putImageData(imgData, 0, 0);
                        updateImages(canvas.toDataURL(), file); // Update images with the canvas data URL
                    } catch (error) {
                        console.error('Error processing TIFF image:', error);
                        alert('Failed to load TIFF image. The file may be corrupted or unsupported.');
                    }
                };
                reader.readAsArrayBuffer(file);
            } else {
                // Non-TIFF images are handled here
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Directly use loadImage for non-TIFF images for validation
                    loadImage(
                        e.target.result,
                        (img) => {
                            if (img.type === 'error') {
                                console.error('Cannot load image: ', file.name);
                               showModal('Failed to load image. The file may be corrupted or unsupported.');
                            } else {
                                // Use the original event target result if loadImage was successful
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
        });
    };

    const removeImage = (id) => {
        setImages(images.filter(image => image.id !== id));
    };

    return (
        <div className="p-4 relative">
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            <div className="mt-4 grid grid-cols-8 items-center justify-items-center gap-4">
                {images.map((image) => (
                    <div key={image.id} className="relative w-28 h-28 overflow-hidden rounded-md  border border-gray-200">
                        <button onClick={() => removeImage(image.id)} className="absolute top-0 right-0"> <IoCloseCircleSharp className='text-red-500 text-xl' />
                            
                        </button>
                        <img src={image.src} alt={image.name} className="w-full h-full"/>
                    </div>
                ))}
            </div>
            <p className='absolute top-4 right-6 bg-lime-200 p-2 rounded-md'>Total Images Uploaded: {images.length}</p>
            <Modal isOpen={isModalOpen} message={modalMessage} onClose={closeModal} />
        
        </div>
          )}
            export default UploadImages;
