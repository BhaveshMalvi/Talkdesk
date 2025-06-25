import React, { useEffect, useState } from "react";
import { transformImage } from "../../lib/features";
import { Box, Typography, Button } from "@mui/material";
import { PictureAsPdf as PdfIcon, Download as DownloadIcon, FileOpen } from "@mui/icons-material";

const RenderAttachment = (file, url) => {
  console.log("first", file, url);
  switch (file) {
    case "video":
      return <video src={url} preload="none" width={"250px"} controls></video>;

    case "image":
      return (
        <img
          src={transformImage(url, 200)}
          alt="Attechement"
          width={"250px"}
          height={"150px"}
          style={{
            objectFit: "contain",
          }}
        />
      );

    case "audio":
      return <Box
        sx={{
          width: '100%',              // makes it responsive to parent
          // maxWidth: 400,              // set max size for small devices
          minWidth: 250,              // ensures it's visible on all devices
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <audio
          src={url}
          preload="none"
          controls
          style={{
            width: '100%',
          }}
        />
      </Box>

    //  default:
    //     return <FileOpen />;


    //     default:

    //   const fileName = url.split("/").pop();

    //   // Convert to thumbnail URL
    //   const baseUrl = url.replace("/upload/", "/upload/w_300/pg_1/");
    //   const previewUrl = `${baseUrl}.png`;

    //   // Force download version (optional)
    //   const downloadUrl = url.replace("/upload/", "/upload/fl_attachment/");

    //   return (
    //     <Box
    //       sx={{
    //         width: "100%",
    //         maxWidth: 320,
    //         border: "1px solid #e0e0e0",
    //         borderRadius: 2,
    //         backgroundColor: "#f9f9f9",
    //         p: 1,
    //         overflow: "hidden",
    //       }}
    //     >
    //       {/* Thumbnail Image */}
    //       <Box
    //         component="img"
    //         src={previewUrl}
    //         alt="PDF Preview"
    //         sx={{
    //           width: "100%",
    //           height: "auto",
    //           borderRadius: 1,
    //           objectFit: "contain",
    //           mb: 1,
    //         }}
    //       />

    //       {/* PDF Info */}
    //       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    //         <PdfIcon color="error" />
    //         <Typography variant="body2" noWrap sx={{ fontWeight: 600, flexGrow: 1 }}>
    //           {fileName}
    //         </Typography>
    //       </Box>

    //       {/* Download Button */}
    //       <Button
    //         href={downloadUrl}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         size="small"
    //         startIcon={<DownloadIcon />}
    //         sx={{
    //           mt: 1,
    //           textTransform: "none",
    //           fontSize: "0.75rem",
    //           padding: "2px 8px",
    //         }}
    //       >
    //         View / Download PDF
    //       </Button>
    //     </Box>
    //   );
    // };

    default:
 const [mounted, setMounted] = useState(false);
  const [isValidPdf, setIsValidPdf] = useState(false);

    const fileName = url.split("/").pop();

  // Clean URL: remove fl_attachment to prevent auto-download
  const viewOnlyUrl = url.replace('/upload/fl_attachment/', '/upload/');

  useEffect(() => {
    setMounted(true);
    if (url && url.endsWith('.pdf')) {
      setIsValidPdf(true);
    }
  }, [url]);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 320,
        border: '1px solid #ccc',
        borderRadius: 2,
        backgroundColor: '#fff',
        boxShadow: 1,
        p: 2,
      }}
    >
      {/* PDF Preview */}
      {mounted && isValidPdf && (
        <Box
          sx={{
            width: '100%',
            height: 200,
            borderRadius: 1,
            overflow: 'clip',
            border: '1px solid #eee',
          }}
        >
          <iframe
            src={`${viewOnlyUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            title="PDF Preview"
            width="100%"
            height="100%"
            style={{ border: 'none', overflow:"clip" }}

          />
        </Box>
      )}

      {/* File Name */}
      <Typography
        variant="subtitle2"
        noWrap
        sx={{ mt: 1, fontWeight: 500, color: '#333' }}
      >
        {fileName}
      </Typography>

      {/* Open PDF Button */}
      <Button
        href={viewOnlyUrl}
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        startIcon={<DownloadIcon />}
        sx={{
          mt: 1,
          textTransform: 'none',
          fontSize: '0.8rem',
          px: 1.5,
          py: 0.5,
        }}
      >
        Open PDF
      </Button>
    </Box>
      );




  };

}

export default RenderAttachment;
