import React from 'react'

export default function Instructions() {
  return (
            <div>
              <h2 id="instructionsHeading">HOW TO PLAY:</h2>
              {/* Explain how the application works */}
              <ul id="instructText">
                <li className="instruction">
                  Select a quiz from the list
                </li>
                <li className="instruction">
                  Select the optional timer option
                </li>
                <li className="instruction">
                  Each quiz consists of 5 multiple choice questions
                </li>
                <li className="instruction">
                  Users are not authorized to play quizzes they created
                </li>
              </ul>
          </div>
  )
}
