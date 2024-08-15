// upload files
export const uploadFile = async ({ multiple, allowedExtensions } = {}) => {
  // creade image uplad ui
  let file = document.createElement("INPUT");
  file.type = "file";
  file.multiple = multiple;

  // get the files and convert to base64
  return await new Promise((resolve, reject) => {
    file.click();

    file.addEventListener(
      "change",
      () => {
        const tempFiles = [];

        ([...file.files] || []).forEach((f, index) => {
          const isLast = index >= file.files.length - 1;

          let fileExtention = f.name
            .split(".")
            .pop()
            .toLowerCase();
          if (allowedExtensions && !allowedExtensions.includes(fileExtention)) {
            return isLast ? resolve(tempFiles) : null;
          }

          if (/\.(jpe?g|APNG|PNG|GIF|AVIF|SVG|WebP|BMP|ICO|TIFF)$/i.test(f.name)) {
            var reader = new FileReader();
            reader.onload = function() {
              tempFiles.push({ file: f, base64: reader.result });
              isLast && resolve(tempFiles);
            };
            reader.readAsDataURL(f);
            reader.onerror = function(error) {
              // create square image
            };
          } else {
            // create square image

            isLast && resolve(tempFiles);
          }
        });
      },
      { once: true }
    );
  });
};
