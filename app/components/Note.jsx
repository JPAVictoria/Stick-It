import { useState, useRef, useEffect } from 'react';

export default function Note({
  id, // Ensure you pass the note id
  title,
  description,
  timestamp,
  onClick,
  setIsDragging, // Pass down setIsDragging
  setShowDeleteDialog, // Pass down setShowDeleteDialog
  setSelectedNote, // Pass down setSelectedNote
}) {
  const [isDraggingNote, setIsDraggingNote] = useState(false);
  const noteRef = useRef(null);
  const initialPosition = useRef({ x: 0, y: 0 });

  const handleDragStart = (e) => {
    setIsDraggingNote(true);
    setIsDragging(true); // Set dragging state to true
    setSelectedNote({ id, title, description }); // Set the selected note
    initialPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleDragEnd = (e) => {
    setIsDraggingNote(false);
    setIsDragging(false); // Set dragging state to false

    const dropZone = document.querySelector('.garbage-container');
    const rect = dropZone.getBoundingClientRect();

    if (
      e.clientX > rect.left &&
      e.clientX < rect.right &&
      e.clientY > rect.top &&
      e.clientY < rect.bottom
    ) {
      // Only show the delete dialog if the note is dropped within the garbage container
      setShowDeleteDialog(true);
    } else {
      // If not near the garbage, move the note back to its original position
      noteRef.current.style.transform = `translate(0px, 0px) scale(1)`;
    }
  };

  return (
    <div className="mt-4 note-container" ref={noteRef} data-id={id}>
      <div
        onClick={onClick}
        className={`note-storage note-before w-72 h-80 rounded-lg bg-[#383D41] ${isDraggingNote ? 'dragging' : ''}`}
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{
          transform: `translate(0px, 0px) scale(${isDraggingNote ? 0.8 : 1})`,
          transition: 'transform 0.1s',
        }}
      >
        <div className={`inner-container ${isDraggingNote ? 'dragging' : ''}`}>
          <div className="header-alignment flex justify-between items-start bg-[#000000] bg-opacity-25">
            <div className="text-alignment pl-4 pt-4">
              <h1 className="text-2xl font-bold text-[#D1D7E0]" id="title">
                {title}
              </h1>
              <p className="text-sm text-[#D1D7E0] pb-4" id="timestamp">
                {new Date(timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-[#D1D7E0] pl-3 pt-3" id="description" style={{ whiteSpace: 'pre-wrap' }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
