import { useEffect, useState } from 'react';

function ImageUpload({
  label,
  hint,
  file,
  previewUrl,
  onChange,
  required = false,
}) {
  const [localPreview, setLocalPreview] = useState(previewUrl || '');

  useEffect(() => {
    if (previewUrl) {
      setLocalPreview(previewUrl);
      return undefined;
    }

    if (!file) {
      setLocalPreview('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file, previewUrl]);

  const handleFileChange = (event) => {
    const nextFile = event.target.files?.[0] || null;
    onChange(nextFile);
  };

  return (
    <div className="field-group">
      <label className="field-label">
        {label}
        {required ? <span className="field-label__required">*</span> : null}
      </label>
      <label className="upload-dropzone">
        <input
          className="upload-dropzone__input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required={required && !previewUrl && !file}
        />
        <span className="upload-dropzone__title">
          {file ? 'Replace image' : 'Choose an image'}
        </span>
        <span className="upload-dropzone__hint">{hint}</span>
      </label>
      {localPreview ? (
        <img className="upload-preview" src={localPreview} alt="Pet preview" />
      ) : null}
    </div>
  );
}

export default ImageUpload;
