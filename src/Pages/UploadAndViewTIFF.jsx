import React, { useState, useEffect } from 'react';
import UTIF from 'utif';
import { initDB, storeImage, getAllImages, removeImage, clearAllImages } from './dbOperations';

const UploadAndViewImage = () => {
    const [images, setImages] = useState([]);
    const [db, setDb] = useState(null);

    useEffect(() => {
        // Initialize IndexedDB and load images on component mount
        const loadImages = async () => {
            const db = await initDB();
            setDb(db);
            const storedImages = await getAllImages(db);
            setImages(storedImages);
        };
        loadImages();
    }, []);

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);
        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                const newImageSrc = e.target.result;

                // Prevent duplicates
                if (!images.find((image) => image.src === newImageSrc)) {
                    let imageObj = { id: Date.now() + file.name, src: newImageSrc };

                    if (file.type === "image/tiff" || file.type === "image/tif") {
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
                        imageObj.src = canvas.toDataURL();
                    }

                    // Store image in IndexedDB
                    if (db) {
                        await storeImage(db, imageObj);
                        setImages((prevImages) => [...prevImages, imageObj]);
                    }
                }
            };

            if (file.type === "image/tiff" || file.type === "image/tif") {
                reader.readAsArrayBuffer(file);
            } else {
                reader.readAsDataURL(file);
            }
        });
    };

    const handleRemoveImage = async (id) => {
        if (db) {
            await removeImage(db, id); // Remove from IndexedDB
            setImages(images.filter(image => image.id !== id)); // Update state to remove the image
        }
    };

    const handleRemoveAllImages = async () => {
        if (db) {
            await clearAllImages(db); // Clear all images from IndexedDB
            setImages([]); // Clear images from state
        }
    };

    return (
        <div className="p-4">
            <button onClick={handleRemoveAllImages} className="absolute top-0 right-0 m-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Clear All Images
            </button>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
            <div className="mt-4 grid grid-cols-6 justify-items-center gap-4">
                {images.map((image) => (
                    <div key={image.id} className="relative w-40 h-40 border border-gray-200 overflow-hidden">
                        <img src={image.src} alt="Preview" className="max-w-full max-h-full object-contain"/>
                        <button onClick={() => handleRemoveImage(image.id)} className="absolute top-0 right-0 bg-red-500 text-white p-1 m-1 rounded hover:bg-red-700 transition duration-200 ease-in-out">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
            <p className="absolute top-4 right-60 text-center">Uploaded Images: {images.length}</p>
        </div>
    );
};

export default UploadAndViewImage;
