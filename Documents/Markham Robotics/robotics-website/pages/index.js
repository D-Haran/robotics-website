import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Metrics from '../components/metrics'
import { useState } from 'react'

export default function Home() {
  const [metricStats, setMetricStats] = useState([])

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
          <div className={styles.addMetric} onClick={() => {setMetricStats(metricStats => ([...metricStats,metricStats.length+1]))}}>+</div>
          {metricStats.map((item, idx) => {
            return(
              <Metrics metric={item} key={idx}/>
            )
          })}
          </div>
        </div>

        <div className={styles.column}>
        <select className={styles.dropdown}>
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

        <div className={styles.column3}>
          <h2 className={styles.titles}><u>EDIT ANALYTICS</u></h2>
          <p>This is the third column.</p>
          {metricStats.map((item, idx) => {
            return(
              <div className={styles.indieStat} key={idx}>
              - {item}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
