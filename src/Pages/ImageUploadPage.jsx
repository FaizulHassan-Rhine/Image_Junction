// import React, { useState } from 'react';

// const ImageUploadPage = ({ onUpload }) => {
//   const [selectedFiles, setSelectedFiles] = useState([]);

//   const handleFileChange = (e) => {
//     setSelectedFiles(e.target.files);
//   };

//   const handleUpload = () => {
//     if (selectedFiles.length > 0) {
//       onUpload(selectedFiles);
//       setSelectedFiles([]);
//     }
//   };

//   return (
//     <div className='flex justify-center items-center h-screen'>
//       <div className='bg-pink-300 p-8'>
//         <input type="file" accept="image/*" multiple onChange={handleFileChange} />
//         <button onClick={handleUpload}>Upload</button>
//       </div>
//     </div>
//   );
// };

// export default ImageUploadPage;
