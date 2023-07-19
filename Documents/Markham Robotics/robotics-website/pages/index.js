import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Metrics from '../components/metrics'
import { Fragment, useEffect, useState } from 'react'
import { motion } from "framer-motion"
import Modal from 'react-modal';
import { collection, getDocs, doc, setDoc, addDoc, getDoc, getCountFromServer, updateDoc, deleteDoc } from "firebase/firestore";
import {auth, db} from '../firebase'


export default function Home() {
  const [metricStats, setMetricStats] = useState([])
  var teams = {}
  const [role, setRole] = useState("editor")
  const [collapsible, setCollapsible] = useState(false)
  const [modalIsOpen, setIsOpen] = useState(false);
  const [teamNumber, setTeamNumber] = useState(0);
  const [teamData, setTeamData] = useState(null)
  const [renew, setRenew] = useState(true)
  const [teamNumberList, setTeamNumberList] = useState([])
  const [addMetricModal, setAddMetricModal] = useState(false)
  const [metricLabel, setMetricLabel] = useState("")
  const [metricValue, setMetricValue] = useState("")

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      background: 'black',
      transform: 'translate(-50%, -50%)',
    },
  };

  const renewTeams = () => {
      setRenew(!renew)
  }

  function openModal() {
    setIsOpen(true);
  }


  function closeModal() {
    setIsOpen(false);
  }

  const getTeamData = async(teamNumber) => {
      const docRef = doc(db, 'teams', '6866', 'other_teams', teamNumber);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data()
      data['teamNumber'] = docSnap.id
      setTeamData(data)
      setCollapsible(false)    
  }
  const getTeams = async(teamNumber) => {
    const collectionRef = collection(db, 'teams', teamNumber, 'other_teams');
    const docSnap = await getDocs(collectionRef);
    
    docSnap.forEach(doc => {
      console.log(doc.id);
      teams[doc.id] = doc.data()
      setTeamNumberList(Object.keys(teams))
    })
  }

  const addTeam = async(teamNumber) => {
    const docRef = doc(db, 'teams', '6866', 'other_teams', teamNumber);
    await setDoc(docRef, {
      test: "test"
    });
    setRenew(!renew)
  }

  const removeTeam = async(teamNumber) => {
    const docRef = doc(db, 'teams', '6866', 'other_teams', teamNumber);
    await deleteDoc(docRef);
    setTeamData({})
    setCollapsible(true)
    setRenew(!renew)
  }

  const addMetricToTeam = async(teamNumber, label, value) => {
    const docRef = doc(db, 'teams', '6866', 'other_teams', teamNumber);
    await updateDoc(docRef, {
      [label]: value
    });
    getTeamData(teamNumber)
  }

  useEffect(() => {
    getTeams('6866')
  }, [renew])

  return (
    <div className={styles.container}>
      <Head>
        <meta name="description" content="Markham Robotics" />
      </Head>

      <main className={styles.main}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />  
      <div className={styles.column}>
          <h2 className={styles.titles}><u>ALL TEAMS</u></h2>
          <p>This is the first column.</p>
          <div className={styles.metricContainer}>
          {role == "editor" &&
            <motion.div className={styles.addTeam} animate={{scale: 1}} transition={{ delay: 0.01 }}
            initial={{scale:0.5}} onClick={openModal}>+</motion.div>
        }
        <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2>Enter Team Number</h2>
        <input maxLength={5} onChange={(e) => {setTeamNumber(e.target.value); console.log(e.target.value)}} placeholder='TEAM NUMBER'/>
        <button onClick={() => {addTeam(teamNumber); closeModal()}}>Submit</button>
      </Modal>
          {teamNumberList.map((item, idx) => {
            console.log(item)
            return(
              <motion.div className={styles.gridStat} key={idx} animate={{scale: 1}}
              initial={{scale:0.75}} whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }} onClick={() => {getTeamData(item)}}>
                <Metrics metric={item} renew={renewTeams}/>
              </motion.div>
            )
          })}
          </div>
        </div>

        <div className={styles.column}>
        <select className={styles.dropdown}onChange={(e) => {setRole(e.target.value)}}>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <div className={styles.split}>
            <div className={styles.subColumn1}>
            {
              role == "editor" &&
              <Fragment>
              {
              collapsible == true &&
              <motion.button onClick={() => {setCollapsible(!collapsible)}} className={styles.collapseClosed} animate={{x: 0}} initial={{x:100}} transition={{ ease: "easeInOut" }}>
              <span class="material-symbols-outlined">
              arrow_back_ios
              </span>
              </motion.button>
          }
              </Fragment>
            }
              <h2 className={styles.titles}><u>ANALYTICS</u></h2>
              <p>This is the first sub-column of the second column.</p>
              {(teamNumberList.length == 0) &&
                <div className={styles.analyticsContainer}>
                <Metrics metric={"--"} />
                <Metrics metric={"--"} />
                <Metrics metric={"--"} />
                </div>
              }
              {(teamNumberList.length == 1) &&
                <div className={styles.analyticsContainer}>
                <Metrics metric={teamNumberList[0]} />
                <Metrics metric={"--"} />
                <Metrics metric={"--"} />
                </div>
              }
              {(teamNumberList.length == 2) &&
                <div className={styles.analyticsContainer}>
                <Metrics metric={teamNumberList[0]} />
              <Metrics metric={teamNumberList[1]}/>
              <Metrics metric={"--"} />
                </div>
              }
              {(teamNumberList.length > 2) &&
                <div className={styles.analyticsContainer}>
                <Metrics metric={teamNumberList[0]} />
              <Metrics metric={teamNumberList[1]}/>
              <Metrics metric={teamNumberList[2]}/>
                </div>
              }
              
            </div>
            <div className={styles.subColumn}>
              <h2 className={styles.titles}><u>MAP</u></h2>
              <p>This is the second sub-column of the second column.</p>
              <div className={styles.map}>
          
          </div>
            </div>
          </div>
        </div>
        {
          role == "editor" &&
          <Fragment>
          {
            teamData != null &&
            <Fragment>
                {
                  collapsible == false &&
                  <motion.div className={styles.column3} animate={{x: 0}} initial={{x:"50%"}}>
                  <motion.button onClick={() => {setCollapsible(!collapsible)}} className={styles.collapse}  animate={{scale: 1}}
                  initial={{scale:0}}>
                  <span class="material-symbols-outlined">
                  arrow_forward_ios
                  </span>
                    </motion.button>

                      <Fragment>
                        <h2 className={styles.titles}><u>EDIT ANALYTICS</u></h2>
                          <p>This is the third column.</p>
                          <ul className={styles.table}>
                          {teamData &&
                            Object.keys(teamData).map((item, idx) => {
                              if (item != "test") {
                                return(
                                <motion.li 
                                animate={{scale: 1}}
                                initial={{scale:0.95}}
                                className={styles.indieStat} key={idx}>
                                  <div className={styles.tableElement}>
                                    {item}: {teamData[item]}
                                  </div>
                                </motion.li>
                            )
                              }
                            
                          })}
                          </ul>
                          {teamData.teamNumber &&
                            <Fragment>
                              <button className={styles.addMetric} onClick={() => {setAddMetricModal(true)}}>+</button>
                              <button onClick={()=>{removeTeam(teamData.teamNumber)}}>Remove Team</button>                            
                            </Fragment>

                          }
                          
                      </Fragment>
                        
                      <Modal
                      isOpen={addMetricModal}
                      onRequestClose={() => {setAddMetricModal(false)}}
                      style={customStyles}
                      contentLabel="Example Modal"
                      >
                          <input onChange={(e) => {setMetricLabel(e.target.value)}} placeholder='METRIC Label'/>
                          <input onChange={(e) => {setMetricValue(e.target.value)}} placeholder='METRIC Value'/>
                          <button onClick={()=>{addMetricToTeam(teamData.teamNumber, metricLabel, metricValue); setAddMetricModal(false)}}>Submit</button>
                      </Modal>
                      
                </motion.div>}
              </Fragment>
          }
            
          </Fragment>
          
          
        }
        
      </main>
    </div>
  )
}
