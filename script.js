const upload = document.getElementById("upload");
const photo = document.getElementById("photo");
const applyBtn = document.getElementById("applyBtn");
const downloadBtn = document.getElementById("downloadBtn");

let finalCanvas = null;

// Mobile detection
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// Resolution limits
const DESKTOP_MAX = { w: 11520, h: 6480 }; // 12K
const MOBILE_MAX  = { w: 7680,  h: 4320 }; // 8K

upload.addEventListener("change", e=>{
  const file = e.target.files[0];
  if(file){
    photo.src = URL.createObjectURL(file);
    photo.style.display = "block";
    setTimeout(cinematic,300);
  }
});

applyBtn.addEventListener("click", cinematic);
downloadBtn.addEventListener("click", downloadImage);

function cinematic(){
  if(!photo.src) return;

  const limit = isMobile ? MOBILE_MAX : DESKTOP_MAX;

  let w = photo.naturalWidth * 4;
  let h = photo.naturalHeight * 4;

  const ratio = Math.min(limit.w / w, limit.h / h, 1);
  w *= ratio;
  h *= ratio;

  finalCanvas = document.createElement("canvas");
  finalCanvas.width = Math.floor(w);
  finalCanvas.height = Math.floor(h);

  const ctx = finalCanvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Background blur
  ctx.filter = "blur(36px) brightness(95%)";
  ctx.drawImage(photo,0,0,w,h);

  // Sky gradient
  const sky = ctx.createLinearGradient(0,0,0,h*0.6);
  sky.addColorStop(0,"rgba(90,170,230,0.6)");
  sky.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle = sky;
  ctx.fillRect(0,0,w,h);

  // Cinematic teal overlay
  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = "rgba(20,110,140,0.35)";
  ctx.fillRect(0,0,w,h);
  ctx.globalCompositeOperation = "source-over";

  // Subject enhancement
  ctx.filter = "contrast(122%) saturate(115%) brightness(107%)";
  ctx.drawImage(photo,0,0,w,h);

  // Vignette
  const v = ctx.createRadialGradient(
    w/2,h/2,w*0.35,
    w/2,h/2,w
  );
  v.addColorStop(0,"rgba(0,0,0,0)");
  v.addColorStop(1,"rgba(0,0,0,0.55)");
  ctx.fillStyle = v;
  ctx.fillRect(0,0,w,h);

  // Preview
  photo.src = finalCanvas.toDataURL("image/jpeg",0.95);
}

function downloadImage(){
  if(!finalCanvas){
    alert("Apply cinematic first!");
    return;
  }

  finalCanvas.toBlob(blob=>{
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cinematic-ultra-hd.jpg";
    a.click();
    URL.revokeObjectURL(a.href);
  },"image/jpeg",1.0);
}
