import { Card } from 'antd';
import React from 'react'

export default function Information(props) {
  return (
    <div>
         <Card title="Information">
            <Card type="inner" title="File Information" >
              <p>Job ID: {props.fileinfo.fileId}</p>
              <p>File type: {props.fileinfo.filerename}</p>
              <p>File name: {props.fileinfo.filetype}</p>
              <p>File bites: {props.info.bit_size}</p>
              <p>Segment number: {props.info.segment_number}</p>
            </Card>
            <Card
            style={{
                marginTop: 16,
            }}
            type="inner"
            title="DNA Encode Information"
            >
              <p>DNA number:</p>
              <p>Single_DNA_length:</p>
              <p>Information_density:</p>
              <p>Net_information_density:</p>
            </Card> 
        </Card>
      </div>
  )
}



