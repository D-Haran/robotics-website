import React from 'react'
import styles from "./metrics.module.css"

const Metrics = (props) => {
    const {metric="1"} = props
  return (
    <div className={styles.container}>{metric}</div>
  )
}

export default Metrics