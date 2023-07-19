import React from 'react'
import styles from "./metrics.module.css"
import { collection, getDocs, doc, setDoc, addDoc, getDoc, getCountFromServer, updateDoc, deleteDoc } from "firebase/firestore";
import {auth, db} from '../firebase'

const Metrics = (props) => {
    const {metric="1"} = props

  return (
    <div className={styles.container}>
      {metric}
    </div>
  )
}

export default Metrics