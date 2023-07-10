import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Metrics from '../components/metrics'
import { useState } from 'react'
import { motion } from "framer-motion"

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

        <button onClick={() => {setCollapsible(!collapsible)}}>
        Collapse
        </button>

          {
            collapsible == false &&
            <div className={styles.column3}>
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
          }
      </main>
    </div>
  )
}
