import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileMenu, setUploadingLoader } from '../redux/reducers/misc'
import { AudioFile as AudioFileIcon, Image as ImageIcon, UploadFile as UploadFileIcon, VideoFile as VideoFileIcon } from '@mui/icons-material'
import toast from 'react-hot-toast'
import { useSendAttachmentsMutation } from '../redux/api/api'

const FileMenu = ({ anchorEl, chatId }) => {

  const { isFileMenu } = useSelector(state => state.misc)
  const imageRef = useRef(null)
  const audioRef = useRef(null)
  const videoRef = useRef(null)
  const fileRef = useRef(null)

  const dispatch = useDispatch()

  const closeFileMenu = () => dispatch(setIsFileMenu(false))

  const selectImage = () => imageRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  const [sendAttachments] = useSendAttachmentsMutation()

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files)

    
    if (files.length <= 0) return;

    if (files.length > 5) return toast.error(`You can only sent 5 ${key} at a time`);
    console.log('before file', files)
    dispatch(setUploadingLoader(true))

    const toastId = toast.loading(`Sending ${key}..`)

    closeFileMenu();

    try {
      // fatching here
      const myForm = new FormData()
      myForm.append('chatId', chatId)
      files.forEach((file) => myForm.append("files", file))

      console.log('files', files)
      const res = await sendAttachments(myForm);

      console.log('res', res)

      if (res.data) toast.success(`${key} sent successfully`, {
        id: toastId
      }) 
    else  
      toast.error(`Failed to sent ${key}` , {id:toastId})

    } catch (error) {
      toast.error(error, { id: toastId })
    } finally {
      dispatch(setUploadingLoader(false))
    }

    // fatching is here




  }

  return (
    <Menu anchorEl={anchorEl} open={isFileMenu} onClose={closeFileMenu} >
      <MenuList>
        <MenuItem onClick={selectImage}>
          <Tooltip title="image">
            <ImageIcon />
          </Tooltip>
          <ListItemText style={{ marginLeft: "0.5rem" }}>Image</ListItemText>
          <input
            type='file'
            multiple
            accept='image/png, image/jpeg, image/gif'
            style={{ display: "none" }}
            onChange={(e) => fileChangeHandler(e, "Images")}
            ref={imageRef}
          />
        </MenuItem>

        <MenuItem onClick={selectAudio} >
          <Tooltip title="Audio">
            <AudioFileIcon />
          </Tooltip>
          <ListItemText style={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
          <input type='file' multiple accept='audio/mpeg, audio/wav' style={{ display: "none" }} onChange={(e) => fileChangeHandler(e, "Audios")} ref={audioRef} />
        </MenuItem>

        <MenuItem onClick={selectVideo}>
          <Tooltip title="Video">
            <VideoFileIcon />
          </Tooltip>
          <ListItemText style={{ marginLeft: "0.5rem" }}>Video</ListItemText>
          <input type='file' multiple accept='video/mp4, video/webm, video/ogg' style={{ display: "none" }} onChange={(e) => fileChangeHandler(e, "Videos")} ref={videoRef} />
        </MenuItem>

        <MenuItem onClick={selectFile}>
          <Tooltip title="File">
            <UploadFileIcon />
          </Tooltip>
          <ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
          <input type='file' multiple accept='*' style={{ display: "none" }} onChange={(e) => fileChangeHandler(e, "Files")} ref={fileRef} />
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default FileMenu