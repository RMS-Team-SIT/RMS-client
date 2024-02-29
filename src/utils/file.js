export const isImage = (file) => file.type.startsWith('image/');
export const validatePDFFile = (
  file,
  expectedFile,
  maxSize = 1024 * 1024 * 10
) => {
  if (file.type !== 'application/pdf') {
    alert('โปรดเลือกไฟล์ PDF เท่านั้น');
    return false;
  }
  if (file.size > maxSize) {
    alert('File size exceeds the limit of 10MB.');
    return false;
  }
  return true;
};

export const validateImageFile = (
  file,
  expectedFile,
  maxSize = 1024 * 1024 * 10
) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    alert('โปรดเลือกไฟล์ JPEG หรือ PNG เท่านั้น');
    return false;
  }
  if (file.size > maxSize) {
    alert('File size exceeds the limit of 10MB.');
    return false;
  }
  return true;
};
