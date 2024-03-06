export const isImage = (file) => file.type.startsWith('image/');
export const validatePDFFile = (file, maxSize = 10) => {
  if(!file || maxSize <= 0){
    return false;
  }
  if (file.type !== 'application/pdf') {
    alert('โปรดเลือกไฟล์ PDF เท่านั้น');
    return false;
  }
  if (file.size > maxSize * 1024 * 1024) {
    alert('File size exceeds the limit of 10MB.');
    return false;
  }
  return true;
};

export const validateImageFile = (file, maxSize = 10) => {
  if(!file || maxSize <= 0){
    return false;
  }
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    alert('โปรดเลือกไฟล์ JPEG หรือ PNG เท่านั้น');
    return false;
  }
  if (file.size > maxSize * 1024 * 1024) {
    alert(`File size exceeds the limit of ${maxSize} MB.`);
    return false;
  }
  return true;
};
