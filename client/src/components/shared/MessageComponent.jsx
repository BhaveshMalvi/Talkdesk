// import { Box, Typography } from '@mui/material';

// import React, { memo } from 'react'
// import { lightBlue } from '../../constants/color';
// import moment from 'moment';
// import { fileFormat } from '../../lib/features';
// import RenderAttachment from './RenderAttachment';
// import { motion } from 'framer-motion'

// const MessageComponent = ({ message, user }) => {
//     const { sender, content, attachments = [], createdAt } = message;

//     const sameSender = sender?._id === user?._id

//     const timeAgo = moment(createdAt).fromNow()

//     return (
//         <motion.div
//             initial={{
//                 opacity: 0,
//                 x: "-100%"
//             }}
//             whileInView={{ opacity: 1, x: 0 }}
//             style={{
//                 alignSelf: sameSender ? "flex-end" : "flex-start",
//                 backgroundColor: "white",
//                 color: "black",
//                 borderRadius: "5px",
//                 padding: "0.5rem",
//                 width: "fit-content",
//             }}
//         >
//             {!sameSender && <Typography color={lightBlue} variant='caption' fontWeight={"600"}>{sender.name}</Typography>}
//             {content && <Typography
//                 sx={{
//                     maxHeight: '200px',         
//                     overflowY: 'auto',
//                     wordBreak: 'break-word',    
//                     whiteSpace: 'pre-wrap',
//                     paddingRight: '10px',
//                 }}




//             >{content}</Typography>}

//             {
//                 attachments.length > 0 && (
//                     attachments.map((attechment, index) => {
//                         const url = attechment.url
//                         const file = fileFormat(url);
//                         return <Box key={index}>
//                             <a href={url} target='_blank' download style={{ color: "black" }} >
//                                 {console.log('---', url, file)}
//                                 {RenderAttachment(file, url)}
//                             </a>
//                         </Box>
//                     })
//                 )
//             }
//             <Typography variant='caption' color='text.secondary'>{timeAgo}</Typography>
//         </motion.div>


//     )
// }

// export default memo(MessageComponent)




// ============================= CHAT GPT ==================================================== 



import { Box, Typography, Card, CardContent, Link } from '@mui/material';
import React, { memo } from 'react';
import { lightBlue } from '../../constants/color';
import moment from 'moment';
import { fileFormat } from '../../lib/features';
import RenderAttachment from './RenderAttachment';
import { motion } from 'framer-motion';

const MessageComponent = ({ message, user }) => {
    const { sender, content, attachments = [], createdAt } = message;
    const sameSender = sender?._id === user?._id;
    const timeAgo = moment(createdAt).fromNow();

    return (
        <motion.div
            initial={{ opacity: 0, x: sameSender ? '100%' : '-100%' }}
            whileInView={{ opacity: 1, x: 0 }}
            style={{
                alignSelf: sameSender ? 'flex-end' : 'flex-start',
                margin: '0.5rem 0',
                width: '100%',
                maxWidth: '90%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: sameSender ? 'flex-end' : 'flex-start',
            }}
        >
            <Card
                sx={{
                    backgroundColor: sameSender ? '#E0F7FA' : '#FFFFFF',
                    color: 'black',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    width: 'fit-content',
                    maxWidth: '100%',
                    boxShadow: 3,
                }}
            >
                <CardContent style={{ padding: 0 }}>
                    {/* Sender Name */}
                    {!sameSender && (
                        <Typography color={lightBlue} variant='caption' fontWeight={600}>
                            {sender.name}
                        </Typography>
                    )}

                    {/* Message Content */}
                    {content && (
                        <Typography
                            sx={{
                                maxHeight: '200px',
                                overflowY: 'auto',
                                wordBreak: 'break-word',
                                whiteSpace: 'pre-wrap',
                                fontSize: '0.95rem',
                                mt: 0.5,
                            }}
                        >
                            {content}
                        </Typography>
                    )}

                    {/* Attachments */}
                    {attachments.length > 0 && (
                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {attachments.map((attachment, index) => {
                                const url = attachment.url;
                                const file = fileFormat(url);

                                return (
                                    <Link
                                        key={index}
                                        href={url}
                                        target='_blank'
                                        download
                                        underline="none"
                                        sx={{ color: 'inherit' }}
                                    >
                                        <Box
                                            sx={{
                                                border: '1px solid #e0e0e0',
                                                borderRadius: 1,
                                                p: 1,
                                                backgroundColor: '#f9f9f9',
                                                maxWidth: 300,
                                                width: '100%',
                                            }}


                                        >
                                            <a href={url} target='_blank' download style={{ color: "black" }} >
                                {console.log('---', url, file)}
                                {RenderAttachment(file, url)}
                            </a>
                                        </Box>
                                    </Link>
                                );
                            })}
                        </Box>
                    )}

                    {/* Timestamp */}
                    <Typography
                        variant='caption'
                        color='text.secondary'
                        sx={{ display: 'block', mt: 1, textAlign: 'right', fontSize: '0.75rem' }}
                    >
                        {timeAgo}
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default memo(MessageComponent);
