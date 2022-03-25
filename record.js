let start = document.getElementById('start'),
    stop  = document.getElementById('stop'),
    mediaRecorder,filename,count=1,interval,stream,tt;

    let mimeType = 'video/webm';
start.addEventListener('click', async function(){
    filename = window.prompt('Enter file name')
    stream = await recordScreen();
    mediaRecorder = createRecorder(stream, mimeType);
  let node = document.getElementsByTagName("p")[0];
    node.textContent = "Started recording";
    node.style.backgroundColor = "green";
    start.disabled = true;
    stop.disabled = false;
    const timeWriter=document.getElementsByTagName("div")[0];
    let time=0;
    interval = setInterval(function(){
        time++;
        timeWriter.innerHTML = time;
    },1000);
})

stop.addEventListener('click', function(){
    mediaRecorder.stop();
    clearInterval(interval);
    
    let node = document.getElementsByTagName("p")[0];
    node.textContent = "Stopped recording";
    node.style.backgroundColor = "red";
})

async function recordScreen() {
    return await navigator.mediaDevices.getDisplayMedia({
        audio: true, 
        video: { mediaSource: "screen"}
    });
}

function createRecorder (stream) {
  // the stream data is stored in this array
  let recordedChunks = []; 

  const mediaRecorder = new MediaRecorder(stream,{
    mimeType
  });
    tt=parseFloat(document.getElementById("t").value??1);
  mediaRecorder.ondataavailable = function (e) {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }  
    if(recordedChunks.length > 5*60*tt){
      saveFile(recordedChunks);
        recordedChunks = [];
    }
  };
  mediaRecorder.onstop = function () {
     saveFile(recordedChunks);
     recordedChunks = [];
  };
  mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
  return mediaRecorder;
}

function saveFile(recordedChunks){

   const blob = new Blob(recordedChunks, {
      type: mimeType
    });
    
        downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${filename} ${count}${count==1?"st":count==2?"nd":count==3?"rd":"th"} ${tt} min.mp4`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(blob); // clear from memory
    document.body.removeChild(downloadLink);
    count++
}