import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Metrics from '../components/metrics'
import { Fragment, useEffect, useState } from 'react'
import { motion } from "framer-motion"
import Modal from 'react-modal';
import { collection, getDocs, doc, setDoc, addDoc, getDoc, deleteField, updateDoc, deleteDoc } from "firebase/firestore";
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
  const [customMetricLabel, setCustomMetricPassLabel] = useState("")
  const [customMetricValue, setCustomMetricPassValue] = useState("")
  const metrics = ["Autonomous", "Balancing Autonomous", "Placing Items", "Drivebase", "Years Of Experience", "Notes"]

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

  const removeMetricFromTeam = async(teamNumber, label) => {
    const docRef = doc(db, 'teams', '6866', 'other_teams', teamNumber);
    await updateDoc(docRef, {
      [label]: deleteField()
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
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      <div className={styles.column}>
          <h2 className={styles.titles}><u>TEAMS</u></h2>
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
              {(teamNumberList.length == 0) &&
                <div className={styles.analyticsContainer}>
                <div><Metrics metric={"--"} /></div>
                <div><Metrics metric={"--"} /></div>
                <div><Metrics metric={"--"} /></div>
                </div>
              }
              {(teamNumberList.length == 1) &&
                <div className={styles.analyticsContainer}>
                <div onClick={() => {getTeamData(teamNumberList[0])}}>
                  <Metrics metric={teamNumberList[0]} />
                </div>
                <div><Metrics metric={"--"} /></div>
                <div><Metrics metric={"--"} /></div>
                </div>
              }
              {(teamNumberList.length == 2) &&
                <div className={styles.analyticsContainer}>
                <div className={styles.analyticContainer} onClick={() => {getTeamData(teamNumberList[0])}}>
                  <Metrics metric={teamNumberList[0]} />
                </div>
                <div className={styles.analyticContainer} onClick={() => {getTeamData(teamNumberList[1])}}>
                  <Metrics metric={teamNumberList[1]}/>
                </div>
                <div><Metrics metric={"--"} /></div>
                </div>
              }
              {(teamNumberList.length > 2) &&
                <div className={styles.analyticsContainer}>
                <div onClick={() => {getTeamData(teamNumberList[0])}}>
                  <Metrics metric={teamNumberList[0]} />
                </div>
                <div onClick={() => {getTeamData(teamNumberList[1])}}>
                  <Metrics metric={teamNumberList[1]} />
                </div>
                <div onClick={() => {getTeamData(teamNumberList[2])}}>
                  <Metrics metric={teamNumberList[2]} />
                </div>
                </div>
              }
              
            </div>
            <div className={styles.subColumn}>
              <h2 className={styles.titles}><u>MAP</u></h2>
              <div className={styles.map}>
          
          </div>
            </div>
          </div>
        </div>
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
                        <h2 className={styles.titles}><u>EDIT ANALYTICS:</u> {teamData.teamNumber}</h2>
                          <ul className={styles.table}>
                          {teamData &&
                            Object.keys(teamData).map((item, idx) => {
                              if (item != "test" && item != "teamNumber") {
                                return(
                                <motion.li 
                                animate={{scale: 1}}
                                initial={{scale:0.95}}
                                className={styles.indieStat} key={idx}>
                                  <div className={styles.tableElement}>
                                    <div>
                                      {
                                        item == "Notes" &&
                                        <div>
                                          <b>{item}:</b> <br/> {teamData[item]}
                                        </div>
                                      }
                                      {
                                        item != "Notes" &&
                                        <div>
                                          <b>{item}:</b>{teamData[item]}
                                        </div>
                                      }
                                      
                                    </div>
                                    {
                                      role == "editor" &&
                                        <div className={styles.AnalyticEditContainer}>
                                          <div className={styles.editMetric} onClick={() => {setMetricLabel(item); setMetricValue(teamData[item]); setAddMetricModal(true);}}>
                                            <div class='fa fa-edit'></div>
                                          </div>
                                          
                                          <div className={styles.removeMetric}>
                                            <div class="fa fa-trash-o" onClick={()=>{removeMetricFromTeam(teamData.teamNumber, item)}}></div>   
                                          </div>
                                        </div>
                                    }
                                    
                                    
                                  </div>
                                  
                                </motion.li>
                            )
                              }
                            
                          })}
                          </ul>
                          {role == "editor" &&
                          <Fragment>
                            {teamData.teamNumber &&
                              <Fragment>
                                <button className={styles.addMetric} onClick={() => {setAddMetricModal(true)}}>+</button>
                                <div className={styles.removeTeam}>
                                  <div class="fa fa-trash-o" onClick={()=>{removeTeam(teamData.teamNumber)}}></div>   
                                </div>
                                                         
                              </Fragment>
                            }
                          </Fragment>
                          }                          
                      </Fragment>
                        
                      <Modal
                      isOpen={addMetricModal}
                      onRequestClose={() => {setAddMetricModal(false); setMetricLabel(""); setMetricValue(null); setCustomMetricPassLabel("")}}
                      style={customStyles}
                      contentLabel="Create Metric"
                      >
                          <select className={styles.metricDropdown} value={metricLabel.length > 0 ? metrics.includes(metricLabel) ? metricLabel : "Custom-DevControl" : ""} onChange={(e) => {setMetricLabel(e.target.value); console.log(e.target.value); setMetricValue("")}}>
                            <option value="" disabled selected>Choose a Metric Label...</option>
                            <option value="Autonomous">Autonomous</option>
                            <option value="Balancing Autonomous">Balancing Autonomous</option>
                            <option value="Placing Items">Placing Items</option>
                            <option value="Drivebase">Drivebase</option>
                            <option value="Years Of Experience">Years of Experience</option>
                            <option value="Notes">Notes</option>
                            <option value="Custom-DevControl">Custom...</option>
                          </select>
                          {
                            metricLabel == "Custom-DevControl" &&
                            <Fragment>
                              <div>
                                <input className={styles.metricInput} defaultValue={customMetricLabel} onChange={(e) => {setCustomMetricPassLabel(e.target.value)}} placeholder='Metric Label'/>
                              </div>
                              <div>
                                <input className={styles.metricInput} defaultValue={metricValue} onChange={(e) => {setMetricValue(e.target.value)}} placeholder='Metric Value'/>
                              </div>
                            </Fragment>
                          }
                          {
                            metricLabel == "Autonomous" &&
                              <select className={styles.metricDropdown} onChange={(e) => {setMetricValue(e.target.value)}}>
                                <option value="" disabled selected>Choose a Metric Value...</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="Custom-DevControl">Custom Value...</option>
                              </select>
                          }
                          {
                            metricLabel == "Balancing Autonomous" &&
                              <select className={styles.metricDropdown} onChange={(e) => {setMetricValue(e.target.value)}}>
                                <option value="" disabled selected>Choose a Metric Value...</option>
                                <option value="TeleOp">TeleOp</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="God">God</option>
                                <option value="Custom-DevControl">Custom Value...</option>
                              </select>
                          }
                          {
                            metricLabel == "Drivebase" &&
                              <select className={styles.metricDropdown} onChange={(e) => {setMetricValue(e.target.value)}}>
                                <option value="" disabled selected>Choose a Metric Value...</option>
                                <option value="Tank">Tank</option>
                                <option value="Swerve Drive">Swerve Drive</option>
                                <option value="Custom-DevControl">Custom Value...</option>
                              </select>
                          }
                          {
                            metricLabel == "Placing Items" &&
                            <Fragment>
                              <div>
                                <input className={styles.metricInput} onChange={(e) => {
                                    if (e.target.value.includes("/")){
                                      e.target.value.split("/")
                                      setMetricValue(Math.round((parseInt(e.target.value.split("/")[0]) / parseInt(e.target.value.split("/")[1])) * 100) + `% (${e.target.value})`)
                                      console.log(metricValue)                                  
                                    } else if (parseInt(e.target.value) < 1) {
                                      setMetricValue(parseFloat(e.target.value) * 100)
                                    } else {
                                      setMetricValue(e.target.value)
                                    }
                                  }} placeholder='Enter a Fraction, Decimal, or Whole Number Percent'/>
                              </div>
                              <div>
                                  <p className={styles.metricInput}>{metricValue}</p>
                              </div>
                            </Fragment>
                          }
                          {
                            metricLabel == "Years Of Experience" &&
                            <div>
                              <input className={styles.metricInput} onChange={(e) => {setMetricValue(e.target.value)}} placeholder='Years of Experience'/>
                            </div>
                              
                          }
                          {
                            metricLabel == "Notes" &&
                            <div>
                              <textarea className={styles.metricTextArea} defaultValue={metricValue} onChange={(e) => {setMetricValue(e.target.value)}} placeholder='Notes...'/>
                            </div>
                          }
                          {
                            metricValue == "Custom-DevControl" &&
                            <div>
                              <input className={styles.metricInput} onChange={(e) => {setCustomMetricPassValue(e.target.value); console.log(customMetricValue)}} placeholder='Custom Value...'/>
                            </div>
                          }
                          {
                            metricLabel != "" &&
                            <Fragment>
                              {metricLabel != "Custom-DevControl" && metricValue != "Custom-DevControl" &&
                                <button onClick={()=>{addMetricToTeam(teamData.teamNumber, metricLabel, metricValue); setAddMetricModal(false); setMetricLabel(""); setMetricValue(null)}}>Submit</button>
                              }
                              {metricLabel == "Custom-DevControl" &&
                                <button onClick={()=>{addMetricToTeam(teamData.teamNumber, customMetricLabel, metricValue); setAddMetricModal(false); setMetricLabel(""); setMetricValue(null);}}>Submit Label</button>
                              }
                              {metricValue == "Custom-DevControl" &&
                                <button onClick={()=>{addMetricToTeam(teamData.teamNumber, metricLabel, customMetricValue); console.log(customMetricValue); setAddMetricModal(false); setMetricLabel(""); setMetricValue(null);}}>Submit Value</button>
                              }
                            </Fragment>
                          }
                      </Modal>
                      
                </motion.div>}
              </Fragment>
          }
            
          </Fragment>
          
        
        
        
      </main>
    </div>
  )
}
