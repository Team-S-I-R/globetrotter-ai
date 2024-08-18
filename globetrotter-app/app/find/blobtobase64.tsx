const blobToBase64 = async (blob: Blob, callback: (base64data: string) => Promise<void>) => {
   const reader = new FileReader();
   reader.onload = async function () {
     const result = reader.result;
     const base64data = typeof result === 'string' ? result.split(',')[1] : '';
     await callback(base64data);
   };
   reader.readAsDataURL(blob);
 };
 
 export { blobToBase64 };