'use client'
import { useState, useRef } from 'react'
import Webcam from 'react-webcam'
import { Button } from "@/components/ui/button"
import { Camera, X, RefreshCw, Loader2 } from "lucide-react"
import { createWorker } from 'tesseract.js'
import styles from './page.module.css'

export default function RecipeSave() {
  const [showCamera, setShowCamera] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const webcamRef = useRef(null)

  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "environment"
  }

  const extractText = async (imageSrc) => {
    const worker = createWorker({
      logger: m => console.log(m)
    });

    try {
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(imageSrc);
      setExtractedText(text);
      await worker.terminate();
    } catch (error) {
      console.error('Error extracting text:', error);
      setExtractedText('Error extracting text. Please try again.');
    }
  };

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setCapturedImage(imageSrc)
    setShowCamera(false)
    
    // Extract text from image
    setIsProcessing(true)
    await extractText(imageSrc)
    setIsProcessing(false)
  }

  const handleRetake = () => {
    setCapturedImage(null)
    setExtractedText('')
    setShowCamera(true)
  }

  return (
    <div className={styles.container}>
      {!showCamera && !capturedImage && (
        <Button 
          size="lg"
          className={styles.takePhotoButton}
          onClick={() => setShowCamera(true)}
        >
          <Camera className="mr-2 h-5 w-5" />
          Take Photo
        </Button>
      )}

      {showCamera && (
        <div className={styles.cameraContainer}>
          <Button 
            size="icon"
            variant="outline"
            className={styles.closeButton}
            onClick={() => setShowCamera(false)}
          >
            <X className="h-5 w-5" />
          </Button>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
          <Button 
            size="lg"
            variant="secondary"
            className={styles.captureButton}
            onClick={capture}
          >
            <Camera className="mr-2 h-5 w-5" />
            Capture Photo
          </Button>
        </div>
      )}

      {capturedImage && (
        <div className={styles.resultContainer}>
          <div className={styles.imagePreview}>
            <img src={capturedImage} alt="Captured recipe" />
            <Button 
              size="lg"
              variant="destructive"
              className={styles.retakeButton}
              onClick={handleRetake}
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Retake Photo
            </Button>
          </div>

          <div className={styles.textContainer}>
            <h2 className={styles.textTitle}>Extracted Text</h2>
            {isProcessing ? (
              <div className={styles.loadingState}>
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Processing image...</p>
              </div>
            ) : (
              <div className={styles.extractedText}>
                {extractedText || 'No text extracted. Try taking another photo.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
