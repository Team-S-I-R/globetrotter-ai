// const blobToBase64 = (blob: Blob, callback: (base64data: string) => void) => {
//   const reader = new FileReader();
  
//   reader.onload = async function () {
//     const result = reader.result;
//     const base64data = typeof result === 'string' ? result.split(',')[1] : '';
//     await callback(base64data); // Removed 'await'
//   };

//   reader.readAsDataURL(blob);
// };

// export { blobToBase64 };

const blobToBase64 = async (blob: Blob, callback: (base64data: string) => Promise<void>) => {
   const reader = new FileReader();
   reader.onload = async function () {
     const result = reader.result;
     const base64data = typeof result === 'string' ? result.split(',')[1] : '';
     await callback(base64data);
    //  console.log(base64data);
   };
   reader.readAsDataURL(blob);
 };
 
 export { blobToBase64 };