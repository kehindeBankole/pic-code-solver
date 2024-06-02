async function capture() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const video = document.createElement("video");
  const content = document.getElementById("content");

  try {
    const captureStream = await navigator.mediaDevices.getDisplayMedia();
    video.srcObject = captureStream;
    await video.play();
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context && context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const frame = canvas.toDataURL("image/png");

    captureStream.getTracks().forEach((track) => track.stop());

    let blob = await fetch(frame).then((r) => r.blob());
    const formData = new FormData();
    formData.append("file", blob);

    console.log({
      frame,
      blob,
    });
    if (content) {
      try {
        content.textContent = "loading...";
        const data = await fetch(
          "<base-url>/kehinde/file",
          {
            method: "POST",
            body: formData,
          }
        );
        const res = await data.json();
        content.textContent = res.data;
        console.log({ res });
      } catch (error) {
        content.textContent = "error";
      }
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}
const genbutton = document.getElementById("gen-button");
genbutton?.addEventListener("click", () => {
  capture();
});
