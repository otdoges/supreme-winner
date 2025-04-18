"use client";

import { useState, useEffect, useCallback } from "react";

// Add type declaration for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type SpeechRecognitionHook = {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
};

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    // Check if the browser supports SpeechRecognition
    if (typeof window !== 'undefined') {
      const browserSpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (browserSpeechRecognition) {
        const recognitionInstance = new browserSpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        
        setRecognition(recognitionInstance);
        setIsSupported(true);
      } else {
        setIsSupported(false);
      }
    }
    
    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (error) {
          console.error("Error stopping speech recognition:", error);
        }
      }
    };
  }, []);
  
  // Set up event handlers when recognition instance changes
  useEffect(() => {
    if (!recognition) return;
    
    const handleResult = (event: any) => {
      let interimTranscript = "";
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript(transcript);
        } else {
          interimTranscript += transcript;
        }
      }
      
      if (interimTranscript) {
        setTranscript(interimTranscript);
      }
    };
    
    const handleEnd = () => {
      setIsListening(false);
    };
    
    const handleError = (event: any) => {
      console.error("Speech recognition error", event);
      setIsListening(false);
    };
    
    recognition.onresult = handleResult;
    recognition.onend = handleEnd;
    recognition.onerror = handleError;
    
    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
    };
  }, [recognition]);
  
  // Start listening
  const startListening = useCallback(() => {
    if (!recognition) return;
    
    try {
      recognition.start();
      setIsListening(true);
      setTranscript("");
    } catch (error) {
      console.error("Error starting speech recognition:", error);
    }
  }, [recognition]);
  
  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognition) return;
    
    try {
      recognition.stop();
      setIsListening(false);
    } catch (error) {
      console.error("Error stopping speech recognition:", error);
    }
  }, [recognition]);
  
  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);
  
  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
} 