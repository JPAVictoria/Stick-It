"use client";

import '@/app/styles/instructions.css';
import '@/app/globals.css';
import Navbar from '@/app/components/Navbar';

export default function Instructions() {
  
  
    return (
    <div>
    <Navbar />
    <div className="instructions-container">
      <h1 className="text-center heading-text fade-in">How To Use the Application</h1>
      <div className="list-wrapper">
        <ol className="list">
          <li className="slide-right delay-1">To add a note, simply click the button "<b>Add a note</b>".</li>
          <br />
          <li className="slide-right delay-2">To edit an existing note, <b>click</b> the note itself.</li>
          <br />
          <li className="slide-right delay-3">To delete a note, <b>drag</b> a note to the garbage bin.</li>
          <br />
          <li className="slide-right delay-3">If a <b>filter is applied</b>, you cannot add a note. You must reset the filter.</li>
        </ol>
      </div>
    </div>
    </div>
  );
}
