let camera = null;
let hands = null;
let tracking = false;

function inicializarTracking(canvasElement, callbackResultados) {
  if (tracking) return;

  const video = document.getElementById('input_video');

  hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  hands.onResults(callbackResultados);

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: "user",
  };

  navigator.mediaDevices.getUserMedia({ video: videoConstraints })
    .then((stream) => {
      video.srcObject = stream;
      video.play();

      camera = new Camera(video, {
        onFrame: async () => {
          await hands.send({ image: video });
        },
        width: 1280,
        height: 720,
      });

      camera.start();
      tracking = true;
    })
    .catch((error) => {
      console.error("Error al acceder a la cámara:", error);
    });
}
function detenerTracking() {
  if (camera) {
    camera.stop();
    camera = null;
  }
  if (hands) {
    hands.reset();
    hands = null;
  }
  tracking = false;
}
