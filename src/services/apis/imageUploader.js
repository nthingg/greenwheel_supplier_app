export const addPosts = async (file) => {
  try {
    console.log(file);
    const response = await fetch(
      "https://oafr1w3y52.execute-api.ap-southeast-2.amazonaws.com/default/btss-getPresignedUrl",
      {
        method: "PUT",
        headers: {
          "Content-Type": "image/jpeg",
          // Accept: "*/*",
          // "Accept-Encoding": "gzip, deflate, br",
          // Connection: "keep-alive",
        },
        body: file,
      }
    );

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response}`);
    // }
    const data = await response.json();
    console.log(data.fileName);
    // return `https://btss-uploads.s3.ap-southeast-2.amazonaws.com/${data.fileName}`; // Return the filename
    return data.fileName;
  } catch (err) {
    console.error("Error adding post:", err);
  }
};
