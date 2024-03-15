import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Metrics from '../components/metrics'
import { Fragment, useEffect, useState } from 'react'
import { motion } from "framer-motion"
import Modal from 'react-modal';
import { collection, getDocs, doc, setDoc, addDoc, getDoc, deleteField, updateDoc, deleteDoc } from "firebase/firestore";
import {auth, db} from '../firebase'
import Image from 'next/image'
import CanvasDraw from "react-canvas-draw";
import {useRef} from 'react';


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
  const [savedDrawing, setSavedDrawing] = useState(null)
  const [brushRadius, setBrushRadius] = useState(10)
  const [brushColour, setBrushColour] = useState('black')
  const [access, setAccess] = useState(false)
  const [pass, setPass] = useState("")
  const canvas = useRef();
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
      zIndex: '99'
    },
    overlay: {zIndex: 1000}
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

  const verify_login = async() => {
    const docRef = doc(db, 'teams', '6866');
      const docSnap = await getDoc(docRef);
      const data = docSnap.data()
      if (pass == data.pass) {
        localStorage.setItem('access', true)
        setAccess(true)
      }
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

  const saveImageData = async() => {
    const docRef = doc(db, 'teams', '6866', 'mapImage', 'savedImage');
    await setDoc(docRef, {
      savedDrawing: canvas.current.getSaveData()
    });
  }
  const getImageData = async() => {
    const docRef = doc(db, 'teams', '6866', 'mapImage', 'savedImage');
    await getDoc(docRef);
    const docSnap = await getDoc(docRef)
    const data = docSnap.data()
    console.log(data)
    setSavedDrawing(data.savedDrawing)
    if (savedDrawing) {
      canvas.current.loadSaveData(savedDrawing)
    }
  }

  useEffect(() => {
    getImageData()
  }, [])

  useEffect(() => {setAccess(localStorage.getItem('access'))}, [])


  return (
    <div className={styles.container}>
      <Head>
        <meta name="description" content="Markham Robotics" />
      </Head>

      <main className={styles.main}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />  
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      
      {access && 
        <Fragment>
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
                        <h2 className={styles.titles}><u>{role == "editor" && 'EDIT ' }ANALYTICS:</u> {teamData.teamNumber}</h2>
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
                                          <b>{item}:</b> {teamData[item]}
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
                                <button className={styles.addMetric} onClick={() => {setAddMetricModal(true)}}>&#x2B;</button>
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
                              <br />
                                <textarea rows="4" cols="50" className={styles.metricInput} defaultValue={metricValue} onChange={(e) => {setMetricValue(e.target.value)}} placeholder='Metric Value'/>
                              </div>
                              <br />
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
                                <input className={styles.metricInput}  defaultValue={metricValue} onChange={(e) => {
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
                              <input className={styles.metricInput} defaultValue={metricValue} onChange={(e) => {setMetricValue(e.target.value)}} placeholder='Years of Experience'/>
                            </div>
                              
                          }
                          {
                            metricLabel == "Notes" &&
                            <div>
                              <textarea className={styles.metricTextArea} rows="4" cols="50" defaultValue={metricValue} onChange={(e) => {setMetricValue(e.target.value)}} placeholder='Notes...'/>
                            </div>
                          }
                          {
                            metricValue == "Custom-DevControl" &&
                            <div>
                              <input  className={styles.metricInput} onChange={(e) => {setCustomMetricPassValue(e.target.value); console.log(customMetricValue)}} placeholder='Custom Value...'/>
                            </div>
                          }
                          {
                            metricLabel != "" &&
                            <Fragment>
                              {metricLabel != "Custom-DevControl" && metricValue != "Custom-DevControl" &&
                                <button onClick={()=>{addMetricToTeam(teamData.teamNumber, metricLabel, metricValue); setAddMetricModal(false); setMetricLabel(""); setMetricValue(null)}}>Submit</button>
                              }
                              {metricLabel == "Custom-DevControl" &&
                                <button onClick={()=>{addMetricToTeam(teamData.teamNumber, customMetricLabel, metricValue); setAddMetricModal(false); setMetricLabel(""); setMetricValue(null);}}>Submit</button>
                              }
                              {metricValue == "Custom-DevControl" &&
                                <button onClick={()=>{addMetricToTeam(teamData.teamNumber, metricLabel, customMetricValue); console.log(customMetricValue); setAddMetricModal(false); setMetricLabel(""); setMetricValue(null);}}>Submit</button>
                              }
                            </Fragment>
                          }
                      </Modal>
                      
                </motion.div>}
              </Fragment>
          }
            
          </Fragment>
        
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
        {role == "editor" &&
          <Image className={styles.dropdown} onClick={() => {
              setRole("viewer")}} alt="Profile" src="/static/profile-photo-edit.png" width={100} height={100}></Image>
        }
        {role == "viewer" &&
          <Image className={styles.dropdown} onClick={() => {
              setRole("editor")}} alt="Profile" src="/static/profile-photo.png" width={100} height={100}></Image>
        }
        
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
              
            </div>
            <div className={styles.subColumn}>
              <h2 className={styles.titles}><u>MAP</u></h2>
              <div>
            <label>Brush-Radius:</label>
            <input
              type="number"
              value={brushRadius}
              onChange={e =>
                setBrushRadius(e.target.value)
              }
            />
          </div>
          <button
            onClick={saveImageData}
          >
            Save
          </button>
          <button
            onClick={() => {
              canvas.current.eraseAll();
            }}
          >
            Erase
          </button>
          <button
            onClick={() => {
              canvas.current.undo();
            }}
          >
            Undo
          </button>
          <label>Colour picker</label>
      <input
        type="color"
        value={brushColour}
        onChange={(event) => {
          console.log(event.target.value);
          setBrushColour(event.target.value);
        }}
      />
          <div >
              <CanvasDraw className={styles.map}
              disabled={role == "editor" ? false : true}
              canvasWidth={1000}
              canvasHeight={650}
              hideGrid={true} 
              brushColor={brushColour} 
              saveData={savedDrawing} 
              ref={canvas} 
              enablePanAndZoom
              clampLinesToDocument 
              loadTimeOffset={1} 
              imgSrc={'/static/map.png'} 
              brushRadius={brushRadius} 
              lazyRadius={0}/>
          </div>
          
            </div>
          </div>
        </div>
        
          

        </Fragment>
      }
    </main>
    
      {!access &&
        <div>
          <div className={styles.loginContainer}>
      <div className={styles.containerLogin}>
        <div className={styles.wrapLogin}>
          <form className={styles.loginForm} onSubmit={(e) => {e.preventDefault(); verify_login()}}>
            <span className={styles.loginFormTitle}> Markham Space Invaders #6866 </span>

            <span className={styles.loginFormTitle}>
            </span>

            <div className={styles.wrapInput}>
              <input onChange={(e) => {setPass(e.target.value)}}/>
              <span className={styles.focusInput} data-placeholder="Password"></span>
            </div>

            <div className={styles.containerLoginFormBtn}>
              <button className={styles.loginFormBtn}>Login</button>
            </div>

            
          </form>
        </div>
      </div>
    </div>

        </div>
      }
      
      </div>
  )
}
