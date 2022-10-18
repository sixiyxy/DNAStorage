import { Card } from 'antd';
import React from 'react'


export default function Information(props) {
  return (
    <div>
            <Card type="inner" title="File Information" style={{paddingBottom:'145px'}}>
              <p>Job ID: {props.fileinfo.fileId}</p>
              <p>File name: {props.fileinfo.filerename}</p>
              <p>File type: {props.fileinfo.filetype}</p>
              <p>File bites: {props.info.bit_size}</p>
              <p>File bytes: {props.info.byte_size}</p>
            </Card>
            
      </div>
  )
}



