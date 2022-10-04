import { Card } from 'antd';
import React from 'react'

export default function Information(props) {
  return (
    <div>
         <Card title="Information">
            <Card type="inner" title="File Information" >
              <p>Job ID:</p>
              <p>File type:</p>
              <p>File name:</p>
              <p>File bites:</p>
              <p>Segment number:</p>
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



