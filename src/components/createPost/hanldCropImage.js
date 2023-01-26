export const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
        image.src = url
    })

export function getRadianAngle(degreeValue) {
    return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width, height, rotation) {
    const rotRad = getRadianAngle(rotation)

    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    }
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export default async function getCroppedImg(
    imageSrc,
    pixelCrop,
    rotation = 0,
    filter = undefined,
    flip = { horizontal: false, vertical: false }
) {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

    const rotRad = getRadianAngle(rotation)

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    )

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth
    canvas.height = bBoxHeight

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
    ctx.rotate(rotRad)
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
    ctx.translate(-image.width / 2, -image.height / 2)
    if (filter) {
        ctx.filter(filter);
    }

    // draw rotated image
    ctx.drawImage(image, 0, 0)

    // croppedAreaPixels values are bounding box relative
    // extract the cropped image using these values
    const data = ctx.getImageData(
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height
    )

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // paste generated rotate image at the top left corner
    ctx.putImageData(data, 0, 0)

    // As Base64 string
    // return canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve, reject) => {
        canvas.toBlob((file) => {
            resolve(file)
        }, 'image/jpeg')
    })
}

export const createId = (frontId) => {
    return frontId.toString() + Math.random().toString(16).slice(9)
}

export const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

export async function getFliterImg(
    imageSrc,
    filter = undefined,
) {

}

export const saveImageWithFilter = (url, width, height, style) => {
    const canvas = document.createElement("canvas");
    // const canvas = document.getElementById("myCanvas");
    canvas.style.display = "none";
    const ctx = canvas.getContext('2d');


    canvas.width = width;
    canvas.height = height;

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.width = width;
        img.height = height;
        img.onload = () => {
            ctx.filter = `brightness(${style.brightness}%) 
            invert(${style.invert}%) 
            contrast(${style.contrast}%) 
            grayscale(${style.grayscale}%) 
            saturate(${style.saturate}%)`
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            document.body.appendChild(canvas);
            resolve(canvas.toDataURL("image/jpeg", 0.5));
        }
        img.onerror = e => {
            reject(e)
        }
        img.src = url;
    })
}

// export const saveImageWithFilter = (url, width, height) => {
//     // const canvas = document.createElement("canvas");
//     const canvas = document.getElementById("myCanvas");
//     const ctx = canvas.getContext('2d');
//     const img = new Image();

//     img.width = width;
//     img.height = height;

//     canvas.width = width;
//     canvas.height = height;

//     img.onload = () => {
//         ctx.filter = "brightness(50%)";
//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//         base64 = canvas.toDataURL("image/jpeg", 0.5);
//     }
//     document.body.appendChild(canvas);

//     img.src = url;


//     return canvas.toDataURL();
//     // canvas.toDataURL("image/jpeg", 0.5)

//     // return canvas.toDataURL("image/png");
// }

