import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Metrics from '../components/metrics'
import { Fragment, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"


export default function Home() {
  const [metricStats, setMetricStats] = useState([])
  const [role, setRole] = useState("editor")
  const [collapsible, setCollapsible] = useState(false)

  return (
    <div className={styles.container}>
      <Head>
        <meta name="description" content="Markham Robotics" />
      </Head>

      <main className={styles.main}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />  
      <div className={styles.column}>
          <h2 className={styles.titles}><u>MORE METRICS</u></h2>
          <p>This is the first column.</p>
          <div className={styles.metricContainer}>
          {role == "editor" &&
            <motion.div className={styles.addMetric} animate={{scale: 1}} transition={{ delay: 0.01 }}
            initial={{scale:0.5}} onClick={() => {setMetricStats(metricStats => ([...metricStats,metricStats.length+1]))}}>+</motion.div>
        }
          {metricStats.map((item, idx) => {
            return(
              <motion.div className={styles.gridStat} key={idx} animate={{scale: 1}}
              initial={{scale:0.75}}>
                <Metrics metric={item}/>
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
              {(metricStats.length == 0) &&
                <div className={styles.analyticsContainer}>
                <Metrics metric={"--"} />
                <Metrics metric={"--"} />
                <Metrics metric={"--"} />
                </div>
              }
              {(metricStats.length == 1) &&
                <div className={styles.analyticsContainer}>
                <Metrics metric={metricStats[metricStats.length - 1]} />
                <Metrics metric={"--"} />
                <Metrics metric={"--"} />
                </div>
              }
              {(metricStats.length == 2) &&
                <div className={styles.analyticsContainer}>
                <Metrics metric={metricStats[metricStats.length - 1]} />
              <Metrics metric={metricStats[metricStats.length - 2]}/>
              <Metrics metric={"--"} />
                </div>
              }
              {(metricStats.length > 2) &&
                <div className={styles.analyticsContainer}>
                <Metrics metric={metricStats[metricStats.length - 1]} />
              <Metrics metric={metricStats[metricStats.length - 2]}/>
              <Metrics metric={metricStats[metricStats.length - 3]}/>
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
        <AnimatePresence>
        {
          role == "editor" &&
          <Fragment>
            {
              collapsible == false &&
              <motion.div className={styles.column3} animate={{x: 0}} initial={{x:"50%"}} exit={{x:"100%"}}>
              <motion.button onClick={() => {setCollapsible(!collapsible)}} className={styles.collapse}  animate={{scale: 1}}
              initial={{scale:0}}>
              <span class="material-symbols-outlined">
              arrow_forward_ios
              </span>
                </motion.button>

                  
                    <div>
                    <h2 className={styles.titles}><u>EDIT ANALYTICS</u></h2>
                    <p>This is the third column.</p>
                    <ul className={styles.table}>
                    {metricStats.map((item, idx) => {
                      return(
                          <motion.li 
                          animate={{scale: 1}}
                          initial={{scale:0.95}}
                          className={styles.indieStat} key={idx}>
                            <div className={styles.tableElement}>
                              {item}
                            </div>
                          </motion.li>
                      )
                    })}
                    </ul>
                    
                  </div>
                  
            </motion.div>}
          </Fragment>
          
        }
        </AnimatePresence>
        
      </main>
    </div>
  )
}
