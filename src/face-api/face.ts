import * as faceapi from 'face-api.js';

const maxDescriptorDistance = 0.5;

export const loadModels = async () => {
  const MODEL_URL = `${process.env.PUBLIC_URL}/models`;
  await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
  await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
};

export const getFullFaceDescription = async (blob: any, inputSize = 512) => {
  // tiny_face_detector options
  const scoreThreshold = 0.5;
  const OPTION = new faceapi.TinyFaceDetectorOptions({
    inputSize,
    scoreThreshold,
  });
  const useTinyModel = true;

  // fetch image to api
  const img = await faceapi.fetchImage(blob);

  // detect all faces and generate full description from image
  // including landmark and descriptor of each face
  const fullDesc = await faceapi.detectAllFaces(img, OPTION).withFaceLandmarks(useTinyModel).withFaceDescriptors();
  return fullDesc;
};

export const createMatcher = (faceProfile: any) => {
  // Create labeled descriptors of member from profile
  const members = Object.keys(faceProfile);
  const labeledDescriptors = members.map(
    (member) =>
      new faceapi.LabeledFaceDescriptors(
        faceProfile[member].name,
        faceProfile[member].descriptors.map((descriptor: any) => new Float32Array(descriptor)),
      ),
  );

  // Create face matcher (maximum descriptor distance is 0.5)
  const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, maxDescriptorDistance);
  return faceMatcher;
};

export function isFaceDetectionModelLoaded() {
  return !!faceapi.nets.tinyFaceDetector.params;
}
