


import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import NoteCard from "./NoteCard";
import RecordingBar from "./RecordingBar";
import axios from "axios";
import toast from "react-hot-toast";

// Import the resetTranscript function
// const { resetTranscript } = SpeechRecognition;

function Home() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useOutletContext();
  const [textToCopy, setTextToCopy] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000,
  });

  const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();

  // Function to start recording
  // Function to start recording
    const startListening = () => {
        console.log("Starting Speech Recognition...");
        // Reset transcript so that new recording starts fresh
        resetTranscript();
        setIsRecording(true);
        SpeechRecognition.startListening({
        continuous: true,
        interimResults: true,
        language: "en-IN",
        });
    };
  

//   Function to stop recording and create a note
  const stopListening = async () => {
    SpeechRecognition.stopListening();
    setIsRecording(false);

    if (transcript) {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/notes/create`,
          {
            title: "Voice Note",
            content: transcript,
            type: "audio"  // Ensure the note is marked as audio
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          // Refresh the notes list from the API
          fetchNotes();
          toast.success("Note created successfully");
          // Clear the transcript so the preview card disappears
          resetTranscript();
        }
      } catch (error) {
        console.error("Error creating note:", error);
      }
    }
  };



  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/notes/getAllNotes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setNotes(response.data.data);
        setFilteredNotes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [setFilteredNotes]);

  useEffect(() => {
    setTextToCopy(transcript);
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <div>Browser doesn't support speech recognition.</div>;
  }

  return (
    <div className="p-6 pb-32">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard key={note._id} {...note} onUpdate={fetchNotes} />
          ))}

          {/* Show the preview note only while recording */}
          {isRecording && transcript && (
            <NoteCard
              title="New Recording"
              content={transcript}
              createdAt={new Date().toLocaleString()}
              updatedAt={new Date().toLocaleString()}
              type="audio"
              isPreview={true}
            />
          )}
        </div>
      </div>
      <RecordingBar
        onStartRecording={startListening}
        onStopRecording={stopListening}
        isRecordingg={isRecording}
        onNoteCreated={fetchNotes} 
      />
    </div>
  );
}

export default Home;
