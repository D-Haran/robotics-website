import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Fragment, useEffect, useState } from 'react'
import axios from 'axios';
import { motion } from 'framer-motion';
import PastSummary from '../components/pastSummary';
import Modal from 'react-modal';

export default function Home() {
  const [bookPrompt, setBookPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [bookSummary, setBookSummary] = useState("")
  const [summaryLoaded, setSummaryLoaded] = useState(false)
  const [modalIsOpen, setIsOpen] = useState(false);
  var numOfPastSummaries = 0
  const pastSummaries = {'hey':'hey'}

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  function openModal() {
    setIsOpen(true);
  }


  function closeModal() {
    setIsOpen(false);
  }

  const handleSubmit = async (bookPrompt) => {
    const bookTitleAndAuthor = JSON.stringify({
      bookTitleAndAuthor: bookPrompt
    })
    setIsGenerating(true);
    const res = await fetch("/api/createMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bookTitleAndAuthor,
    });
    setIsGenerating(false);
    const data = await res.json();
    setBookSummary(data.bookSummary);
    localStorage.setItem(bookPrompt, data.bookSummary.content)
  };

  // useEffect(() => {
  //     var input = document.getElementById("book");
  // input.addEventListener("keypress", function(e) {
  //   // If the user presses the "Enter" key on the keyboard
  //   if (e.key === "Enter") {
  //     // Cancel the default action, if needed
  //     // e.preventDefault()
  //     handleSubmit(bookPrompt)
  //     setSummaryLoaded(!summaryLoaded)
  //   }
  // });
  // }, [])

  function allStorage() {
    for (var i = 0; i<localStorage.length; i++) {
        pastSummaries[i] = localStorage.getItem(localStorage.key(i));
        numOfPastSummaries += 1
    }
  }
  useEffect(() => {
    allStorage()
  }, [modalIsOpen])

  return (
    <div className={styles.container}>
    <div className={summaryLoaded ? styles.titleSmall : styles.title}>
    <h1 style={{ fontSize: summaryLoaded ? '16px' : '32px' }}>QuickLit: AI Book Summarizer</h1>
    <motion.div style={{ left: 0 }} animate={summaryLoaded ? {scale:0.8, height:'100px', width:0} : {}} className={summaryLoaded ? styles.inputContainerSmall : styles.inputContainer}>
    {!summaryLoaded ? (
      <Fragment>
          <form onSubmit={() => {handleSubmit(bookPrompt); setSummaryLoaded(!summaryLoaded)}}>
          <input
              type="text"
              id="book"
              className={styles.bookInput}
              autoFocus
              onChange={(e) => {const bookTitleAndAuthor = bookPrompt; setBookPrompt(e.target.value);}}
              placeholder="Enter book title and author"
            />
        </form>
      </Fragment>
         
    ): (
      <div>
      <input
          type="text"
          id="book"
          className={styles.bookInput}
          autoFocus
          disabled
          style={{background:'none'}}
          value={bookPrompt}
          onChange={(e) => {const bookTitleAndAuthor = bookPrompt; setBookPrompt(e.target.value);}}
          placeholder="Enter book title and author"
        />
    </div>
    )}

    <Modal
    isOpen={modalIsOpen}
    onRequestClose={closeModal}
    style={customStyles}
    ariaHideApp={false}>
          <h1>Past Summaries</h1>
          <div>
            <p>hey</p>
            {
                [Object.keys(pastSummaries)].map((item, idx) => {
                  <div key={idx}>
                  <h1>hello</h1>
                    <PastSummary title={item}/>
                  </div>
                
              })
            }
          </div>
          
          
          
    </Modal>
    </motion.div>
    
    </div>
    {bookSummary.content && 
      <div className={styles.summaryContainer} dangerouslySetInnerHTML={{ __html: bookSummary.content }} >
      </div>
      
    }
    {isGenerating &&
      <div>
      <progress className={styles.loading}></progress>
      </div>
    }
  </div>
  )
}

// <button onClick={handleSubmit}>&#8594;</button>
// <button className={styles.historyButton} onClick={openModal}><Image alt='Past Summaries Button' src={'/static/pastSummariesIcon.svg'} width={50} height={50} /></button>