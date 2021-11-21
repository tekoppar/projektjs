let ObjectsHasBeenInitialized = false;

function ToggleObjectsHasBeenInitialized(bool) {
    ObjectsHasBeenInitialized = bool;
}

let IsLittleEndian = true;

function DetermineEndian() {
    let imageDataBuf = new ArrayBuffer(4);
    let imageDataBuf8 = new Uint8ClampedArray(imageDataBuf);
    let imageData = new Uint32Array(imageDataBuf);

    imageData[1] = 0x0a0b0c0d;

    if (imageDataBuf[4] === 0x0a && imageDataBuf[5] === 0x0b && imageDataBuf[6] === 0x0c && imageDataBuf[7] === 0x0d)
        IsLittleEndian = false;
}

DetermineEndian();

export { ObjectsHasBeenInitialized, ToggleObjectsHasBeenInitialized, IsLittleEndian };