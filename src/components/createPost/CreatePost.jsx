import React, { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { IoDuplicateOutline, IoImageOutline, IoResizeSharp } from 'react-icons/io5';
import { IoClose } from "react-icons/io5";
import { FiArrowLeft } from "react-icons/fi";
import { useDropzone } from 'react-dropzone'
import Cropper from 'react-easy-crop'
import { Menu, Transition } from '@headlessui/react'
import { BiSquareRounded } from 'react-icons/bi';
import { TbRectangle, TbRectangleVertical } from 'react-icons/tb';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import DiscardConfirm from './DiscardConfirm';
import { HiOutlinePlus } from 'react-icons/hi';
import { MdOutlineClose } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import getCroppedImg, { createId, dataURLtoFile, saveImageWithFilter } from './hanldCropImage';
import { toast } from 'react-toastify';
import filterSrc from "../../images/Normal.jpg";
import { BsEmojiSmile } from "react-icons/bs";
import { MdDone } from "react-icons/md";
import axios from 'axios';
import AuthContext from '../../context/AuthProvider';


function CreatePost({ onClickCreate }) {
    const [postStep, setpostStep] = useState(0);
    const [image, setImage] = useState([]);
    const [cropprArea, setCropprArea] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState(1);
    const [currentImage, setCurrentImage] = useState();
    const currentImageIndex = useRef(0);
    const [checkDisCard, setcheckDisCard] = useState(false);
    const [cropImage, setcropImage] = useState([]);
    const [editTab, setEditTab] = useState('filters');
    const [brightnessNum, setBrightnessNum] = useState(100);
    const [invertNum, setInvertNum] = useState(0);
    const [contrastNum, setContrastNum] = useState(100);
    const [grayscaleNum, setGrayscaleNum] = useState(0);
    const [saturateNum, setSaturateNum] = useState(100);
    const [selectedFilter, setSelectedFilter] = useState({});
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [caption, setCaption] = useState("");
    const formData = useRef(new FormData());
    const [initialCroppedArea, setInitialCroppedArea] = useState(undefined);
    const { Auth } = useContext(AuthContext);

    useEffect(() => {
        document.title = "Create new post • Instagram"

        return () => {
            document.title = "Instagram"
        }
    }, [])


    const filters = [
        {
            style: {
                brightness: 50,
                invert: 0,
                contrast: 100,
                grayscale: 15,
                saturate: 100
            }, name: "Origin1"
        },
        {
            style: {
                brightness: 100,
                invert: 0,
                contrast: 100,
                grayscale: 0,
                saturate: 100.
            }, name: "Origin2"
        },
    ]

    // Switch image
    const onNextImage = (showList) => {
        if (currentImageIndex.current < image.length - 1) {
            currentImageIndex.current = currentImageIndex.current + 1;
            setCurrentImage({
                url: showList[currentImageIndex.current].url,
                num: showList[currentImageIndex.current].num,
                croppedAreaPixels: showList[currentImageIndex.current].croppedAreaPixels,
            });
        }

        if (postStep === 1) {
            console.log(showList[currentImageIndex.current]);
            setInitialCroppedArea(showList[currentImageIndex.current].croppedArea)
        }

        if (postStep === 2) {
            // Let menual filter
            const EditImage = cropImage.find(img => img.num === showList[currentImageIndex.current].num);
            setBrightnessNum(EditImage.style.brightness);
            setInvertNum(EditImage.style.invert);
            setContrastNum(EditImage.style.contrast);
            setGrayscaleNum(EditImage.style.grayscale);
            setSaturateNum(EditImage.style.saturate);

            // Let default filter
            const filter = filters.find(item => item.name === showList[currentImageIndex.current].filter);
            setSelectedFilter(filter);
        }
    }

    const onBackImage = (showList) => {
        if (currentImageIndex.current > 0) {
            currentImageIndex.current = currentImageIndex.current - 1;
            setCurrentImage({
                url: showList[currentImageIndex.current].url,
                num: showList[currentImageIndex.current].num,
                croppedAreaPixels: showList[currentImageIndex.current].croppedAreaPixels,
            });
        }

        if (postStep === 1) {
            setInitialCroppedArea(showList[currentImageIndex.current].croppedArea)
            console.log(showList[currentImageIndex.current]);
        }

        if (postStep === 2) {
            // Let menual filter
            const EditImage = cropImage.find(img => img.num === showList[currentImageIndex.current].num);
            setBrightnessNum(EditImage.style.brightness);
            setInvertNum(EditImage.style.invert);
            setContrastNum(EditImage.style.contrast);
            setGrayscaleNum(EditImage.style.grayscale);
            setSaturateNum(EditImage.style.saturate);

            // Let default filter
            const filter = filters.find(item => item.name === showList[currentImageIndex.current].filter);
            setSelectedFilter(filter);
        }
    }


    // Switch post step
    const onClickNextStep = async () => {
        if (postStep >= 4) return;
        if (postStep === 1) {
            await onSaveCropImage();
        }

        setpostStep(step => step + 1);
        currentImageIndex.current = 0;
    }

    const onClickPreStep = () => {
        if (postStep > 0) {
            if (postStep === 1) {
                setcheckDisCard(true);
                return;
            }

            if (postStep === 2) {
                currentImageIndex.current = 0;
                setCurrentImage({
                    url: image[0].url,
                    num: image[0].num,
                    croppedAreaPixels: image[0].croppedAreaPixels
                });
            }

            // if (postStep === 2) {
            //     currentImageIndex.current = 0;
            // }
            currentImageIndex.current = 0;

            setpostStep(step => step - 1);
        }
    }

    // Confrim discard post
    const onConfirmDisCard = () => {
        setImage([]);
        setCurrentImage({});
        setcropImage({});
        currentImageIndex.current = 0;

        // Delete all image and select new image
        if (postStep === 1) {
            setpostStep(step => step - 1);
            return;
        }

        // Close create tab
        onClickCreate();

    }

    const onCancelDiscard = () => {
        setcheckDisCard(false);
    }

    // Hanld image
    const onRemoveImage = (removeIndex) => {
        if (image.length === 1) {
            setCurrentImage({});
            setImage([]);
            return;
        }
        setImage(image => image.filter((image, index) => index !== removeIndex));

        if (removeIndex === 0) {
            setCurrentImage({
                url: image[1].url,
                num: image[1].num,
                croppedAreaPixels: image[1].croppedAreaPixels
            });
            currentImageIndex.current = 0;
        }
        else {
            setCurrentImage({
                url: image[removeIndex - 1].url,
                num: image[removeIndex - 1].num,
                croppedAreaPixels: image[removeIndex - 1].croppedAreaPixels
            });
            currentImageIndex.current = removeIndex - 1;
        }
    }

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        if (currentImage) {
            const cropImage = image.find(img => img.num === currentImage.num);
            if (cropImage) {
                cropImage.croppedArea = croppedArea;
                cropImage.croppedAreaPixels = croppedAreaPixels;
            }
            console.log(cropImage);
        }
    }

    useEffect(() => {
        const cropImage = image.find(img => img.num === currentImage.num);
        if (cropImage && cropImage.croppedArea) {
            setInitialCroppedArea(cropImage.croppedArea);
        }
    }, [currentImage])


    const onClickCloseCreatePost = () => {

        if (postStep === 5) {
            onClickCreate();
            return
        }
        if (image.length > 0) {
            setcheckDisCard(true);
            return;
        }
        onClickCreate();
    }

    const toastOption = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const onSaveCropImage = async () => {
        try {
            let newCropImages = [];
            for (let index = 0; index < image.length; index++) {
                const croppedImage = await getCroppedImg(
                    image[index].url,
                    image[index].croppedAreaPixels,
                )
                const newCropImg = {
                    url: URL.createObjectURL(croppedImage),
                    num: image[index].num,
                    style: {
                        brightness: 100,
                        invert: 0,
                        contrast: 100,
                        grayscale: 0,
                        saturate: 100
                    },
                    filter: undefined,
                }
                const updateImageCrop = newCropImages.find(cropImg => cropImg.num === newCropImg.num);
                if (updateImageCrop) {
                    updateImageCrop.url = newCropImg.url;
                } else {
                    newCropImages.push(newCropImg);
                }
                if (index === 0) {
                    setCurrentImage(newCropImg);
                }
            }


            setcropImage(newCropImages);
        } catch (error) {
            toast.error("Error to Crop", toastOption)
            console.error(error);
        }
    }

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles) {
            setpostStep(1);
            acceptedFiles.map((file, index) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);

                const newImg = new Image();
                newImg.src = URL.createObjectURL(file);
                const num = createId("ID");
                newImg.onload = () => {
                    const newImage = {
                        url: URL.createObjectURL(file),
                        num: num,
                        croppedAreaPixels: {
                            width: newImg.height,
                            height: newImg.height,
                            x: 0,
                            y: 0
                        }
                    }
                    console.log(newImage);
                    setImage(images => [...images, newImage]);
                };
                if (index === 0) {
                    setCurrentImage({
                        url: URL.createObjectURL(file),
                        num: num,
                        croppedAreaPixels: {
                            width: newImg.height,
                            height: newImg.height,
                            x: 0,
                            y: 0
                        }
                    });
                }
            })
            currentImageIndex.current = image.length;
        }
    }, [])

    // Edit Image
    const changeBrightness = (value) => {
        const formatValue = (Number(value) + 100);
        setBrightnessNum(formatValue);
        const editedImage = cropImage.find(img => img.num === currentImage.num);
        if (editedImage) {
            editedImage.style.brightness = formatValue;
        }
    }

    const changeSaturate = (value) => {
        const formatValue = (Number(value) + 100);
        setSaturateNum(formatValue);
        const editedImage = cropImage.find(img => img.num === currentImage.num);
        if (editedImage) {
            editedImage.style.saturate = formatValue;
        }

    }

    const changeInvert = (value) => {
        setInvertNum(Number(value));
        const editedImage = cropImage.find(img => img.num === currentImage.num);
        if (editedImage) {
            editedImage.style.invert = Number(value);
        }
    }

    const changeContrast = (value) => {
        const formatValue = (Number(value) + 100);
        setContrastNum(formatValue);
        const editedImage = cropImage.find(img => img.num === currentImage.num);
        if (editedImage) {
            editedImage.style.contrast = formatValue;
        }
    }

    const changesetGrayscale = (value) => {
        setGrayscaleNum(Number(value));
        const editedImage = cropImage.find(img => img.num === currentImage.num);
        if (editedImage) {
            editedImage.style.grayscale = Number(value);
        }
    }

    let imgStyle = {
        filter: `brightness(${brightnessNum}%) 
        invert(${invertNum}%) 
        contrast(${contrastNum}%) 
        grayscale(${grayscaleNum}%) 
        saturate(${saturateNum}%)`
    }

    const onClickFilter = (selectFilter) => {
        setSelectedFilter(selectFilter)
        setBrightnessNum(selectFilter.style.brightness);
        setInvertNum(selectFilter.style.invert);
        setContrastNum(selectFilter.style.contrast);
        setGrayscaleNum(selectFilter.style.grayscale);
        setSaturateNum(selectFilter.style.saturate);
        const editedImage = cropImage.find(img => img.num === currentImage.num);
        if (editedImage) {
            editedImage.style = selectFilter.style;
            editedImage.filter = selectFilter.name;
        }
        // console.log(selectFilter);
    }

    const { getInputProps } = useDropzone({ onDrop });
    const postStepHeader = [
        { title: "Create new post" },
        { title: "Crop", left: <FiArrowLeft onClick={onClickPreStep} className='text-2xl hover: cursor-pointer' />, right: <h1 onClick={onClickNextStep} className='font-medium hover:cursor-pointer transition-all text-blue-500 hover:text-black'>Next</h1> },
        { title: "Edit", left: <FiArrowLeft onClick={onClickPreStep} className='text-2xl hover: cursor-pointer' />, right: <h1 onClick={onClickNextStep} className='font-medium hover:cursor-pointer transition-all text-blue-500 hover:text-black'>Next</h1> },
        { title: "Create new post", left: <FiArrowLeft onClick={onClickPreStep} className='text-2xl hover: cursor-pointer' />, right: <h1 onClick={() => onPostSubmit(formData)} className='font-medium hover:cursor-pointer transition-all text-blue-500 hover:text-black'>Share</h1> },
        { title: "Sharing", left: undefined, right: undefined },
        { title: "Post shared", left: undefined, right: undefined },
    ]

    // console.log(cropImage);

    // postSubmit
    const onPostSubmit = async () => {
        formData.current.append("user_id", Auth._id);
        formData.current.append("caption", caption);
        for (let index = 0; index < cropImage.length; index++) {
            console.log(cropImage[index]);
            const cropImageTag = document.getElementById("crop-image");
            const base64 = await saveImageWithFilter(cropImage[index].url, cropImageTag.naturalWidth, cropImageTag.naturalHeight, cropImage[index].style);
            const imgFilte = dataURLtoFile(base64, `imgNumber${index}.jpeg`);
            formData.current.append("images", imgFilte);
        }

        // for (const value of formData.current.values()) {
        //     console.log(value);
        // }

        try {
            setpostStep(4)
            const result = await axios.post("http://localhost:5000/post", formData.current);
            if (result.data.status === true) {

                //clean formData
                formData.current.delete("user_id");
                formData.current.delete("caption");
                for (let index = 0; index < cropImage.length; index++) {
                    formData.current.delete("images");
                }

                setpostStep(5);
                return;
            }
        } catch (error) {
            toast.error("Error post", toastOption);
            console.log(error);
        }
    }

    // console.log(cropImage);

    return (
        <>
            {checkDisCard ? <DiscardConfirm onConfirmDisCard={onConfirmDisCard} onCancelDiscard={onCancelDiscard} /> : undefined}
            <div className='xl:w-[84%] xl:pl-0 md:w-full md:pl-[75px] z-20 right-0 w-full h-full bg-[#59595968] fixed'>
                <div className='w-full h-full p-3 flex justify-center items-center' >
                    <IoClose className='text-3xl right-3 top-3 absolute text-white hover:cursor-pointer' onClick={onClickCloseCreatePost} />
                    <div className='container animate-waving-hand overflow-hidden min-h-[390px] bg-white 2xl:max-w-5/12 md:w-auto md:min-w-[800px] rounded-xl h-[75%]'>
                        <div className='w-full h-[8%] border-b border-[#e4e4e4] flex justify-between px-4 items-center'>
                            {postStepHeader[postStep].left ? postStepHeader[postStep].left : undefined}
                            <h3 className='font-medium m-auto'> {postStepHeader[postStep].title} </h3>
                            {postStepHeader[postStep].right ? postStepHeader[postStep].right : undefined}
                        </div>
                        <div className='w-full md:min-w-[475px] relative h-[92%] gap-1 flex-col flex justify-center items-center'>
                            {
                                image.length === 0 ?
                                    // Step 0: Select image
                                    <>
                                        <IoImageOutline className='text-7xl outline-none' />
                                        <h4 className='text-xl lg:text-2xl font-light'>Add photos and videos here</h4>
                                        <label htmlFor='input-video-image' className='mt-10 px-6 py-2 bg-blue-400 hover:bg-blue-500 hover:cursor-pointer transition-all rounded-lg font-medium text-white'>
                                            <input type="file" id="input-video-image" {...getInputProps()} />
                                            Select on your device
                                        </label>
                                    </>
                                    : undefined
                            }

                            {image.length > 0 && postStep === 1 ?
                                // Step 1: Crop Image
                                <div className='animate-waving-hand w-full h-full absolute bottom-0'>
                                    {currentImage !== undefined ? <Cropper initialCroppedAreaPercentages={initialCroppedArea} onCropComplete={onCropComplete} objectFit="contain" image={currentImage.url} crop={crop} zoom={zoom} aspect={aspect} onCropChange={setCrop} onZoomChange={setZoom} /> : undefined}
                                    {image.length > 1 && currentImageIndex.current < image.length - 1
                                        ? <>
                                            <span onClick={() => onNextImage(image)} className="w-7 right-[2%] top-1/2 absolute bg-[#333432ae] hover:cursor-pointer z-10 flex justify-center items-center text-white text-sm h-7 rounded-full">
                                                <IoIosArrowForward />
                                            </span>
                                        </>
                                        : undefined}
                                    {image.length > 1 && currentImageIndex.current !== 0
                                        ? <>
                                            <span onClick={() => onBackImage(image)} className="w-7 left-[2%] top-1/2 absolute bg-[#333432ae] hover:cursor-pointer z-10 flex justify-center items-center text-white text-sm h-7 rounded-full">
                                                <IoIosArrowBack />
                                            </span>
                                        </>
                                        : undefined}

                                    <Menu as="div" className="w-[30%] flex absolute bottom-[2%] left-[2%]">
                                        <Menu.Button className={"w-7 hover:bg-[#00000098] transition-all bg-[#333432ae] flex justify-center items-center text-white text-sm h-7 rounded-full"}>
                                            <IoResizeSharp />
                                        </Menu.Button>

                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >

                                            <Menu.Items className="absolute flex flex-col gap-[2px] bottom-9 z-10 origin-top-right ">

                                                <Menu.Item onClick={() => setAspect(1)}>
                                                    <div className='h-6 flex text-white items-center text-md hover:bg-[#333432c4] transition-all rounded-tr-xl rounded-tl-xl font-medium gap-5 px-3 hover:cursor-pointer py-5 w-24 bg-[#333432ae] '>
                                                        1:1
                                                        <BiSquareRounded className='text-xl' />
                                                    </div>
                                                </Menu.Item>

                                                <Menu.Item onClick={() => setAspect(4 / 5)}>
                                                    <div className='h-6 flex text-white items-center text-md hover:bg-[#333432c4] transition-all font-medium gap-5 px-3 hover:cursor-pointer py-5 w-24 bg-[#333432ae] '>
                                                        4:5
                                                        <TbRectangleVertical className='text-xl' />
                                                    </div>
                                                </Menu.Item>

                                                <Menu.Item onClick={() => setAspect(16 / 9)}>
                                                    <div className='h-6 flex text-white items-center text-md hover:bg-[#333432c4] transition-all rounded-br-xl rounded-bl-xl font-medium gap-5 px-3 hover:cursor-pointer py-5 w-24 bg-[#333432ae] '>
                                                        16:9
                                                        <TbRectangle className='text-xl' />
                                                    </div>
                                                </Menu.Item>
                                            </Menu.Items>

                                        </Transition>
                                    </Menu>
                                    <input type="file" id="input-video-image-popup" {...getInputProps()} />
                                    <Menu as="div" className="w-[30%] flex absolute bottom-[2%] right-[2%] justify-end">
                                        <Menu.Button className={"w-7 hover:bg-[#00000098] transition-all bg-[#333432ae] flex justify-center items-center text-white text-sm h-7 rounded-full"}>
                                            <IoDuplicateOutline />
                                        </Menu.Button>

                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >

                                            <Menu.Items className="absolute flex gap-2 bottom-9 p-2 rounded-md z-10 origin-top-right bg-[#333432ae]">
                                                {image.map((img, index) =>
                                                    <Menu.Item key={uuidv4()}>
                                                        <div className='h-28 w-28 relative bg-[#333432] hover:cursor-pointer'>
                                                            <span onClick={() => onRemoveImage(index)} className='w-5 flex hover:bg-[#333432ae] right-1 top-1 transition-all justify-center items-center rounded-full absolute h-5 bg-[#00000098] hover:cursor-pointer text-white'>
                                                                <MdOutlineClose className='text-sm' />
                                                            </span>
                                                            <img src={img.url} alt="img" className='animate-waving-hand w-full h-full object-cover' />
                                                        </div>
                                                    </Menu.Item>
                                                )}

                                                <Menu.Item>
                                                    <label htmlFor='input-video-image-popup' className='hover:cursor-pointer transition-all w-12 h-12 m-auto border-white border-solid border-[1px] rounded-full flex justify-center items-center'>
                                                        <HiOutlinePlus className='text-2xl text-white' />
                                                    </label>
                                                </Menu.Item>
                                            </Menu.Items>

                                        </Transition>
                                    </Menu>
                                </div>
                                :
                                undefined
                            }

                            {
                                postStep === 2
                                    ?
                                    // Step 2: Edit Image
                                    <div className='animate-waving-hand flex xl:w-[835px] w-full h-full'>
                                        <div className='w-[60%] h-full bg-[#fafafa] relative'>
                                            <img src={currentImage.url} alt="" style={imgStyle} className={`h-[100%] m-auto blur-[0] opacity-[1]`} />
                                            {/* <img src={currentImage.url} alt="" className='' /> */}
                                            {cropImage.length > 1 && currentImageIndex.current < cropImage.length - 1
                                                ? <>
                                                    <span onClick={() => onNextImage(cropImage)} className="w-7 right-[2%] top-1/2 absolute bg-[#333432ae] hover:cursor-pointer z-10 flex justify-center items-center text-white text-sm h-7 rounded-full">
                                                        <IoIosArrowForward />
                                                    </span>
                                                </>
                                                : undefined}
                                            {cropImage.length > 1 && currentImageIndex.current !== 0
                                                ? <>
                                                    <span onClick={() => onBackImage(cropImage)} className="w-7 left-[2%] top-1/2 absolute bg-[#333432ae] hover:cursor-pointer z-10 flex justify-center items-center text-white text-sm h-7 rounded-full">
                                                        <IoIosArrowBack />
                                                    </span>
                                                </>
                                                : undefined}
                                        </div>

                                        <div className='w-[40%] h-full bg-[#fafafa] border-l'>

                                            {/* Switch Tab Button */}
                                            <div className='w-full  border-b-[1px]'>
                                                <button onClick={() => setEditTab("filters")} className={editTab === "filters" ? "w-1/2 py-2 transition-all font-medium text-[#00376b]" : "w-1/2 py-2 transition-all font-medium text-[#b3c3d3]"} >
                                                    Filters
                                                </button>
                                                <button onClick={() => setEditTab("adjustments")} className={editTab === "adjustments" ? "w-1/2 py-2 transition-all font-medium text-[#00376b]" : "w-1/2 py-2 transition-all font-medium text-[#b3c3d3]"}>
                                                    Adjustments
                                                </button>
                                            </div>

                                            <div className='w-full h-[435px]'>

                                                {/* Edit element */}
                                                {
                                                    editTab === "adjustments" ?
                                                        <>
                                                            <div className='w-full h-20 flex flex-col justify-between px-4 py-3'>
                                                                <div className='w-full group flex justify-between'>
                                                                    <h3 className='font-normal'>Brightness</h3>
                                                                    <h3 onClick={() => setBrightnessNum(100)} className='hidden font-medium hover:cursor-pointer transition-all group-hover:block text-blue-500 hover:text-black'>Reset</h3>
                                                                </div>

                                                                <div className='w-full flex gap-2 justify-center items-center'>
                                                                    <input
                                                                        value={brightnessNum - 100}
                                                                        step="1"
                                                                        list="markers"
                                                                        type="range" min="-100" max="100"
                                                                        className='hover:cursor-pointer 
                                                            block
                                                        bg-gradient-to-r w-[95%] h-1 range-sm rounded-lg 
                                                        appearance-none 
                                                        bg-gray-200'
                                                                        onChange={(e) => changeBrightness(e.target.value)}
                                                                    />

                                                                    <p className='w-[5%] text-right'>{brightnessNum - 100} </p>
                                                                </div>
                                                            </div>

                                                            <div className='w-full h-20 flex flex-col justify-between px-4 py-3'>
                                                                <div className='w-full group flex justify-between'>
                                                                    <h3 className='font-normal'>Saturate</h3>
                                                                    <h3 onClick={() => setSaturateNum(100)} className='hidden font-medium hover:cursor-pointer transition-all group-hover:block text-blue-500 hover:text-black'>Reset</h3>
                                                                </div>

                                                                <div className='w-full flex gap-2 justify-center items-center'>
                                                                    <input
                                                                        value={saturateNum - 100}
                                                                        step="1"
                                                                        list="markers"
                                                                        type="range" min="-100" max="100"
                                                                        className='hover:cursor-pointer 
                                                            block
                                                        bg-gradient-to-r w-[95%] h-1 range-sm rounded-lg 
                                                        appearance-none 
                                                        bg-gray-200'
                                                                        onChange={(e) => changeSaturate(e.target.value)}
                                                                    />

                                                                    <p className='w-[5%] text-right'>{saturateNum - 100} </p>
                                                                </div>
                                                            </div>

                                                            <div className='w-full h-20 flex flex-col justify-between px-4 py-3'>
                                                                <div className='w-full group flex justify-between'>
                                                                    <h3 className='font-normal'>Invert</h3>
                                                                    <h3 onClick={() => setInvertNum(0)} className='hidden font-medium hover:cursor-pointer transition-all group-hover:block text-blue-500 hover:text-black'>Reset</h3>
                                                                </div>

                                                                <div className='w-full flex gap-2 justify-center items-center'>
                                                                    <input
                                                                        value={invertNum}
                                                                        step="1"
                                                                        list="markers"
                                                                        type="range" min="0" max="100"
                                                                        className='hover:cursor-pointer 
                                                            block
                                                        bg-gradient-to-r w-[95%] h-1 range-sm rounded-lg 
                                                        appearance-none 
                                                        bg-gray-200'
                                                                        onChange={(e) => changeInvert(e.target.value)}
                                                                    />

                                                                    <p className='w-[5%] text-right'>{invertNum} </p>
                                                                </div>
                                                            </div>

                                                            <div className='w-full h-20 flex flex-col justify-between px-4 py-3'>
                                                                <div className='w-full group flex justify-between'>
                                                                    <h3 className='font-normal'>Contrast</h3>
                                                                    <h3 onClick={() => setContrastNum(100)} className='hidden font-medium hover:cursor-pointer transition-all group-hover:block text-blue-500 hover:text-black'>Reset</h3>
                                                                </div>

                                                                <div className='w-full flex gap-2 justify-center items-center'>
                                                                    <input
                                                                        value={contrastNum - 100}
                                                                        step="1"
                                                                        list="markers"
                                                                        type="range" min="0" max="100"
                                                                        className='hover:cursor-pointer 
                                                            block
                                                        bg-gradient-to-r w-[95%] h-1 range-sm rounded-lg 
                                                        appearance-none 
                                                        bg-gray-200'
                                                                        onChange={(e) => changeContrast(e.target.value)}
                                                                    />

                                                                    <p className='w-[5%] text-right'>{contrastNum - 100} </p>
                                                                </div>
                                                            </div>

                                                            <div className='w-full h-20 flex flex-col justify-between px-4 py-3'>
                                                                <div className='w-full group flex justify-between'>
                                                                    <h3 className='font-normal'>Grayscale</h3>
                                                                    <h3 onClick={() => setGrayscaleNum(0)} className='hidden font-medium hover:cursor-pointer transition-all group-hover:block text-blue-500 hover:text-black'>Reset</h3>
                                                                </div>

                                                                <div className='w-full flex gap-2 justify-center items-center'>
                                                                    <input
                                                                        value={grayscaleNum}
                                                                        step="1"
                                                                        list="markers"
                                                                        type="range" min="0" max="100"
                                                                        className='hover:cursor-pointer 
                                                            block
                                                        bg-gradient-to-r w-[95%] h-1 range-sm rounded-lg 
                                                        appearance-none 
                                                        bg-gray-200'
                                                                        onChange={(e) => changesetGrayscale(e.target.value)}
                                                                    />

                                                                    <p className='w-[5%] text-right'>{grayscaleNum} </p>
                                                                </div>
                                                            </div>
                                                        </>
                                                        :
                                                        <div className='w-full justify-between flex flex-wrap hover:cursor-pointer px-3'>
                                                            {
                                                                filters.map((filter, index) =>
                                                                    <div key={uuidv4()} onClick={() => onClickFilter(filter)} className='w-[30%] mt-3 h-auto  overflow-hidden'>
                                                                        <div className={selectedFilter && filter.name === selectedFilter.name ? "w-full border p-[2px] border-blue-500 rounded-sm" : "w-full"} >
                                                                            <img src={filterSrc} alt="img" className='w-full' />
                                                                        </div>
                                                                        <h4 className={selectedFilter && filter.name === selectedFilter.name ? 'text-xs text-center font-medium text-gray-900' : 'text-xs text-center font-normal text-gray-600'}> {filter.name} </h4>
                                                                    </div>
                                                                )}
                                                        </div>
                                                }
                                            </div>


                                        </div>
                                    </div>
                                    : undefined
                            }

                            {
                                postStep === 3
                                    ?
                                    // Step 2: Edit Image
                                    <div className='animate-waving-hand flex xl:w-[835px] w-full h-full'>
                                        <div className='w-[60%] h-full bg-[#fafafa] relative'>
                                            <img src={currentImage.url} id="crop-image" alt="" style={imgStyle} className={`h-[100%] m-auto blur-[0] opacity-[1]`} />
                                            {/* <img src={currentImage.url} alt="" className='' /> */}
                                            {cropImage.length > 1 && currentImageIndex.current < cropImage.length - 1
                                                ? <>
                                                    <span onClick={() => onNextImage(cropImage)} className="w-7 right-[2%] top-1/2 absolute bg-[#333432ae] hover:cursor-pointer z-10 flex justify-center items-center text-white text-sm h-7 rounded-full">
                                                        <IoIosArrowForward />
                                                    </span>
                                                </>
                                                : undefined}
                                            {cropImage.length > 1 && currentImageIndex.current !== 0
                                                ? <>
                                                    <span onClick={() => onBackImage(cropImage)} className="w-7 left-[2%] top-1/2 absolute bg-[#333432ae] hover:cursor-pointer z-10 flex justify-center items-center text-white text-sm h-7 rounded-full">
                                                        <IoIosArrowBack />
                                                    </span>
                                                </>
                                                : undefined}
                                        </div>

                                        <div className='w-[40%] h-full bg-[#fafafa] border-l py-3'>
                                            <div className='w-full flex items-center gap-2 font-medium px-3'>
                                                <div className='w-[30px] h-[30px] bg-slate-900 rounded-full'>

                                                </div>
                                                <h2>baominh.129</h2>
                                            </div>
                                            <textarea cols="30" rows="10" maxLength="800" onChange={e => setCaption(e.target.value)} className='px-3 w-full mt-3 bg-[#fafafa] outline-none resize-none' placeholder='Write a caption...'></textarea>
                                            <div className='w-full p-2 border-b flex justify-between' >
                                                <BsEmojiSmile />
                                                <h3>{caption.length}/800</h3>
                                            </div>
                                        </div>
                                    </div>
                                    : undefined
                            }

                            {
                                postStep === 4 ?
                                    <div className='animate-waving-hand flex xl:w-[835px] justify-center items-center w-full h-full'>
                                        <div className="h-20 w-20 rounded-full p-2 border-4 animate-spin border-t-red-400 border-t-1 ">
                                        </div>
                                    </div>
                                    : undefined
                            }

                            {
                                postStep === 5 ?
                                    <div className='animate-waving-hand flex xl:w-[835px] gap-3 flex-col justify-center items-center w-full h-full'>
                                        <div className="h-20 w-20 rounded-full border-4 border-red-400">
                                            <MdDone className='w-full h-full text-red-400' />
                                        </div>

                                        <h2 className='font-medium'>
                                            Done!
                                        </h2>
                                    </div>
                                    : undefined
                            }
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default CreatePost