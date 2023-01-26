// ***Here is the code for converting "image source" (url) to "Base64".***
export const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    }))


// ***Here is code for converting "Base64" to javascript "File Object".***
export const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}


export const blobCreationFromURL = (inputURI) => {

    var binaryVal;

    // mime extension extraction
    var inputMIME = inputURI.split(',')[0].split(':')[1].split(';')[0];

    // Extract remaining part of URL and convert it to binary value
    if (inputURI.split(',')[0].indexOf('base64') >= 0)
        binaryVal = atob(inputURI.split(',')[1]);

    // Decoding of base64 encoded string
    else
        binaryVal = unescape(inputURI.split(',')[1]);

    // Computation of new string in which hexadecimal
    // escape sequences are replaced by the character 
    // it representsdataURLtoFile

    // Store the bytes of the string to a typed array
    var blobArray = [];
    for (var index = 0; index < binaryVal.length; index++) {
        blobArray.push(binaryVal.charCodeAt(index));
    }

    return new Blob([blobArray], {
        type: inputMIME
    });
}
