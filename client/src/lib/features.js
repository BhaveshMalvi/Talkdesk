import moment from "moment";

const fileFormat = (url="") => {
    const fileExt = url.split(".").pop();
    
    console.log('12',  url, fileExt)

    if(fileExt === "mp4" || fileExt==="webm" || fileExt==="ogg")
        return "video";

    if(fileExt === "mp3" || fileExt==="wav" || fileExt==="audio")
        return "audio";

    if(fileExt === "png" || fileExt==="jpg" || fileExt==="jpeg" || fileExt==="gif")
        return "image";

    return "file"

}


const transformImage= (url = "", width = 100) => {
    // console.log("url", url )

    const newUrl = url?.replace('upload/', `upload/dpr_auto/w_${width}/`) 

    return newUrl
}


const getLast7Days = () => {
    const currentData = moment();

    const last7Days = []

    for (let i = 0; i < 7; i++) {
     const dayDate = currentData.clone().subtract(i, "days");
     const dayName = dayDate.format("dddd")
     
     last7Days.unshift(dayName)
    }

    return last7Days;
}


const getOrSaveFromStorage = ({ key, value, get}) => {

    if (get) return localStorage.getItem(key)? JSON.parse(localStorage.getItem(key)) : null;
    else localStorage.setItem(key, JSON.stringify(value))
}

export {fileFormat, transformImage, getLast7Days, getOrSaveFromStorage}